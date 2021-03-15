import { Type, TypedValue } from "./types";
export declare class OptionalType extends Type {
    static One: OptionalType;
    private constructor();
}
export declare class VectorType extends Type {
    static One: VectorType;
    private constructor();
}
export declare class OptionalValue extends TypedValue {
    private readonly value;
    constructor(value?: TypedValue | null);
    isSet(): boolean;
    getTypedValue(): TypedValue;
    valueOf(): any;
    equals(other: OptionalValue): boolean;
    getType(): Type;
}
export declare class Vector extends TypedValue {
    private readonly items;
    constructor(items: TypedValue[]);
    getLength(): number;
    getItems(): ReadonlyArray<TypedValue>;
    valueOf(): any[];
    equals(other: Vector): boolean;
    getType(): Type;
}
