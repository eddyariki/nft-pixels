import { ThrowStmt } from '@angular/compiler';
import { DomSanitizer } from '@angular/platform-browser';
import {
    SmartContract, Address, ProxyProvider, ContractFunction,
    Transaction, TransactionPayload, Balance, GasLimit, WalletProvider, IDappProvider, Argument
} from '@elrondnetwork/erdjs';
import { environment } from 'src/environments/environment';
import { User } from './user';

const production = environment.production;

class Canvas {
    bitmap: Uint8Array;
    dataURL: string;
    constructor(dimensions: number[], bitmap: Uint8Array) {
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
    user: User;

    constructor(contractAddress = '', provider?: ProxyProvider, usr?: User) {
        const address = new Address(contractAddress);
        this.contract = new SmartContract({ address });
        this.proxyProvider = provider || null;
        this.user = usr||null;

    }


    //Public

    //Getters
    public async getCanvas(canvasId: number): Promise<Canvas> {
        if (!this.proxyProvider) {
            const a = await this._generateRGBAArray(500, 500);
            const dimensions = [500, 500];
            const canvas: Canvas = new Canvas(dimensions, a);
            return canvas;
        }
        const rgbArray = await this._query_get_canvas(canvasId);
        const dimensions = await this._query_get_canvas_dimensions(canvasId);
        const rgbaArray = await this._generateRGBAArray(dimensions[0], dimensions[1], rgbArray);
        const canvas: Canvas = new Canvas(dimensions, rgbaArray);
        return canvas;
    }


    public async getCanvasDimensions(canvasId: number): Promise<number[]> {
        if (!this.proxyProvider) {
            const a = await [500, 500];
            return a;
        }
        const dimensions = await this._query_get_canvas_dimensions(canvasId);
        return dimensions;
    }

    public async getCanvasTotalPixelSupply(canvasId: number): Promise<number> {
        if (!this.proxyProvider) {
            const a = 500*500;
            return a;
        }
        const total_pixel_supply = await this._queryGetCanvasTotalPixelSupply(canvasId);
        return total_pixel_supply[0];
    }







    //Private make more dry later
    private async _query_get_canvas(canvasId: number): Promise<Uint8Array> {
        const func = new ContractFunction("getCanvas");
        const qResponse = await this.contract.runQuery(
            this.proxyProvider,
            {
                func,
                args: [Argument.fromNumber(canvasId)]
            });
        qResponse.assertSuccess();
        const returnData = qResponse.returnData;
        const rgbArrayRaw = new Uint8Array(qResponse.returnData.length);
        for (let i = 0; i < returnData.length; i++) {
            rgbArrayRaw[i] = returnData[i].asNumber;
        }
        return rgbArrayRaw;
    }

    private async _query_get_canvas_dimensions(canvasId: number): Promise<number[]> {
        const func = new ContractFunction("getCanvasDimensionsTopEncoded");
        const qResponse = await this.contract.runQuery(
            this.proxyProvider,
            {
                func,
                args: [Argument.fromNumber(canvasId)]
            });
        qResponse.assertSuccess();
        const returnData = qResponse.returnData;
        const dimensions = []
        for (let i = 0; i < returnData.length; i++) {
            dimensions[i] = returnData[i].asNumber;
        }
        return dimensions;
    }

    private async _queryGetCanvasTotalPixelSupply(canvasId: number): Promise<number[]> {
        const func = new ContractFunction("getCanvasDimensionsTopEncoded");
        const qResponse = await this.contract.runQuery(
            this.proxyProvider,
            {
                func,
                args: [Argument.fromNumber(canvasId)]
            });
        qResponse.assertSuccess();
        const returnData = qResponse.returnData;
        const dimensions = []
        for (let i = 0; i < returnData.length; i++) {
            dimensions[i] = returnData[i].asNumber;
        }
        return dimensions;
    }


    private _generateRGBAArray(w: number, h: number, rgbArray?: Uint8Array): Uint8Array {
        let count = 0;
        let rgbArrayCount = 0;
        let rgbaArray = new Uint8Array(w * h * 4);

        for (let i = 0; i < w * h * 4; i++) {
            if (count === 3) {
                rgbaArray[i] = 255;
                count = 0;
            } else {
                rgbaArray[i] = rgbArray[rgbArrayCount];
                rgbArrayCount++;
                count++;
            }
        }
        console.log(rgbaArray.slice(0, 8));
        return rgbaArray;
    }
}
