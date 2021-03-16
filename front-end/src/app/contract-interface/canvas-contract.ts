import { DomSanitizer } from '@angular/platform-browser';
import {
    SmartContract, Address, ProxyProvider, ContractFunction,
    Transaction, TransactionPayload, Balance, GasLimit, WalletProvider, IDappProvider
} from '@elrondnetwork/erdjs';
import { environment } from 'src/environments/environment';

const production = environment.production;

class Canvas {
    bitmap: Uint8Array;
    dataURL: string;
    constructor(dimensions: number[], bitmap: Uint8Array){
        this.bitmap = bitmap;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = dimensions[0];
        canvas.height = dimensions[1];
        const idata = ctx.createImageData(dimensions[0], dimensions[1]);
        idata.data.set(bitmap);
        ctx.putImageData(idata, 0, 0);
        this.dataURL = canvas.toDataURL();

    }
}

export default class CanvasContract {
    contract: SmartContract;
    proxyProvider: ProxyProvider;
    // signer provider later

    constructor(contractAddress = '', provider?: ProxyProvider, signer?: IDappProvider) {
        if (production) {
            const address = new Address(contractAddress);
            this.contract = new SmartContract({ address });
            this.proxyProvider = provider;
            // signer provider later
        }
    }

    private generateRGBArray(w: number, h: number): Uint8Array{
        const rgbArray = new Uint8Array(w * h * 4);
        let count = 0;
        for (let i = 0; i < w * h * 4; i++) {
            if (count === 3){
                rgbArray[i] = 255;
                count = 0;
            }else{
                rgbArray[i] = 50;
                count++;
            }
        }
        console.log(rgbArray.slice(0, 8));
        return rgbArray;
    }

    public async getCanvas(): Promise<Canvas> {
        if (!production) {
            const a = await this.generateRGBArray(500, 500);
            const dimensions = [500, 500];
            const canvas: Canvas = new Canvas(dimensions, a);
            return canvas;
        }
    }


}
