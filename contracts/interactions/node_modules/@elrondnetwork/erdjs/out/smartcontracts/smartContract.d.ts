import { Balance } from "../balance";
import { Address } from "../address";
import { GasLimit } from "../networkParams";
import { Transaction } from "../transaction";
import { AbiRegistry } from "./typesystem/abiRegistry";
import { Argument } from "./argument";
import { Code } from "./code";
import { CodeMetadata } from "./codeMetadata";
import { ISmartContract as ISmartContract } from "./interface";
import { Nonce } from "../nonce";
import { ContractFunction } from "./function";
import { QueryResponse } from "./query";
import { IProvider } from "../interface";
/**
 * An abstraction for deploying and interacting with Smart Contracts.
 */
export declare class SmartContract implements ISmartContract {
    private owner;
    private address;
    private abi;
    private code;
    private codeMetadata;
    private readonly trackOfTransactions;
    /**
     * Create a SmartContract object by providing its address on the Network.
     */
    constructor({ address }: {
        address?: Address;
    });
    /**
     * Sets the address, as on Network.
     */
    setAddress(address: Address): void;
    /**
     * Gets the address, as on Network.
     */
    getAddress(): Address;
    /**
     * Gets the owner address.
     *
     * Note that this function doesn't query the Network, but uses the information acquired when signing a deployment transaction.
     * Therefore, currently, this function is useful only in the context of deploying Smart Contracts.
     */
    getOwner(): Address;
    /**
     * ABIs aren't currently supported by `erdjs`. They will be supported in a future version.
     */
    setAbi(abi: AbiRegistry): void;
    /**
     * ABIs aren't currently supported by `erdjs`. They will be supported in a future version.
     */
    getAbi(): AbiRegistry;
    /**
     * Gets the {@link Code} of the Smart Contract. Does not query the Network.
     */
    getCode(): Code;
    /**
     * Gets the {@link CodeMetadata} of the Smart Contract. Does not query the Network.
     */
    getCodeMetadata(): CodeMetadata;
    /**
     * Creates a {@link Transaction} for deploying the Smart Contract to the Network.
     */
    deploy({ code, codeMetadata, initArguments, value, gasLimit }: {
        code: Code;
        codeMetadata?: CodeMetadata;
        initArguments?: Argument[];
        value?: Balance;
        gasLimit: GasLimit;
    }): Transaction;
    private onDeploySigned;
    /**
     * Creates a {@link Transaction} for upgrading the Smart Contract on the Network.
     */
    upgrade({ code, codeMetadata, initArgs, value, gasLimit }: {
        code: Code;
        codeMetadata?: CodeMetadata;
        initArgs?: Argument[];
        value?: Balance;
        gasLimit: GasLimit;
    }): Transaction;
    private onUpgradeSigned;
    /**
     * Creates a {@link Transaction} for calling (a function of) the Smart Contract.
     */
    call({ func, args, value, gasLimit }: {
        func: ContractFunction;
        args?: Argument[];
        value?: Balance;
        gasLimit: GasLimit;
    }): Transaction;
    private onCallSigned;
    runQuery(provider: IProvider, { func, args, value, caller }: {
        func: ContractFunction;
        args?: Argument[];
        value?: Balance;
        caller?: Address;
    }): Promise<QueryResponse>;
    /**
     * Computes the address of a Smart Contract.
     * The address is computed deterministically, from the address of the owner and the nonce of the deployment transaction.
     *
     * @param owner The owner of the Smart Contract
     * @param nonce The owner nonce used for the deployment transaction
     */
    static computeAddress(owner: Address, nonce: Nonce): Address;
}
