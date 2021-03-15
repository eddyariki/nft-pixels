/// <reference types="node" />
import { ContractFunction } from "./function";
import { Argument } from "./argument";
import { Balance } from "../balance";
import { Address } from "../address";
import { GasLimit } from "../networkParams";
import BigNumber from "bignumber.js";
export declare class Query {
    caller: Address;
    address: Address;
    func: ContractFunction;
    args: Argument[];
    value: Balance;
    constructor(init?: Partial<Query>);
    toHttpRequest(): any;
}
export declare class QueryResponse {
    private vmOutput;
    returnData: ContractReturnData[];
    returnCode: string;
    returnMessage: string;
    gasUsed: GasLimit;
    /**
     * Constructs a QueryResponse object from a HTTP response (as returned by the provider).
     */
    static fromHttpResponse(payload: any): QueryResponse;
    assertSuccess(): void;
    isSuccess(): boolean;
    firstResult(): ContractReturnData;
    buffers(): Buffer[];
    /**
     * Converts the object to a pretty, plain JavaScript object.
     */
    toJSON(): object;
}
export declare class ContractReturnData {
    asBuffer: Buffer;
    asBase64: any;
    asHex: string;
    asNumber: number;
    asBool: boolean;
    asBigInt: BigNumber;
    asString: string;
    constructor(asBase64: any);
    static fromArray(raw: any[]): ContractReturnData[];
}
