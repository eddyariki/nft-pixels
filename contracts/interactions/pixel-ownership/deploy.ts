
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
    const meJSON = readFileSync('../keystores/admin.json');
    const password = 'BBsssI1-_(2mmci.';
    const aliceWallet = BasicWallet.fromPemFileString(alicePEM);
    const meWallet = BasicWallet.fromMnemonic('draw soul juice where great ladder summer again leisure artist relax debate wet gallery window walk hope maple arm silly muffin heavy that action');
    const aliceAddressInfo = await provider.getAddress(aliceWallet.address());
    const dataTestWasm = readFileSync("../../pixel-ownership/output/pixel-ownership.wasm");
    console.log(aliceAddressInfo.address)
    const { contract } = await Contract.deploy(
        dataTestWasm,
        {
            upgradeable: true,
            readable: true
        },
        [],
        {
            provider,
            signer: meWallet,
            sender: meWallet.address(),
            // gasPrice: 80000000,
            gasLimit: 105680618
        })
    console.log(`Contract has been deployed at: ${contract.address}`);

    const deployedContract = await Contract.at(contract.address, {
        provider,
    });
}



(async () => {
    await deploy();
})();