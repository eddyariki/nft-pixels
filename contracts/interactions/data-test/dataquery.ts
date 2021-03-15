import { assert } from "chai";
import { 
    Address,
    ContractFunction,
    SmartContract,
    Argument,
    Nonce,
    GasLimit,
    ProxyProvider
} from "@elrondnetwork/erdjs";
import BigNumber from "bignumber.js";
import { LOCAL_PROXY } from "./config";
const address = "erd1qqqqqqqqqqqqqpgqlrc2xeqt2a0f9vy5y0xdkvkuds3enmkgd8ssjfgpuj"
// #[view(getListBigUint)]
// 	fn get_list_biguint(&self)->SCResult<[BigUint;2]>{
// 		let one = BigUint::from(1u32);
// 		let two = BigUint::from(2u32);
// 		Ok([one, two])

// 	}

// 	#[view(getVectorBigUint)]
// 	fn get_vector_biguint(&self) -> Vec<BigUint>{
// 		let mut v = Vec::new();
// 		let one = BigUint::from(1u32);
// 		let two = BigUint::from(1u32);
// 		let seventytwo = BigUint::from(72u32);
// 		let onehundred = BigUint::from(100u32);
// 		v.push(one);
// 		v.push(two);
// 		v.push(seventytwo);
// 		v.push(onehundred);
// 		v
// 	}

// 	#[view(getBoolean)]
// 	fn get_boolean(&self)->bool{
// 		true
// 	}
const extractValues = (array: Uint8Array| Uint16Array | Uint32Array) =>{
    let values = []
    for(let i=4; i<array.length; i+=5){
        values.push(array[i]);
    }
    return values;
}
const query = async () =>{
    const proxyProvider = new ProxyProvider(LOCAL_PROXY);
    
    const smartContractAddress:Address = new Address(address);
    
    const smartContract = new SmartContract({address:smartContractAddress});

    const getListBigUint=async ()=>{
        const func = new ContractFunction("getListBigUint");
        const qResponse = await smartContract.runQuery(proxyProvider, {func});

        qResponse.assertSuccess();
        console.log("Elements: ",qResponse.firstResult().asBuffer.length/4);
        console.log(qResponse);
        const uint32array = new Uint32Array(qResponse.firstResult().asBuffer);

        let values = extractValues(uint32array);
        console.log(values);
    }
    // await getListBigUint();


    const getVectorBigUint=async ()=>{
        const func = new ContractFunction("getVectorBigUint");
        const qResponse = await smartContract.runQuery(proxyProvider, {func});

        qResponse.assertSuccess();
        console.log("Size: ", qResponse.returnData.length);
        console.log(qResponse.returnData);
        const returnData = qResponse.returnData;
        for(let i=0; i<returnData.length; i++){
            console.log(returnData[i].asNumber); //.asHex/Bool/etc 
        }
        // 1
        // 1
        // 72
        // 1000
    }
    await getVectorBigUint();


    const getBool=async ()=>{
        const func = new ContractFunction("getBoolean");
        const qResponse = await smartContract.runQuery(proxyProvider, {func});

        qResponse.assertSuccess();
        console.log("Elements: ",qResponse.firstResult().asBuffer.length/4);
        console.log(qResponse.firstResult());

    }
    // await getBool();
}


(async () => {
    await query();
})();