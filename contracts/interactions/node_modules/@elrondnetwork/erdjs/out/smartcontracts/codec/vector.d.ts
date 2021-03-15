/// <reference types="node" />
import { TypeDescriptor, Vector } from "../typesystem";
import { BinaryCodec } from "./binary";
export declare class VectorBinaryCodec {
    private readonly parentCodec;
    constructor(parentCodec: BinaryCodec);
    /**
     * Reads and decodes a Vector from a given buffer,
     * with respect to: {@link https://docs.elrond.com/developers/developer-reference/the-elrond-serialization-format | The Elrond Serialization Format}.
     */
    decodeNested(buffer: Buffer, typeDescriptor: TypeDescriptor): [Vector, number];
    /**
     * Reads and decodes a Vector from a given buffer,
     * with respect to: {@link https://docs.elrond.com/developers/developer-reference/the-elrond-serialization-format | The Elrond Serialization Format}.
     */
    decodeTopLevel(buffer: Buffer, typeDescriptor: TypeDescriptor): Vector;
    encodeNested(vector: Vector): Buffer;
    encodeTopLevel(vector: Vector): Buffer;
}
