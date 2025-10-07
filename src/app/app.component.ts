import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SolanaMetamaskWallet} from "../classes/SolanaMetamaskWallet";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Solana Wallet Standard Metamask Transaction Request';
  walletInstance: SolanaMetamaskWallet;

  constructor() {
    this.walletInstance = new SolanaMetamaskWallet();
  }

  async requestSolTransaction() {
    // Example call to send 0.01 SOL to a new address
    const trxId = await this.walletInstance.sendTransfer("DfmGdQph8UD5B5tDjNXfykgHgwZMguZq5WJJXsBpdCox", 10000000);
    console.log(trxId);
  }
}
