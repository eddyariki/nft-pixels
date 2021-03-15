/// <reference types="node" />
import { PrimitiveType, PrimitiveValue } from "../typesystem";
import { BinaryCodec } from "./binary";
export declare class PrimitiveBinaryCodec {
    private readonly parentCodec;
    private readonly booleanCodec;
    private readonly numericalCodec;
    private readonly addressCoded;
    constructor(parentCodec: BinaryCodec);
    decodeNested(buffer: Buffer, type: PrimitiveType): [PrimitiveValue, number];
    decodeTopLevel(buffer: Buffer, type: PrimitiveType): PrimitiveValue;
    encodeNested(value: PrimitiveValue): Buffer;
    encodeTopLevel(value: PrimitiveValue): Buffer;
}
