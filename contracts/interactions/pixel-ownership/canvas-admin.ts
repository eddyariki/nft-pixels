import { assert } from "chai";
import {
    Address,
    ContractFunction,
    SmartContract,
    Argument,
    Nonce,
    GasLimit,
    ProxyProvider,
    UserSigner,
    UserSecretKey,
    UserWallet,
    Account,
    NetworkConfig,
    GasPrice,
    Transaction,
    TransactionHash,
} from "@elrondnetwork/erdjs";

import { LOCAL_PROXY, SMART_CONTRACT_ADDRESS } from "./config";
import { Type, TypedValue, U32Value, U64Value, U8Value, Vector, VectorType } from "@elrondnetwork/erdjs/out/smartcontracts/typesystem";
import BigNumber from "bignumber.js";
const fs = require('fs');

const address = SMART_CONTRACT_ADDRESS

const readJSON = async (file: string): Promise<Buffer> => {
    const jsonString = await fs.readFileSync(`../users/${file}`);
    return JSON.parse(jsonString);
}

const admin = async () => {
    const proxyProvider = new ProxyProvider(LOCAL_PROXY, 100000000);
    await NetworkConfig.getDefault().sync(proxyProvider);

    const smartContractAddress: Address = new Address(address);

    const smartContract = new SmartContract({ address: smartContractAddress });

    const aliceJSON = await readJSON("alice.json");

    //Here the password will be input
    // const aliceWallet = BasicWallet.fromJsonKeyFileString(aliceJSON.toString(), "password");

    // const aliceAddress = new Address(aliceWallet.address.toString());
    const aliceSecret = UserWallet.decryptSecretKey(aliceJSON, "password");
    const aliceWallet = new UserWallet(aliceSecret, "password");
    const aliceAddress = new Address(aliceSecret.generatePublicKey().toAddress());
    const alice = new Account(aliceAddress);
    const aliceSigner = UserSigner.fromWallet(aliceJSON, "password");


    const createCanvas = async (w: number, h: number) => {
        const func = new ContractFunction("getOwner");
        const qResponse = await smartContract.runQuery(
            proxyProvider,
            {
                func,
                // args: [Argument.fromNumber(1)]
            });
        const qAddress = new Address(qResponse.firstResult().asHex)

        console.log(qAddress.toString());

        console.log(aliceAddress.toString());

        let callTransaction = smartContract.call({
            func: new ContractFunction("createCanvas"),
            args: [Argument.fromNumber(w), Argument.fromNumber(h)],
            gasLimit: new GasLimit(20000000)
        });

        await alice.sync(proxyProvider);

        callTransaction.setNonce(alice.nonce);

        alice.incrementNonce();

        aliceSigner.sign(callTransaction);

        let hashOne = await callTransaction.send(proxyProvider);

        await callTransaction.awaitExecuted(proxyProvider);

        await alice.sync(proxyProvider);

        const txResult = await proxyProvider.getTransaction(hashOne);
        console.log(txResult);

    }

    const getCanvasDimensions = async () => {
        const func = new ContractFunction("getCanvasDimensionsTopEncoded");
        const qResponse = await smartContract.runQuery(
            proxyProvider,
            {
                func,
                args: [Argument.fromNumber(1)]
            });
        qResponse.assertSuccess();
        console.log("Size: ", qResponse.returnData.length);
        // console.log(qResponse.returnData);
        const returnData = qResponse.returnData;
        for (let i = 0; i < returnData.length; i++) {
            console.log(returnData[i].asNumber); //.asHex/Bool/etc 
        }
    }


    const getLastValidPixelId = async () => {
        const func = new ContractFunction("getLastValidPixelId");
        const qResponse = await smartContract.runQuery(
            proxyProvider,
            {
                func,
                args: [Argument.fromNumber(1)]
            });
        qResponse.assertSuccess();
        console.log("Size: ", qResponse.returnData.length);
        // console.log(qResponse.returnData);
        const returnData = qResponse.returnData;
        for (let i = 0; i < returnData.length; i++) {
            console.log(returnData[i].asNumber); //.asHex/Bool/etc 
        }
    }

    const getCanvasTotalSupply = async () => {
        const func = new ContractFunction("getTotalPixelSupplyOfCanvas");
        const qResponse = await smartContract.runQuery(
            proxyProvider,
            {
                func,
                args: [Argument.fromNumber(1)]
            });
        qResponse.assertSuccess();
        console.log("Size: ", qResponse.returnData.length);
        // console.log(qResponse.returnData);
        const returnData = qResponse.returnData;
        for (let i = 0; i < returnData.length; i++) {
            console.log(returnData[i].asNumber); //.asHex/Bool/etc 
        }
    }

    const mintPixels = async (loop: number, units: number) => {
        let callTransactions: Transaction[] = [];

        for (let i = 0; i < loop; i++) {
            let callTransaction = smartContract.call({
                func: new ContractFunction("mintPixels"),
                args: [Argument.fromNumber(1), Argument.fromNumber(units)],
                gasLimit: new GasLimit(1000000000)
            });
            callTransactions[i] = callTransaction;
        }

        await alice.sync(proxyProvider);
        const sync_then_sign = async (txs: Transaction[]) => {
            for (let i = 0; i < loop; i++) {
                txs[i].setNonce(alice.nonce);
                aliceSigner.sign(txs[i]);
                alice.incrementNonce();
            }
        }

        await sync_then_sign(callTransactions);

        let hashes: TransactionHash[] = [];
        for (let i = 0; i < loop; i++) {
            hashes[i] = await callTransactions[i].send(proxyProvider);
        }

        for (let i = 0; i < loop; i++) {
            await callTransactions[i].awaitExecuted(proxyProvider);
        }

        for (let i = 0; i < loop; i++) {
            const executed = await proxyProvider.getTransactionStatus(hashes[i]);
            // console.log(executed);
        }

    }

    const getCanvas = async (from: number, upTo: number, log: boolean) => {
        const func = new ContractFunction("getCanvas");
        const qResponse = await smartContract.runQuery(
            proxyProvider,
            {
                func,
                args: [Argument.fromNumber(1), Argument.fromNumber(from), Argument.fromNumber(upTo)]
            });

        // qResponse.assertSuccess();
        console.log("Size: ", qResponse.returnData.length);
        // console.log(qResponse.returnData);
        const returnData = qResponse.returnData;
        if (!log) {
            return
        }
        for (let i = 0; i < returnData.length; i++) {
            if (i % 3 === 0) console.log(" //");
            console.log(returnData[i].asNumber); //.asHex/Bool/etc 

        }
    }

    const getOwnedPixels = async () => {
        const func = new ContractFunction("getOwnedPixels");
        try {
            const qResponse = await smartContract.runQuery(
                proxyProvider,
                {
                    func,
                    args: [Argument.fromPubkey(alice.address), Argument.fromNumber(1), Argument.fromNumber(1), Argument.fromNumber(10000)]
                });
            qResponse.assertSuccess();
            console.log("Size: ", qResponse.returnData.length);
        } catch (e) {
            console.log(e);
        }
        // qResponse.assertSuccess();

        // console.log(qResponse.returnData);
        // const returnData = qResponse.returnData;

        // for(let i=0; i<returnData.length; i++){
        //     if(i%2===0)console.log(" //");
        //     console.log(returnData[i].asNumber); //.asHex/Bool/etc 

        // }
    }

    const changePixelColor = async (canvas_id: number, pixel_ids: number[], r: number[], g: number[], b: number[], loop: number) => {
        let callTransactions: Transaction[] = [];
        //&self, canvas_id: u32, pixel_id:u64, r:u8,g:u8,b:u8
        for (let i = 0; i < loop; i++) {
            console.log("creating tx");
            let callTransaction = smartContract.call({
                func: new ContractFunction("changePixelColor"),
                args: [
                    Argument.fromNumber(canvas_id),
                    Argument.fromNumber(pixel_ids[i]),
                    Argument.fromNumber(r[i]),
                    Argument.fromNumber(r[i]),
                    Argument.fromNumber(r[i])
                ],
                gasLimit: new GasLimit(100000000)
            });
            callTransactions[i] = callTransaction;
        }

        await alice.sync(proxyProvider);
        const sync_then_sign = async (txs: Transaction[]) => {
            for (let i = 0; i < loop; i++) {
                txs[i].setNonce(alice.nonce);
                aliceSigner.sign(txs[i]);
                alice.incrementNonce();
            }
        }

        await sync_then_sign(callTransactions);

        let hashes: TransactionHash[] = [];
        for (let i = 0; i < loop; i++) {
            hashes[i] = await callTransactions[i].send(proxyProvider);
        }

        for (let i = 0; i < loop; i++) {
            await callTransactions[i].awaitExecuted(proxyProvider);
        }

        for (let i = 0; i < loop; i++) {
            const executed = await proxyProvider.getTransactionStatus(hashes[i]);
            // console.log(executed);
        }
    }
    const createU8VectorArgument = (from:number[])=>{
        let res = []
        for(let j=0; j<from.length; j++){
            res[j] = new U8Value(from[j]);
        }
        return res;
    }
    const createU32VectorArgument = (from:number[])=>{
        let res = []
        for(let j=0; j<from.length; j++){
            res[j] = new U32Value(from[j]);
        }
        return res;
    }
    const createU64VectorArgument = (from:number[])=>{
        let res=[];
        for(let j=0; j<from.length; j++){
            res[j] = new U64Value(new BigNumber(from[j]));
        }
        return res;
    }
    const changeBatchPixelColor = async (canvas_id: number, pixel_ids:number[], r: number[], g: number[], b: number[], loop: number) => {

        //&self, canvas_id: u32, pixel_id:u64, r:u8,g:u8,b:u8
        let pixel_ids_vec = createU64VectorArgument(pixel_ids);
        let rs = createU8VectorArgument(r);
        let gs = createU8VectorArgument(g);
        let bs = createU8VectorArgument(b);
        console.log("creating tx");
        let callTransaction = smartContract.call({
            func: new ContractFunction("changeBatchPixelColor"),
        
            args: [
                Argument.fromNumber(canvas_id),
                Argument.fromTypedValue(new Vector(pixel_ids_vec)),
                Argument.fromTypedValue(new Vector(rs)),
                Argument.fromTypedValue(new Vector(gs)),
                Argument.fromTypedValue(new Vector(bs)),
            ],
            gasLimit: new GasLimit(100000000)
        });
        await alice.sync(proxyProvider);
        callTransaction.setNonce(alice.nonce);
        aliceSigner.sign(callTransaction);
        alice.incrementNonce();
        const hash = await callTransaction.send(proxyProvider);
        await callTransaction.awaitExecuted(proxyProvider);
        const executed = await proxyProvider.getTransactionStatus(hash);
        console.log(executed);
    }
   




    // await createCanvas(100, 100);
    // await getCanvasDimensions();
    // await getCanvasTotalSupply();
    // // await getLastValidPixelId();
    // for (let i = 0; i < 10; i++) {
    //     await mintPixels(5, 200); //100pixels
    //     await getLastValidPixelId();
    // }
    // await getLastValidPixelId();


    // // const stream =async()=>{
    //     // for(let i=0;i<10;i++){
    // await getCanvas(1,10000, false);
    //     // }
    // // } 
    // // await stream();
    // await getOwnedPixels(); // worked
    await getCanvas(1,10,true);
    // await changeBatchPixelColor(1, )
    let pixel_ids = [1,2,3,4,5,6,7,8,9,10]
    let rs = [6,6,6,6,6,6,6,6,6,6]
    let gs = [6,6,6,6,6,6,6,6,6,6]
    let bs = [6,6,6,6,6,6,6,6,6,6]
    await changeBatchPixelColor(1,pixel_ids,rs,gs,bs,1);
    await getCanvas(1,10, true);
}


(async () => {
    await admin();
})();