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

import {BasicWallet} from "elrondjs";

import { LOCAL_PROXY, SMART_CONTRACT_ADDRESS } from "./config";

const fs = require('fs');

const address = SMART_CONTRACT_ADDRESS

const readJSON = async (file: string):Promise<Buffer>=>{
    const jsonString = await fs.readFileSync(`../users/${file}`);
    return JSON.parse(jsonString);
}

const admin = async () =>{
    const proxyProvider = new ProxyProvider(LOCAL_PROXY, 10000000);
    await NetworkConfig.getDefault().sync(proxyProvider);

    const smartContractAddress:Address = new Address(address);
    
    const smartContract = new SmartContract({address:smartContractAddress});

    const aliceJSON = await readJSON("alice.json");

    //Here the password will be input
    // const aliceWallet = BasicWallet.fromJsonKeyFileString(aliceJSON.toString(), "password");

    // const aliceAddress = new Address(aliceWallet.address.toString());
    const aliceSecret = UserWallet.decryptSecretKey(aliceJSON, "password");
    const aliceWallet = new UserWallet(aliceSecret, "password");
    const aliceAddress = new Address(aliceSecret.generatePublicKey().toAddress());
    const alice = new Account(aliceAddress);
    const aliceSigner = UserSigner.fromWallet(aliceJSON, "password");
    

    const createCanvas = async (w:number, h:number)=>{
        const func = new ContractFunction("getOwner");
        const qResponse = await smartContract.runQuery(
            proxyProvider, 
            {func,
            // args: [Argument.fromNumber(1)]
            });
        const qAddress = new Address(qResponse.firstResult().asHex)
        
        console.log(qAddress.toString());

        console.log(aliceAddress.toString());

        let callTransaction = smartContract.call({
            func: new ContractFunction("createCanvas"),
            args: [Argument.fromNumber(w),Argument.fromNumber(h)],
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

    const getCanvasDimensions = async()=>{
        const func = new ContractFunction("getCanvasDimensionsTopEncoded");
        const qResponse = await smartContract.runQuery(
            proxyProvider, 
            {
                func,
                args:[Argument.fromNumber(1)]
            });
        qResponse.assertSuccess();
        console.log("Size: ", qResponse.returnData.length);
        // console.log(qResponse.returnData);
        const returnData = qResponse.returnData;
        for(let i=0; i<returnData.length; i++){
            console.log(returnData[i].asNumber); //.asHex/Bool/etc 
        }
    }


    const getLastValidPixelId = async()=>{
        const func = new ContractFunction("getLastValidPixelId");
        const qResponse = await smartContract.runQuery(
            proxyProvider, 
            {
                func,
                args:[Argument.fromNumber(1)]
            });
        qResponse.assertSuccess();
        console.log("Size: ", qResponse.returnData.length);
        // console.log(qResponse.returnData);
        const returnData = qResponse.returnData;
        for(let i=0; i<returnData.length; i++){
            console.log(returnData[i].asNumber); //.asHex/Bool/etc 
        }
    }

    const getCanvasTotalSupply = async() =>{
        const func = new ContractFunction("getTotalPixelSupplyOfCanvas");
        const qResponse = await smartContract.runQuery(
            proxyProvider, 
            {
                func,
                args:[Argument.fromNumber(1)]
            });
        qResponse.assertSuccess();
        console.log("Size: ", qResponse.returnData.length);
        // console.log(qResponse.returnData);
        const returnData = qResponse.returnData;
        for(let i=0; i<returnData.length; i++){
            console.log(returnData[i].asNumber); //.asHex/Bool/etc 
        }
    }
    
    const mintPixels = async ()=>{
        let callTransactions: Transaction[] = [];

        for(let i=0;i<500;i++){
            let callTransaction = smartContract.call({
                func: new ContractFunction("mintPixels"),
                args: [Argument.fromNumber(1),Argument.fromNumber(20)],
                gasLimit: new GasLimit(100000000)
            });
            callTransactions[i] = callTransaction;
        }
        
        await alice.sync(proxyProvider);
        const sync_then_sign=async(txs:Transaction[])=>{
            for(let i=0;i<500;i++){
                txs[i].setNonce(alice.nonce);
                aliceSigner.sign(txs[i]);
                alice.incrementNonce();
            }
        }

        await sync_then_sign(callTransactions);

        let hashes: TransactionHash[] = [];
        for(let i=0;i<500;i++){
            hashes[i] = await callTransactions[i].send(proxyProvider);
        }

        for(let i=0;i<500;i++){
            await callTransactions[i].awaitExecuted(proxyProvider);
        }

        for(let i=0;i<500;i++){
            const executed = await proxyProvider.getTransactionStatus(hashes[i]);       
            // console.log(executed);
        }
    
    }

    const getCanvas = async(from:number, upTo:number)=>{
        const func = new ContractFunction("getCanvas");
        const qResponse = await smartContract.runQuery(
            proxyProvider, 
            {
                func,
                args:[Argument.fromNumber(1),Argument.fromNumber(from), Argument.fromNumber(upTo)]
            });

        // qResponse.assertSuccess();
        console.log("Size: ", qResponse.returnData.length);
        // console.log(qResponse.returnData);
        // const returnData = qResponse.returnData;
        
        // for(let i=0; i<returnData.length; i++){

        //     // console.log(returnData[i].asNumber); //.asHex/Bool/etc 
        // }
    }





    // await createCanvas(100,100);
    // await getCanvasDimensions();
    // await getCanvasTotalSupply();
    // await getLastValidPixelId();
    // for(let i=0;i<10;i++){
        // await mintPixels();
        // await getLastValidPixelId();
    // }
    // await getLastValidPixelId();

    // const stream =async()=>{
    //     for(let i=0;i<10;i++){
    //         await getCanvas(i*1000+1,(i+1)*1000);
    //     }
    // } 
    // await stream();
}


(async () => {
    await admin();
})();