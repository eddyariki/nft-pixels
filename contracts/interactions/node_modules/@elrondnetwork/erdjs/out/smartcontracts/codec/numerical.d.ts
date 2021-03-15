/// <reference types="node" />
import { NumericalType, NumericalValue } from "../typesystem";
export declare class NumericalBinaryCodec {
    /**
     * Reads and decodes a NumericalValue from a given buffer,
     * with respect to: {@link https://docs.elrond.com/developers/developer-reference/the-elrond-serialization-format | The Elrond Serialization Format}.
     *
     * @param buffer the input buffer
     * @param type the primitive type
     */
    decodeNested(buffer: Buffer, type: NumericalType): [NumericalValue, number];
    /**
     * Reads and decodes a NumericalValue from a given buffer,
     * with respect to: {@link https://docs.elrond.com/developers/developer-reference/the-elrond-serialization-format | The Elrond Serialization Format}.
     *
     * @param buffer the input buffer
     * @param type the primitive type
     */
    decodeTopLevel(buffer: Buffer, type: NumericalType): NumericalValue;
    /**
     * Encodes a NumericalValue to a buffer,
     * with respect to: {@link https://docs.elrond.com/developers/developer-reference/the-elrond-serialization-format | The Elrond Serialization Format}.
     */
    encodeNested(primitive: NumericalValue): Buffer;
    private encodeNestedFixedSize;
    /**
     * Encodes a NumericalValue to a buffer,
     * with respect to: {@link https://docs.elrond.com/developers/developer-reference/the-elrond-serialization-format | The Elrond Serialization Format}.
     */
    encodeTopLevel(primitive: NumericalValue): Buffer;
    /**
     * Encodes a NumericalValue to a buffer,
     * with respect to: {@link https://docs.elrond.com/developers/developer-reference/the-elrond-serialization-format | The Elrond Serialization Format}.
     */
    encodePrimitive(primitive: NumericalValue): Buffer;
}
