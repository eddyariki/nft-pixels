import {
    SmartContract, Address, ProxyProvider, ContractFunction,
    Transaction, TransactionPayload, Balance, GasLimit, Argument, NetworkConfig, UserSigner
} from '@elrondnetwork/erdjs';
import { QueryResponse } from '@elrondnetwork/erdjs/out/smartcontracts/query';
import { U32Value, U64Value, U8Value, Vector } from '@elrondnetwork/erdjs/out/smartcontracts/typesystem';
import { environment } from 'src/environments/environment';
// import { User } from 'src/app/contract-interface/user';
import BigNumber from 'bignumber.js';
import { User } from '../model/entity';

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
    networkConfig: NetworkConfig;
    user: User;

    constructor(contractAddress = '', provider?: ProxyProvider, usr?: User, networkConfig?: NetworkConfig) {
        const address = new Address(contractAddress);
        this.contract = new SmartContract({ address });
        this.proxyProvider = provider || null;
        this.user = usr || null;
        this.networkConfig = networkConfig || null;
    }


    // Public
    // Calls

    public async changePixelColor(canvasId: number, pixelId: number, rgb: number[]): Promise<Transaction> {
        const callTransaction = await this._createCallTransactionAndSign(
            'changePixelColor',
            [
                Argument.fromNumber(canvasId),
                Argument.fromNumber(pixelId),
                Argument.fromNumber(rgb[0]),
                Argument.fromNumber(rgb[1]),
                Argument.fromNumber(rgb[2])
            ],
            new GasLimit(100000000) // bad approach (hardcoded)
        );

        return callTransaction; // set gaslimit later in transaction-confirmation modal
    }

    public async changeBatchPixelColor(canvasId: number, pixelIds: number[], r: number[], g: number[], b: number[]): Promise<Transaction> {
        // &self, canvas_id: u32, pixel_id:u64, r:u8,g:u8,b:u8
        // this.networkConfig = new NetworkConfig();
        // await this.networkConfig.sync(this.proxyProvider);
        const pixelIdsVec = this._createU64VectorArgument(pixelIds);
        const rs = this._createU8VectorArgument(r);
        const gs = this._createU8VectorArgument(g);
        const bs = this._createU8VectorArgument(b);

        try{
        const callTransaction = await this._createCallTransaction(
            'changeBatchPixelColor',
            [
                Argument.fromNumber(canvasId),
                Argument.fromTypedValue(new Vector(pixelIdsVec)),
                Argument.fromTypedValue(new Vector(rs)),
                Argument.fromTypedValue(new Vector(gs)),
                Argument.fromTypedValue(new Vector(bs)),
            ],
            new GasLimit(10000000) // bad approach (hardcoded)
        );
        // const fee = await callTransaction.computeFee(this.networkConfig);
        return callTransaction; // set gaslimit later in transaction-confirmation modal
        }catch (e){
            console.log('Failure occurred in transaction signing step');
            console.log(e);
        }
        // return callTransaction; // set gaslimit later in transaction-confirmation modal
    }
    // Getters
    public async getCanvas(canvasId: number): Promise<Canvas> {
        if (!this.proxyProvider) {
            const a = await this._generateRGBAArray(100, 100);
            const dimensions = [100, 100];
            const canvas: Canvas = new Canvas(dimensions, a);
            return canvas;
        } else {
            const rgbArray = await this._streamCanvas(canvasId);
            console.log(rgbArray.length);
            console.log(rgbArray.slice(0, 24));
            const dimensions = await this._queryGetCanvasDimensions(canvasId);
            const rgbaArray = await this._generateRGBAArray(dimensions[0], dimensions[1], rgbArray);
            const canvas: Canvas = new Canvas(dimensions, rgbaArray);

            return canvas;
        }
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
        const totalPixelSupply = await this._queryGetCanvasTotalPixelSupply(canvasId);
        return totalPixelSupply[0];
    }

    public async getOwnedPixels(address: Address, canvasId: number, from: number, to: number): Promise<number[]> {
        const ownedPixels = await this._getOwnedPixels(address, canvasId, from, to);
        return ownedPixels;
    }
    public async getOwnedPixelsColor(
        address: Address, canvasId: number,
        from: number, to: number,
        ownedAmount: number ): Promise<Uint8Array> {

        const rgbArray = await this._streamOwnedPixelsColor(address, canvasId);
        console.log(rgbArray.length);
        // console.log(rgbArray.slice(0, 24));
        return rgbArray;
    }

    // Private make more dry later
    private _createU8VectorArgument(from: number[]): U8Value[] {
        const res = [];
        for (let j = 0; j < from.length; j++) {
            res[j] = new U8Value(from[j]);
        }
        return res;
    }
    private _createU32VectorArgument(from: number[]): U32Value[] {
        const res = [];
        for (let j = 0; j < from.length; j++) {
            res[j] = new U32Value(from[j]);
        }
        return res;
    }
    private _createU64VectorArgument(from: number[]): U64Value[] {
        const res = [];
        for (let j = 0; j < from.length; j++) {
            res[j] = new U64Value(new BigNumber(from[j]));
        }
        return res;
    }
    private _concatTypedArrays(a: any, b: any): any {
        const c = new (a.constructor)(a.length + b.length);
        c.set(a, 0);
        c.set(b, a.length);
        return c;
    }
    private async _createCallTransaction(funcString: string, argument: Argument[], gasLimit: GasLimit): Promise<Transaction> {
        const callTransaction = this.contract.call({
            func: new ContractFunction(funcString),
            args: argument,
            gasLimit
        });
        return callTransaction;
    }
    private async _createCallTransactionAndSign(funcString: string, argument: Argument[], gasLimit: GasLimit): Promise<Transaction> {
        const callTransaction = this.contract.call({
            func: new ContractFunction(funcString),
            args: argument,
            gasLimit
        });
        // prepares transaction
        await this.user.account.sync(this.proxyProvider);
        callTransaction.setNonce(this.user.account.nonce);
        const signer = this.user.signer as UserSigner;
        await signer.sign(callTransaction);
        this.user.account.incrementNonce();
        return callTransaction;
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
    private async _getOwnedPixels(qAddress: Address, canvasId: number, from: number, to: number): Promise<number[]> {
        const qResponse = await this._runQuery('getOwnedPixels', [
            Argument.fromPubkey(qAddress),
            Argument.fromNumber(canvasId),
            Argument.fromNumber(from),
            Argument.fromNumber(to),
        ]);
        const returnData = qResponse.returnData;
        const ownedPixels = [];
        for (let i = 0; i < returnData.length; i++) {
            ownedPixels[i] = returnData[i].asNumber;
        }
        return ownedPixels;
    }
    private async _streamOwnedPixelsColor(qAddress: Address, canvasId: number): Promise<Uint8Array> {
        let buffer: Uint8Array;
        for (let i = 0; i < 10; i++) {
            if (!buffer) {
                buffer = await this._getOwnedPixelsColor(qAddress, canvasId, 1, 1000);
            } else {
                const b = await this._getOwnedPixelsColor(qAddress, canvasId, i * 1000 + 1, (i + 1) * 1000);
                buffer = this._concatTypedArrays(buffer, b);
            }
        }
        return buffer;
    }
    private async _getOwnedPixelsColor(qAddress: Address, canvasId: number, from: number, to: number): Promise<Uint8Array> {
        const qResponse = await this._runQuery('getOwnedPixelsColor', [
            Argument.fromPubkey(qAddress),
            Argument.fromNumber(canvasId),
            Argument.fromNumber(from),
            Argument.fromNumber(to),
        ]);
        qResponse.assertSuccess();
        const returnData = qResponse.returnData;
        const rgbArrayRaw = new Uint8Array(qResponse.returnData.length);
        for (let i = 0; i < returnData.length; i++) {
            rgbArrayRaw[i] = returnData[i].asNumber;
        }
        return rgbArrayRaw;
    }

    private _splitVectorBy1024(vec: U8Value[] | U64Value[] | U32Value[]): any {
        const length = vec.length;
        const splitVec = [];
        splitVec[0] = [];
        let idx = 0;
        splitVec[idx].push(vec[0]);
        for (let i = 1; i < length; i++) {
            if (i % 1024 === 0) {
                idx++;
                splitVec[idx] = [];
            }
            splitVec[idx].push(vec[i]);
        }
        return splitVec;
    }


    private async _streamCanvas(canvasId: number): Promise<Uint8Array> {
        let buffer: Uint8Array;
        for (let i = 0; i < 1; i++) {
            if (!buffer) {
                buffer = await this._queryGetCanvas(canvasId, 1, 10000);
            } else {
                const b = await this._queryGetCanvas(canvasId, i * 1000 + 1, (i + 1) * 1000);
                buffer = this._concatTypedArrays(buffer, b);
            }


        }
        return buffer;
    }

    private async _queryGetCanvas(canvasId: number, from: number, upTo: number): Promise<Uint8Array> {
        const qResponse = await this._runQuery('getCanvas',
            [
                Argument.fromNumber(canvasId),
                Argument.fromNumber(from),
                Argument.fromNumber(upTo)
            ]);
        qResponse.assertSuccess();
        const returnData = qResponse.returnData;
        const rgbArrayRaw = new Uint8Array(qResponse.returnData.length);
        for (let i = 0; i < returnData.length; i++) {
            rgbArrayRaw[i] = returnData[i].asNumber;
        }
        return rgbArrayRaw;
    }


    private async _queryGetCanvasDimensions(canvasId: number): Promise<number[]> {
        const qResponse = await this._runQuery('getCanvasDimensionsTopEncoded', [Argument.fromNumber(canvasId)]);
        qResponse.assertSuccess();
        const returnData = qResponse.returnData;
        const dimensions = [];
        for (let i = 0; i < returnData.length; i++) {
            dimensions[i] = returnData[i].asNumber;
        }
        return dimensions;
    }

    private async _queryGetCanvasTotalPixelSupply(canvasId: number): Promise<number[]> {
        const qResponse = await this._runQuery('getCanvasTotalPixelSupply', [Argument.fromNumber(canvasId)]);
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

    private _generateRGBAArrayFromNumberArray(w: number, h: number, rgbArray?: number[]): number[] {
        let count = 0;
        let rgbArrayCount = 0;
        const rgbaArray = [];

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
