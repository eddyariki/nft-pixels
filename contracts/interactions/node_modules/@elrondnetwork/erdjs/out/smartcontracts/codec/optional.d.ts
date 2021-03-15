/// <reference types="node" />
import { OptionalValue, TypeDescriptor } from "../typesystem";
import { BinaryCodec } from "./binary";
export declare class OptionalValueBinaryCodec {
    private readonly parentCodec;
    constructor(parentCodec: BinaryCodec);
    /**
     * Reads and decodes an OptionalValue from a given buffer,
     * with respect to: {@link https://docs.elrond.com/developers/developer-reference/the-elrond-serialization-format | The Elrond Serialization Format}.
     */
    decodeNested(buffer: Buffer, typeDescriptor: TypeDescriptor): [OptionalValue, number];
    /**
     * Reads and decodes an OptionalValue from a given buffer,
     * with respect to: {@link https://docs.elrond.com/developers/developer-reference/the-elrond-serialization-format | The Elrond Serialization Format}.
     */
    decodeTopLevel(buffer: Buffer, typeDescriptor: TypeDescriptor): OptionalValue;
    encodeNested(optionalValue: OptionalValue): Buffer;
    encodeTopLevel(optionalValue: OptionalValue): Buffer;
}
