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
    const proxyProvider = new ProxyProvider(LOCAL_PROXY);
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
    

    const createCanvas = async ()=>{
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
            args: [Argument.fromNumber(5),Argument.fromNumber(5)],
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
    
    const mint = async ()=>{
        let callTransaction = smartContract.call({
            func: new ContractFunction("mintPixels"),
            args: [Argument.fromNumber(1),Argument.fromNumber(7)],
            gasLimit: new GasLimit(100000000)
        });

        await alice.sync(proxyProvider);
        callTransaction.setNonce(alice.nonce);
        
        aliceSigner.sign(callTransaction);

        alice.incrementNonce();

        const gas = callTransaction.computeFee(await NetworkConfig.getDefault());

        let hashOne = await callTransaction.send(proxyProvider);

        await callTransaction.awaitExecuted(proxyProvider);

        await alice.sync(proxyProvider);

        const txResult:any = await proxyProvider.getTransaction(hashOne);
        const executed = await proxyProvider.getTransactionStatus(hashOne);
        // console.log(txResult);
        console.log(txResult.data.data.toString());        
        console.log(executed);
    }

    const getCanvas = async()=>{
        const func = new ContractFunction("getCanvas");
        const qResponse = await smartContract.runQuery(
            proxyProvider, 
            {
                func,
                args:[Argument.fromNumber(1)]
            });

        // qResponse.assertSuccess();
        console.log("Size: ", qResponse.returnData.length);
        // console.log(qResponse.returnData);
        const returnData = qResponse.returnData;

        for(let i=0; i<returnData.length; i++){
            console.log(returnData[i].asNumber); //.asHex/Bool/etc 
        }
    }
    // await createCanvas();
    // await getCanvasDimensions();
    // await getCanvasTotalSupply();
    // await getLastValidPixelId();
    await mint();
    await getLastValidPixelId();
    // await getCanvas();
    
}


(async () => {
    await admin();
})();