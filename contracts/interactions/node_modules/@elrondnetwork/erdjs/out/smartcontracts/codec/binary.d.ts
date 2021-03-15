/// <reference types="node" />
import { FunctionDefinition, TypeDescriptor, TypedValue } from "../typesystem";
export declare class BinaryCodec {
    readonly constraints: BinaryCodecConstraints;
    private readonly optionalCodec;
    private readonly vectorCodec;
    private readonly primitiveCodec;
    private readonly structureCodec;
    constructor(constraints?: BinaryCodecConstraints | null);
    decodeFunctionOutput(outputItems: Buffer[], definition: FunctionDefinition): TypedValue[];
    decodeTopLevel<TResult extends TypedValue = TypedValue>(buffer: Buffer, typeDescriptor: TypeDescriptor): TResult;
    decodeNested<TResult extends TypedValue = TypedValue>(buffer: Buffer, typeDescriptor: TypeDescriptor): [TResult, number];
    encodeNested(typedValue: any): Buffer;
    encodeTopLevel(typedValue: any): Buffer;
}
export declare class BinaryCodecConstraints {
    maxBufferLength: number;
    maxVectorLength: number;
    constructor(init?: Partial<BinaryCodecConstraints>);
    checkBufferLength(buffer: Buffer): void;
    /**
     * This constraint avoids computer-freezing decode bugs (e.g. due to invalid ABI or structure definitions).
     */
    checkVectorLength(length: number): void;
}
