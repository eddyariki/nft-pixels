import { TransactionPayload } from "../transactionPayload";
import { Argument } from "./argument";
import { Code } from "./code";
import { CodeMetadata } from "./codeMetadata";
import { ContractFunction } from "./function";
export declare const ArwenVirtualMachine = "0500";
/**
 * A builder for {@link TransactionPayload} objects, to be used for Smart Contract deployment transactions.
 */
export declare class ContractDeployPayloadBuilder {
    private code;
    private codeMetadata;
    private arguments;
    /**
     * Sets the code of the Smart Contract.
     */
    setCode(code: Code): ContractDeployPayloadBuilder;
    /**
     * Sets the code metadata of the Smart Contract.
     */
    setCodeMetadata(codeMetadata: CodeMetadata): ContractDeployPayloadBuilder;
    /**
     * Adds constructor (`init`) arguments.
     */
    addInitArg(arg: Argument): ContractDeployPayloadBuilder;
    /**
     * Sets constructor (`init`) arguments.
     */
    setInitArgs(args: Argument[]): ContractDeployPayloadBuilder;
    /**
     * Builds the {@link TransactionPayload}.
     */
    build(): TransactionPayload;
}
/**
 * A builder for {@link TransactionPayload} objects, to be used for Smart Contract upgrade transactions.
 */
export declare class ContractUpgradePayloadBuilder {
    private code;
    private codeMetadata;
    private arguments;
    /**
     * Sets the code of the Smart Contract.
     */
    setCode(code: Code): ContractUpgradePayloadBuilder;
    /**
     * Sets the code metadata of the Smart Contract.
     */
    setCodeMetadata(codeMetadata: CodeMetadata): ContractUpgradePayloadBuilder;
    /**
     * Adds upgrade (`init`) arguments.
     */
    addInitArg(arg: Argument): ContractUpgradePayloadBuilder;
    /**
     * Sets upgrade (`init`) arguments.
     */
    setInitArgs(args: Argument[]): ContractUpgradePayloadBuilder;
    /**
     * Builds the {@link TransactionPayload}.
     */
    build(): TransactionPayload;
}
/**
 * A builder for {@link TransactionPayload} objects, to be used for Smart Contract execution transactions.
 */
export declare class ContractCallPayloadBuilder {
    private contractFunction;
    private arguments;
    /**
     * Sets the function to be called (executed).
     */
    setFunction(contractFunction: ContractFunction): ContractCallPayloadBuilder;
    /**
     * Adds a function argument.
     */
    addArg(arg: Argument): ContractCallPayloadBuilder;
    /**
     * Sets the function arguments.
     */
    setArgs(args: Argument[]): ContractCallPayloadBuilder;
    /**
     * Builds the {@link TransactionPayload}.
     */
    build(): TransactionPayload;
}
