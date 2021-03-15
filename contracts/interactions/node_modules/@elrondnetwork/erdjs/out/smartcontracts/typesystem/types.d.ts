export declare class Type {
    static One: Type;
    readonly name: string;
    protected constructor(name: string);
    toString(): string;
    equals(type: Type): boolean;
    valueOf(): string;
    /**
     * Inspired from: https://docs.microsoft.com/en-us/dotnet/api/system.type.isassignablefrom
     */
    isAssignableFrom(type: Type): boolean;
}
export declare class PrimitiveType extends Type {
    static One: PrimitiveType;
    protected constructor(name: string);
}
export declare abstract class TypedValue {
    abstract getType(): Type;
    abstract equals(other: any): boolean;
    abstract valueOf(): any;
}
export declare abstract class PrimitiveValue extends TypedValue {
}
export declare function isTyped(value: any): boolean;
