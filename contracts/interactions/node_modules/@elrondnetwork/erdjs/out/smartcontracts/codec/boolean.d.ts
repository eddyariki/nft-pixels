/// <reference types="node" />
import { BooleanValue } from "../typesystem";
export declare class BooleanBinaryCodec {
    private static readonly TRUE;
    private static readonly FALSE;
    /**
    * Reads and decodes a BooleanValue from a given buffer,
    * with respect to: {@link https://docs.elrond.com/developers/developer-reference/the-elrond-serialization-format | The Elrond Serialization Format}.
    *
    * @param buffer the input buffer
    */
    decodeNested(buffer: Buffer): [BooleanValue, number];
    /**
     * Reads and decodes a BooleanValue from a given buffer,
     * with respect to: {@link https://docs.elrond.com/developers/developer-reference/the-elrond-serialization-format | The Elrond Serialization Format}.
     *
     * @param buffer the input buffer
     */
    decodeTopLevel(buffer: Buffer): BooleanValue;
    /**
     * Encodes a BooleanValue to a buffer,
     * with respect to: {@link https://docs.elrond.com/developers/developer-reference/the-elrond-serialization-format | The Elrond Serialization Format}.
     */
    encodeNested(primitive: BooleanValue): Buffer;
    /**
     * Encodes a BooleanValue to a buffer,
     * with respect to: {@link https://docs.elrond.com/developers/developer-reference/the-elrond-serialization-format | The Elrond Serialization Format}.
     */
    encodeTopLevel(primitive: BooleanValue): Buffer;
}
