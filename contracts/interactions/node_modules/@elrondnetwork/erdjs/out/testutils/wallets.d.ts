/// <reference types="node" />
import { Address } from "../address";
import { ISigner } from "../interface";
export declare class TestWallets {
    mnemonic: string;
    password: string;
    alice: TestWallet;
    bob: TestWallet;
    carol: TestWallet;
    constructor();
}
export declare class TestWallet {
    readonly address: Address;
    readonly secretKeyHex: string;
    readonly secretKey: Buffer;
    readonly signer: ISigner;
    readonly keyFileObject: any;
    readonly pemFileText: any;
    constructor(address: Address, secretKeyHex: string, keyFileObject: any, pemFileText: any);
}
