import { Type } from "./types";
/**
 * Handles nested generic types.
 * A nested type parameter is a type parameter that is also a generic type.
 */
export declare class TypeDescriptor {
    private readonly scopedTypes;
    constructor(scopedTypes: Type[]);
    static createFromTypeNames(scopedTypeNames: string[]): TypeDescriptor;
    scopeInto(): TypeDescriptor;
    getGenericType(): Type;
    getOutmostType(): Type;
    /**
     * Only one (direct) type parameter is supported (e.g. Map<TKey, TValue> isn't supported). The type parameter can be a generic type, though.
     */
    getTypeParameter(): Type;
    assertIsGenericType(): void;
    /**
     * Will return `true` for types such as Vector, Optional.
     */
    isGenericType(): boolean;
    assertNotVoid(): void;
    isVoid(): boolean;
}
