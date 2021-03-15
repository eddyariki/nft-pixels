
import { Argument, SmartContract } from "@elrondnetwork/erdjs";
import {
    Contract,
    ProxyProvider,
    BasicWallet,
    BigVal,
    Address,
    WalletBase,
    parseQueryResult,
    ContractQueryResultDataType,
} from 'elrondjs';

import { readFileSync } from 'fs';

import { LOCAL_PROXY } from "./config";


const deploy = async () => {
    const provider = new ProxyProvider(LOCAL_PROXY);
    const config = await provider?.getNetworkConfig();
    console.log(config);
    const alicePEM = readFileSync("../users/alice.pem", 'utf8');
    const aliceWallet = BasicWallet.fromPemFileString(alicePEM);
    const aliceAddressInfo = await provider.getAddress(aliceWallet.address());
    const dataTestWasm = readFileSync("../../data-test/output/data-test.wasm");

    const { contract } = await Contract.deploy(
        dataTestWasm,
        {
            upgradeable: true,
            readable: true
        },
        [],
        {
            provider,
            signer: aliceWallet,
            sender: aliceWallet.address(),
            // gasPrice: 80000000,
            gasLimit: 15680618
        })
    console.log(`Contract has been deployed at: ${contract.address}`);

    const deployedContract = await Contract.at(contract.address, {
        provider,
    });
}



(async () => {
    await deploy();
})();