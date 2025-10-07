import {ISignedMessage} from "./ISignedMessage";

export abstract class CryptoWallet {

  protected constructor() {
  }

  abstract getId(): string;
  abstract getName(): string;
  abstract isAvailableOnMobileOrTablet(): boolean;
  abstract getLogoAddress(): string;
  abstract isInstalled(): boolean;
  abstract redirectIntoWalletDAppPage(): void;
  abstract showWalletOfficialInstallPage(): void;
  abstract enable(): Promise<any>;
  abstract getAddress(): Promise<string>;
  abstract signData(data: string): Promise<ISignedMessage>;
  abstract sendTransfer(address: string, amount: number): Promise<string>;
}
