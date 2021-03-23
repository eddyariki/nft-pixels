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
    Balance,
} from "@elrondnetwork/erdjs";

import { LOCAL_PROXY, SMART_CONTRACT_ADDRESS } from "./config";
import { Type, TypedValue, U32Value, U64Value, U8Value, Vector, VectorType } from "@elrondnetwork/erdjs/out/smartcontracts/typesystem";
import BigNumber from "bignumber.js";
const fs = require('fs');

const address = SMART_CONTRACT_ADDRESS

const readJSON = async (file: string): Promise<Buffer> => {
    const jsonString = await fs.readFileSync(`../keystores/${file}`);
    return JSON.parse(jsonString);
}

const admin = async () => {
    const proxyProvider = new ProxyProvider(LOCAL_PROXY, 100000000);
    await NetworkConfig.getDefault().sync(proxyProvider);

    const smartContractAddress: Address = new Address(address);

    const smartContract = new SmartContract({ address: smartContractAddress });

    const adminJSON = await readJSON("admin.json");

    //Here the password will be input
    // const adminWallet = BasicWallet.fromJsonKeyFileString(adminJSON.toString(), "password");

    // const adminAddress = new Address(adminWallet.address.toString());
    const adminSecret = UserWallet.decryptSecretKey(adminJSON, 'Hackathon01!');
    const adminWallet = new UserWallet(adminSecret, 'Hackathon01!');
    const adminAddress = new Address(adminSecret.generatePublicKey().toAddress());
    const admin = new Account(adminAddress);
    const adminSigner = UserSigner.fromWallet(adminJSON, 'Hackathon01!');


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

        console.log(adminAddress.toString());

        let callTransaction = smartContract.call({
            func: new ContractFunction("createCanvas"),
            args: [Argument.fromNumber(w), Argument.fromNumber(h)],
            gasLimit: new GasLimit(20000000)
        });

        await admin.sync(proxyProvider);

        callTransaction.setNonce(admin.nonce);

        admin.incrementNonce();

        adminSigner.sign(callTransaction);

        let hashOne = await callTransaction.send(proxyProvider);

        await callTransaction.awaitExecuted(proxyProvider);

        await admin.sync(proxyProvider);

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

        await admin.sync(proxyProvider);
        const sync_then_sign = async (txs: Transaction[]) => {
            for (let i = 0; i < loop; i++) {
                txs[i].setNonce(admin.nonce);
                adminSigner.sign(txs[i]);
                admin.incrementNonce();
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
        // console.log(admin);
        // console.log(admin.address);
        try {
            const qResponse = await smartContract.runQuery(
                proxyProvider,
                {
                    func,
                    args: [Argument.fromPubkey(admin.address), 
                        Argument.fromNumber(1), 
                        Argument.fromNumber(1), 
                        Argument.fromNumber(10000)]
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
    const getOwnedPixelsBob = async () => {
        const bobJSON = await readJSON("bob.json");
        const bobSecret = UserWallet.decryptSecretKey(bobJSON, "password");
        const bobWallet = new UserWallet(bobSecret, "password");
        const bobAddress = new Address(bobSecret.generatePublicKey().toAddress());
        const bob = new Account(bobAddress);
        const bobSigner = UserSigner.fromWallet(bobJSON, "password");
        const func = new ContractFunction("getOwnedPixels");
        // console.log(admin);
        // console.log(admin.address);
        try {
            const qResponse = await smartContract.runQuery(
                proxyProvider,
                {
                    func,
                    args: [Argument.fromPubkey(bob.address), 
                        Argument.fromNumber(1), 
                        Argument.fromNumber(1), 
                        Argument.fromNumber(10000)]
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
    const getOwnedPixelsColor = async () => {
        const func = new ContractFunction("getOwnedPixelsColor");
        try {
            const qResponse = await smartContract.runQuery(
                proxyProvider,
                {
                    func,
                    args: [Argument.fromPubkey(admin.address), 
                        Argument.fromNumber(1), 
                        Argument.fromNumber(1), 
                        Argument.fromNumber(1000)]
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

        await admin.sync(proxyProvider);
        const sync_then_sign = async (txs: Transaction[]) => {
            for (let i = 0; i < loop; i++) {
                txs[i].setNonce(admin.nonce);
                adminSigner.sign(txs[i]);
                admin.incrementNonce();
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
        const res = []
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
            gasLimit: new GasLimit(Math.min(pixel_ids.length * 50000, 100000000))
        });
        await admin.sync(proxyProvider);
        callTransaction.setNonce(admin.nonce);
        adminSigner.sign(callTransaction);
        admin.incrementNonce();
        const hash = await callTransaction.send(proxyProvider);
        await callTransaction.awaitExecuted(proxyProvider);
        const executed = await proxyProvider.getTransactionStatus(hash);
        console.log(executed);
    }
   // 	fn auction_pixel(&self, canvas_id:u32, pixel_id:u64, starting_price:BigUint, ending_price:BigUint, deadline:u64)-
    const createAuction = async(canvasId:number, pixelId:number) => {
        let callTransaction = smartContract.call({
            func: new ContractFunction("auctionPixel"),
            args: [
                Argument.fromNumber(canvasId),
                Argument.fromNumber(pixelId),
                Argument.fromBigInt(new BigNumber(1*(10**18))),
                Argument.fromBigInt(new BigNumber(2*(10**18))),
                Argument.fromNumber(92000),
            ],
            gasLimit: new GasLimit(50000000)
        });
        try{
            await admin.sync(proxyProvider);
            callTransaction.setNonce(admin.nonce);
            await adminSigner.sign(callTransaction);
            admin.incrementNonce();
            let hash = await callTransaction.send(proxyProvider);
            await callTransaction.awaitExecuted(proxyProvider);
            const executed = await proxyProvider.getTransactionStatus(hash);
            console.log(executed);
        }catch (e){
            console.log(e);
        }
    }
    const endAuction = async(canvasId:number, pixelId:number) => {
        let callTransaction = smartContract.call({
            func: new ContractFunction("endAuction"),
            args: [
                Argument.fromNumber(canvasId),
                Argument.fromNumber(pixelId),
            ],
            gasLimit: new GasLimit(50000000)
        });
        await admin.sync(proxyProvider);
        callTransaction.setNonce(admin.nonce);
        adminSigner.sign(callTransaction);
        admin.incrementNonce();
        let hash = await callTransaction.send(proxyProvider);
        await callTransaction.awaitExecuted(proxyProvider);
        const executed = await proxyProvider.getTransactionStatus(hash);
        console.log(executed);
    }
    const endAuctionBob = async(canvasId:number, pixelId:number) => {
        const bobJSON = await readJSON("bob.json");
    const bobSecret = UserWallet.decryptSecretKey(bobJSON, "password");
    const bobWallet = new UserWallet(bobSecret, "password");
    const bobAddress = new Address(bobSecret.generatePublicKey().toAddress());
    const bob = new Account(bobAddress);
    const bobSigner = UserSigner.fromWallet(bobJSON, "password");
        let callTransaction = smartContract.call({
            func: new ContractFunction("endAuction"),
            args: [
                Argument.fromNumber(canvasId),
                Argument.fromNumber(pixelId),
            ],
            gasLimit: new GasLimit(50000000)
        });
        await bob.sync(proxyProvider);
        callTransaction.setNonce(bob.nonce);
        bobSigner.sign(callTransaction);
        bob.incrementNonce();
        let hash = await callTransaction.send(proxyProvider);
        await callTransaction.awaitExecuted(proxyProvider);
        const executed = await proxyProvider.getTransactionStatus(hash);
        console.log(executed);
    }
    
    const getAuctions = async () => {
        const func = new ContractFunction("getAuctionsActive");
        try {
            const qResponse = await smartContract.runQuery(
                proxyProvider,
                {
                    func,
                    args: [
                        Argument.fromNumber(1), 
                        Argument.fromNumber(1), 
                        Argument.fromNumber(10000)]
                });
            qResponse.assertSuccess();
            console.log("Size: ", qResponse.returnData.length);
            for(let i = 0; i<qResponse.returnData.length; i++){
                console.log(qResponse.returnData[i].asNumber);
            }
        } catch (e) {
            console.log(e);
        }
    }
    const bidAuction = async(pixelId:number, amount:number) =>{
        const bobJSON = await readJSON("bob.json");
        const bobSecret = UserWallet.decryptSecretKey(bobJSON, "password");
        const bobWallet = new UserWallet(bobSecret, "password");
        const bobAddress = new Address(bobSecret.generatePublicKey().toAddress());
        const bob = new Account(bobAddress);
        const bobSigner = UserSigner.fromWallet(bobJSON, "password");
        let callTransaction = smartContract.call({
            func: new ContractFunction("bid"),
            args: [
                Argument.fromNumber(1),
                Argument.fromNumber(pixelId),
            ],
            gasLimit: new GasLimit(50000000),
            value: Balance.eGLD(amount)
        });
        await bob.sync(proxyProvider);
        callTransaction.setNonce(bob.nonce);
        bobSigner.sign(callTransaction);
        bob.incrementNonce();
        let hash = await callTransaction.send(proxyProvider);
        await callTransaction.awaitExecuted(proxyProvider);
        const executed = await proxyProvider.getTransactionStatus(hash);
        console.log(executed);
    }
    const getAuctionStartingPrice = async (pixelId:number) => {
        const func = new ContractFunction("getAuctionStartingPrice");
        try {
            const qResponse = await smartContract.runQuery(
                proxyProvider,
                {
                    func,
                    args: [
                        Argument.fromNumber(1), 
                        Argument.fromNumber(pixelId), 
                    ]
                });
            qResponse.assertSuccess();

            for(let i = 0; i<qResponse.returnData.length; i++){
                console.log(qResponse.returnData[i].asNumber);
            }
        } catch (e) {
            console.log(e);
        }
    }
    const getAuctionEndingPrice = async (pixelId:number) => {
        const func = new ContractFunction("getAuctionEndingPrice");
        try {
            const qResponse = await smartContract.runQuery(
                proxyProvider,
                {
                    func,
                    args: [
                        Argument.fromNumber(1), 
                        Argument.fromNumber(pixelId), 
                    ]
                });
            qResponse.assertSuccess();

            for(let i = 0; i<qResponse.returnData.length; i++){
                console.log(qResponse.returnData[i].asNumber);
            }
        } catch (e) {
            console.log(e);
        }
    }
    const getAuctionDeadline = async (pixelId:number) => {
        const func = new ContractFunction("getAuctionDeadline");
        try {
            const qResponse = await smartContract.runQuery(
                proxyProvider,
                {
                    func,
                    args: [
                        Argument.fromNumber(1), 
                        Argument.fromNumber(pixelId), 
                    ]
                });
            qResponse.assertSuccess();

            for(let i = 0; i<qResponse.returnData.length; i++){
                let unix = qResponse.returnData[i].asNumber;
                let dateTime = new Date(unix*1000);
                console.log(dateTime.toString());
            }
        } catch (e) {
            console.log(e);
        }
    }
    const getAuctionOwner = async (pixelId:number) => {
        const func = new ContractFunction("getAuctionOwner");
        try {
            const qResponse = await smartContract.runQuery(
                proxyProvider,
                {
                    func,
                    args: [
                        Argument.fromNumber(1), 
                        Argument.fromNumber(pixelId), 
                    ]
                });
            qResponse.assertSuccess();

            for(let i = 0; i<qResponse.returnData.length; i++){
                console.log(Address.fromHex(qResponse.returnData[i].asHex).toString());
            }
        } catch (e) {
            console.log(e);
        }
    }
    const getAuctionCurrentBid = async (pixelId:number) => {
        const func = new ContractFunction("getAuctionCurrentBid");
        try {
            const qResponse = await smartContract.runQuery(
                proxyProvider,
                {
                    func,
                    args: [
                        Argument.fromNumber(1), 
                        Argument.fromNumber(pixelId), 
                    ]
                });
            qResponse.assertSuccess();

            for(let i = 0; i<qResponse.returnData.length; i++){
                console.log(qResponse.returnData[i].asNumber);
            }
        } catch (e) {
            console.log(e);
        }
    }
    const getAuctionCurrentWinner = async (pixelId:number) => {
        const func = new ContractFunction("getAuctionCurrentWinner");
        try {
            const qResponse = await smartContract.runQuery(
                proxyProvider,
                {
                    func,
                    args: [
                        Argument.fromNumber(1), 
                        Argument.fromNumber(pixelId), 
                    ]
                });
            qResponse.assertSuccess();

            for(let i = 0; i<qResponse.returnData.length; i++){
                console.log(Address.fromHex(qResponse.returnData[i].asHex).toString());
            }
        } catch (e) {
            console.log(e);
        }
    }
    await createCanvas(100, 100);
    // // // await getCanvasDimensions();
    // // // await getCanvasTotalSupply();
    // // await getLastValidPixelId();
    // // await mintPixels(1, 25);
    for (let i = 0; i < 10; i++) {
        await mintPixels(5, 200); //100pixels
        await getLastValidPixelId();
    }
    await getLastValidPixelId();
    // for (let i=0; i< 2000; i++){
    //     await createAuction(1,Math.floor(Math.random()*10000));
    // }
    // await createAuction(1,3);
    // await createAuction(1,4);
    // await bidAuction(4, 1.2);
    // console.log("Pixels owned by bob: ");
    // await getOwnedPixelsBob();
    // await endAuctionBob(1,4);
    // console.log("Pixels owned by bob: ");
    // await getOwnedPixelsBob();
    // console.log('STARTING PRICE');
    // await getAuctionStartingPrice(4);
    // console.log('ENDING PRICE');
    // await getAuctionEndingPrice(4);
    // console.log('DEADLINE');
    // await getAuctionDeadline(4);
    // console.log('OWNER');
    // await getAuctionOwner(4);
    // console.log('CURRENT BID');
    // await getAuctionCurrentBid(4);
    // console.log('CURRENT WINNER');
    // await getAuctionCurrentWinner(4);
    // await createAuction(1,6);
    // await createAuction(1,7);

    // await createAuction(1,21);
    // await getAuctionStartingPrice(15);
    console.log('Active Auction Count: ')
    await getAuctions();
    await getOwnedPixels();
    // await getAuction(21);
    // console.log('BIDDING NOW')
    // await bidAuction(21, 1.2);
    // await getAuction(14);
    // await getOwnedPixelsBob();
    
    // await getOwnedPixelsBob();
    // await getAuctions();
    // // // const stream =async()=>{
    // //     // for(let i=0;i<10;i++){
    // // await getCanvas(1,10000, false);
    // await getOwnedPixelsColor();
    // //     // }
    // // // } 
    // // // await stream();
    // await getOwnedPixels(); // worked
    // // await getCanvas(1,10,true);
    // // // await changeBatchPixelColor(1, )
    // let pixel_ids = [1,2,3,4,5,6,7,8,9,10]
    // let rs = [255,255,255,255,200,200,226,226,226,226]
    // let gs = [6,6,6,6,6,6,6,6,6,6]
    // let bs = [6,6,6,6,6,6,6,6,6,6]
    // await changeBatchPixelColor(1,pixel_ids,rs,gs,bs,1);
    // await getCanvas(1,10, true);
}


(async () => {
    await admin();
})();