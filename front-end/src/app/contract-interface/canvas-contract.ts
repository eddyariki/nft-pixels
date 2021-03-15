import {
    SmartContract, Address, ProxyProvider, ContractFunction,
    Transaction, TransactionPayload, Balance, GasLimit, WalletProvider, IDappProvider
} from "@elrondnetwork/erdjs";
import { environment } from "src/environments/environment";

const production = environment.production;

interface Canvas {
    rgbArray: number[]
}

export default class CanvasContract {
    contract: SmartContract;
    proxyProvider: ProxyProvider;
    //signer provider later

    constructor(contractAddress = '', provider?: ProxyProvider, signer?: IDappProvider) {
        if (production) {
            const address = new Address(contractAddress);
            this.contract = new SmartContract({ address });
            this.proxyProvider = provider;
            //signer provider later
        }
    }

    private generateRGBArray(w: number, h: number) {
        let rgbArray = [];
        for (let i = 0; i < w * h; i++) {
            rgbArray[i] = (Math.random() * 255, Math.random() * 255, Math.random() * 255);
        }
        return rgbArray;
    }

    public async getCanvas(): Promise<Canvas> {
        if (!production) {
            const a = await this.generateRGBArray(500, 500);
            const canvas: Canvas = { rgbArray: a };
            return canvas;
        }
    }


}