/// <reference types="node" />
import { StructureType, Structure } from "../typesystem";
import { BinaryCodec } from "./binary";
export declare class StructureBinaryCodec {
    private readonly parentCodec;
    constructor(parentCodec: BinaryCodec);
    decodeTopLevel(buffer: Buffer, type: StructureType): Structure;
    decodeNested(buffer: Buffer, type: StructureType): [Structure, number];
    encodeNested(structure: Structure): Buffer;
    encodeTopLevel(structure: Structure): Buffer;
}
