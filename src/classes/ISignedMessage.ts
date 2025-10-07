export interface ISignedMessage {
  address: string;
  stakeAddress: string;
  signature: string | unknown[];
  key: string;
}
