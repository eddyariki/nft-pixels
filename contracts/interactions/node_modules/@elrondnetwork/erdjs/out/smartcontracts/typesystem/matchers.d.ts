import { PrimitiveType, Type } from "./types";
export declare function onTypeSelect<TResult>(type: Type, selectors: {
    onOptional: () => TResult;
    onVector: () => TResult;
    onPrimitive: () => TResult;
    onStructure: () => TResult;
    onOther?: () => TResult;
}): TResult;
export declare function onTypedValueSelect<TResult>(value: any, selectors: {
    onPrimitive: () => TResult;
    onOptional: () => TResult;
    onVector: () => TResult;
    onStructure: () => TResult;
    onOther?: () => TResult;
}): TResult;
export declare function onPrimitiveValueSelect<TResult>(value: any, selectors: {
    onBoolean: () => TResult;
    onNumerical: () => TResult;
    onAddress: () => TResult;
    onOther?: () => TResult;
}): TResult;
export declare function onPrimitiveTypeSelect<TResult>(type: PrimitiveType, selectors: {
    onBoolean: () => TResult;
    onNumerical: () => TResult;
    onAddress: () => TResult;
    onOther?: () => TResult;
}): TResult;
