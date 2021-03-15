import { FunctionDefinition } from "./function";
import { StructureDefinition } from "./structure";
/**
 * A namespace contains ABI definitions (function signatures and structure layouts) for one or more Smart Contracts.
 * In the simplest case, a namespace contains ABI definitions for a single contract.
 *
 * For components reused across multiple contracts - say, framework-level base classes or commonly-used structures,
 * a namespace serves as a way to capture the commonality (for the purpose of reducing duplication within ABI definitions).
 */
export declare class Namespace {
    readonly namespace: string;
    readonly functions: FunctionDefinition[];
    readonly structures: StructureDefinition[];
    constructor(namespace: string, functions: FunctionDefinition[], structures: StructureDefinition[]);
    static fromJSON(json: {
        namespace: string;
        functions: any[];
        structures: any[];
    }): Namespace;
    findFunction(functionName: string): FunctionDefinition;
}
