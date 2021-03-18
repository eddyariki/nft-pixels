import { analyzeAndValidateNgModules, ThrowStmt } from '@angular/compiler';
import { DomSanitizer } from '@angular/platform-browser';
import {
    SmartContract, Address, ProxyProvider, ContractFunction,
    Transaction, TransactionPayload, Balance, GasLimit, WalletProvider, IDappProvider, Argument
} from '@elrondnetwork/erdjs';
import { QueryResponse } from '@elrondnetwork/erdjs/out/smartcontracts/query';
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
        this.user = usr || null;
    }


    // Public

    // Getters
    public async getCanvas(canvasId: number): Promise<Canvas> {
        if (!this.proxyProvider) {
            const a = await this._generateRGBAArray(100, 100);
            const dimensions = [100, 100];
            const canvas: Canvas = new Canvas(dimensions, a);
            return canvas;
        }
        const stream = async () => {
            let buffer;
            for (let i = 0; i < 10; i++) {
                if (!buffer) {
                    buffer = await this._queryGetCanvas(canvasId, i * 1000 + 1, (i + 1) * 1000);
                } else {
                    let b = await this._queryGetCanvas(canvasId, i * 1000 + 1, (i + 1) * 1000);
                    buffer = this._concatTypedArrays(buffer, b);
                }


            }
            return buffer;
        }
        const rgbArray = await stream();
        console.log(rgbArray.length);
        console.log(rgbArray.slice(0, 24));
        const dimensions = await this._queryGetCanvasDimensions(canvasId);
        const rgbaArray = await this._generateRGBAArray(dimensions[0], dimensions[1], rgbArray);
        const canvas: Canvas = new Canvas(dimensions, rgbaArray);
        return canvas;
    }


    public async getCanvasDimensions(canvasId: number): Promise<number[]> {
        if (!this.proxyProvider) {
            const a = await [500, 500];
            return a;
        }
        const dimensions = await this._queryGetCanvasDimensions(canvasId);
        return dimensions;
    }

    public async getCanvasTotalPixelSupply(canvasId: number): Promise<number> {
        if (!this.proxyProvider) {
            const a = 500 * 500;
            return a;
        }
        const total_pixel_supply = await this._queryGetCanvasTotalPixelSupply(canvasId);
        return total_pixel_supply[0];
    }







    //Private make more dry later
    private _concatTypedArrays(a, b) {
        var c = new (a.constructor)(a.length + b.length);
        c.set(a, 0);
        c.set(b, a.length);
        return c;
    }

    private async _runQuery(funcString: string, argument: Argument[]): Promise<QueryResponse> {
        const func = new ContractFunction(funcString);
        const qResponse = await this.contract.runQuery(
            this.proxyProvider,
            {
                func,
                args: argument
            });
        return qResponse;
    }


    private async _queryGetCanvas(canvasId: number, from: number, upTo: number): Promise<Uint8Array> {
        const qResponse = await this._runQuery("getCanvas",
            [
                Argument.fromNumber(canvasId),
                Argument.fromNumber(from),
                Argument.fromNumber(upTo)
            ])
        qResponse.assertSuccess();
        const returnData = qResponse.returnData;
        const rgbArrayRaw = new Uint8Array(qResponse.returnData.length);
        for (let i = 0; i < returnData.length; i++) {
            rgbArrayRaw[i] = returnData[i].asNumber;
        }
        return rgbArrayRaw;
    }


    private async _queryGetCanvasDimensions(canvasId: number): Promise<number[]> {
        const qResponse = await this._runQuery('getCanvasDimensionsTopEncoded',[Argument.fromNumber(canvasId)]);
        qResponse.assertSuccess();
        const returnData = qResponse.returnData;
        const dimensions = [];
        for (let i = 0; i < returnData.length; i++) {
            dimensions[i] = returnData[i].asNumber;
        }
        return dimensions;
    }

    private async _queryGetCanvasTotalPixelSupply(canvasId: number): Promise<number[]> {
        const qResponse = await this._runQuery('getCanvasTotalPixelSupply',[Argument.fromNumber(canvasId)]);
        qResponse.assertSuccess();
        const returnData = qResponse.returnData;
        const dimensions = [];
        for (let i = 0; i < returnData.length; i++) {
            dimensions[i] = returnData[i].asNumber;
        }
        return dimensions;
    }


    private _generateRGBAArray(w: number, h: number, rgbArray?: Uint8Array): Uint8Array {
        let count = 0;
        let rgbArrayCount = 0;
        const rgbaArray = new Uint8Array(w * h * 4);

        for (let i = 0; i < w * h * 4; i++) {
            if (count === 3) {
                rgbaArray[i] = 255;
                count = 0;
            } else {
                if (!rgbArray) {
                    rgbaArray[i] = 125;
                } else {
                    rgbaArray[i] = rgbArray[rgbArrayCount];
                }
                rgbArrayCount++;
                count++;
            }
        }
        return rgbaArray;
    }
}
