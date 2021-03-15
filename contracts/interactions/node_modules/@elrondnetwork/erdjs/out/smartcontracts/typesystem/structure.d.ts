import { TypeDescriptor } from "./typeDescriptor";
import { Type, TypedValue } from "./types";
export declare class StructureType extends Type {
    readonly definition: StructureDefinition;
    constructor(definition: StructureDefinition);
}
export declare class Structure extends TypedValue {
    private readonly type;
    private readonly fields;
    /**
     * Currently, one can only set fields at initialization time. Construction will be improved at a later time.
     */
    constructor(type: StructureType, fields: StructureField[]);
    private checkTyping;
    getFields(): ReadonlyArray<StructureField>;
    valueOf(): any;
    equals(other: Structure): boolean;
    getType(): StructureType;
}
export declare class StructureField {
    readonly value: TypedValue;
    readonly name: string;
    constructor(value: TypedValue, name?: string);
    equals(other: StructureField): boolean;
}
export declare class StructureDefinition {
    readonly name: string;
    readonly fields: StructureFieldDefinition[];
    constructor(name: string, fields: StructureFieldDefinition[]);
    static fromJSON(json: {
        name: string;
        fields: any[];
    }): StructureDefinition;
}
export declare class StructureFieldDefinition {
    readonly name: string;
    readonly description: string;
    readonly scopedTypeNames: string[];
    constructor(name: string, description: string, type: string[]);
    static fromJSON(json: {
        name: string;
        description: string;
        type: string[];
    }): StructureFieldDefinition;
    getTypeDescriptor(): TypeDescriptor;
}
