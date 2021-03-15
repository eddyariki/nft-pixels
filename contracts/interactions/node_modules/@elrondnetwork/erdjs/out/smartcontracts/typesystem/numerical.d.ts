import { PrimitiveType, PrimitiveValue, Type } from "./types";
import BigNumber from "bignumber.js";
export declare class NumericalType extends PrimitiveType {
    static One: NumericalType;
    readonly sizeInBytes: number;
    readonly withSign: boolean;
    protected constructor(name: string, sizeInBytes: number, withSign: boolean);
    hasFixedSize(): boolean;
    hasArbitrarySize(): boolean;
}
export declare class U8Type extends NumericalType {
    static One: U8Type;
    private constructor();
}
export declare class I8Type extends NumericalType {
    static One: I8Type;
    private constructor();
}
export declare class U16Type extends NumericalType {
    static One: U16Type;
    private constructor();
}
export declare class I16Type extends NumericalType {
    static One: I16Type;
    private constructor();
}
export declare class U32Type extends NumericalType {
    static One: U32Type;
    private constructor();
}
export declare class I32Type extends NumericalType {
    static One: I32Type;
    private constructor();
}
export declare class U64Type extends NumericalType {
    static One: U64Type;
    private constructor();
}
export declare class I64Type extends NumericalType {
    static One: I64Type;
    private constructor();
}
export declare class BigUIntType extends NumericalType {
    static One: BigUIntType;
    private constructor();
}
export declare class BigIntType extends NumericalType {
    static One: BigIntType;
    private constructor();
}
/**
 * A numerical value fed to or fetched from a Smart Contract contract, as a strongly-typed, immutable abstraction.
 */
export declare class NumericalValue extends PrimitiveValue {
    readonly type: PrimitiveType;
    readonly value: BigNumber;
    readonly sizeInBytes: number | undefined;
    readonly withSign: boolean;
    constructor(value: BigNumber, type: NumericalType);
    /**
     * Returns whether two objects have the same value.
     *
     * @param other another NumericalValue
     */
    equals(other: NumericalValue): boolean;
    valueOf(): BigNumber;
    getType(): Type;
}
export declare class U8Value extends NumericalValue {
    constructor(value: number | BigNumber);
}
export declare class I8Value extends NumericalValue {
    constructor(value: number | BigNumber);
}
export declare class U16Value extends NumericalValue {
    constructor(value: number | BigNumber);
}
export declare class I16Value extends NumericalValue {
    constructor(value: number | BigNumber);
}
export declare class U32Value extends NumericalValue {
    constructor(value: number | BigNumber);
}
export declare class I32Value extends NumericalValue {
    constructor(value: number | BigNumber);
}
export declare class U64Value extends NumericalValue {
    constructor(value: BigNumber);
}
export declare class I64Value extends NumericalValue {
    constructor(value: BigNumber);
}
export declare class BigUIntValue extends NumericalValue {
    constructor(value: BigNumber);
}
export declare class BigIntValue extends NumericalValue {
    constructor(value: BigNumber);
}
