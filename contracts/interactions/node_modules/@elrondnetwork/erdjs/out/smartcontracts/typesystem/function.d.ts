import { TypeDescriptor } from "./typeDescriptor";
export declare class FunctionDefinition {
    readonly name: string;
    readonly input: FunctionParameterDefinition[];
    readonly output: FunctionParameterDefinition[];
    constructor(name: string, input: FunctionParameterDefinition[], output: FunctionParameterDefinition[]);
    static fromJSON(json: {
        name: string;
        input: any[];
        output: [];
    }): FunctionDefinition;
}
export declare class FunctionParameterDefinition {
    readonly name: string;
    readonly description: string;
    readonly scopedTypeNames: string[];
    constructor(name: string, description: string, type: string[]);
    static fromJSON(json: {
        name: string;
        description: string;
        type: string[];
    }): FunctionParameterDefinition;
    getTypeDescriptor(): TypeDescriptor;
}
