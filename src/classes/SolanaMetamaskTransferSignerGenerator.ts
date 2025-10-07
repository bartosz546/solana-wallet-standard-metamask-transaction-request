import {address, getTransactionEncoder, SignatureBytes,} from "@solana/kit";
import {SolanaSignAndSendTransaction, SolanaSignAndSendTransactionFeature} from "@solana/wallet-standard-features";
import {getWalletAccountFeature, UiWalletAccount} from "@wallet-standard/ui";
import {Wallet} from "@wallet-standard/core";
import {
  getOrCreateUiWalletForStandardWallet_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  getWalletAccountForUiWalletAccount_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
} from "@wallet-standard/ui-registry";
// Or fucking promoted for excavating the solana transfer request interface from your extremely poor source code

export class SolanaMetamaskTransferSignerGenerator {

  public static getTransactionSendingSigner(wallet: Wallet, chain: string, senderAddress: string) {
    const uiWallet = getOrCreateUiWalletForStandardWallet_DO_NOT_USE_OR_YOU_WILL_BE_FIRED(wallet);
    const uiWalletAccount = uiWallet.accounts.find((uiAccount) => uiAccount.address === senderAddress) ?? uiWallet.accounts[0];
    const signAndSendTransaction = SolanaMetamaskTransferSignerGenerator.useSignAndSendTransaction(uiWalletAccount, chain);

    return {
      address: address(uiWalletAccount.address),
      async signAndSendTransactions(transactions: Array<any>, config = {}) {
        const { ...options} = config;
        const transactionEncoder = getTransactionEncoder();
        if (transactions.length === 0) {
          return [];
        }
        const [transaction] = transactions;
        const wireTransactionBytes = transactionEncoder.encode(transaction);
        const inputWithOptions = {
          ...options,
          transaction: wireTransactionBytes as Uint8Array,
        };
        const {signature} = await signAndSendTransaction(inputWithOptions);
        return Object.freeze([signature as SignatureBytes]);
      }
    }
  }

  public static useSignAndSendTransaction(uiWalletAccount: UiWalletAccount, chain: string) {
    const signAndSendTransactions = SolanaMetamaskTransferSignerGenerator.useSignAndSendTransactions(uiWalletAccount, chain);
    return (async input => {
        const [result] = await signAndSendTransactions(input);
        return result;
      })
  }

  public static useSignAndSendTransactions(uiWalletAccount: UiWalletAccount, chain: string) {
    const signAndSendTransactionFeature = getWalletAccountFeature(
      uiWalletAccount,
      SolanaSignAndSendTransaction,
    ) as SolanaSignAndSendTransactionFeature[typeof SolanaSignAndSendTransaction];
    const account = getWalletAccountForUiWalletAccount_DO_NOT_USE_OR_YOU_WILL_BE_FIRED(uiWalletAccount);
    return (async (...inputs: any[]) => {
        const inputsWithChainAndAccount = inputs.map(({ options, ...rest }) => {
          const minContextSlot = options?.minContextSlot;
          return {
            ...rest,
            account,
            chain,
            ...(minContextSlot != null
              ? {
                options: {
                  minContextSlot: Number(minContextSlot),
                },
              }
              : null),
          };
        });
      return await signAndSendTransactionFeature.signAndSendTransaction(...inputsWithChainAndAccount);
      })
  }
}
