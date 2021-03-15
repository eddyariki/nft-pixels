"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VectorBinaryCodec = void 0;
const typesystem_1 = require("../typesystem");
class VectorBinaryCodec {
    constructor(parentCodec) {
        this.parentCodec = parentCodec;
    }
    /**
     * Reads and decodes a Vector from a given buffer,
     * with respect to: {@link https://docs.elrond.com/developers/developer-reference/the-elrond-serialization-format | The Elrond Serialization Format}.
     */
    decodeNested(buffer, typeDescriptor) {
        let result = [];
        let numItems = buffer.readUInt32BE();
        this.parentCodec.constraints.checkVectorLength(numItems);
        let originalBuffer = buffer;
        let offset = 4;
        buffer = originalBuffer.slice(offset);
        for (let i = 0; i < numItems; i++) {
            let [decoded, decodedLength] = this.parentCodec.decodeNested(buffer, typeDescriptor);
            result.push(decoded);
            offset += decodedLength;
            buffer = originalBuffer.slice(offset);
        }
        return [new typesystem_1.Vector(result), offset];
    }
    /**
     * Reads and decodes a Vector from a given buffer,
     * with respect to: {@link https://docs.elrond.com/developers/developer-reference/the-elrond-serialization-format | The Elrond Serialization Format}.
     */
    decodeTopLevel(buffer, typeDescriptor) {
        let result = [];
        let originalBuffer = buffer;
        let offset = 0;
        while (buffer.length > 0) {
            let [decoded, decodedLength] = this.parentCodec.decodeNested(buffer, typeDescriptor);
            result.push(decoded);
            offset += decodedLength;
            buffer = originalBuffer.slice(offset);
            this.parentCodec.constraints.checkVectorLength(result.length);
        }
        return new typesystem_1.Vector(result);
    }
    encodeNested(vector) {
        this.parentCodec.constraints.checkVectorLength(vector.getLength());
        let lengthBuffer = Buffer.alloc(4);
        lengthBuffer.writeUInt32BE(vector.getLength());
        let itemsBuffers = [];
        for (const item of vector.getItems()) {
            let itemBuffer = this.parentCodec.encodeNested(item);
            itemsBuffers.push(itemBuffer);
        }
        let buffer = Buffer.concat([lengthBuffer, ...itemsBuffers]);
        return buffer;
    }
    encodeTopLevel(vector) {
        this.parentCodec.constraints.checkVectorLength(vector.getLength());
        let itemsBuffers = [];
        for (const item of vector.getItems()) {
            let itemBuffer = this.parentCodec.encodeNested(item);
            itemsBuffers.push(itemBuffer);
        }
        let buffer = Buffer.concat(itemsBuffers);
        return buffer;
    }
}
exports.VectorBinaryCodec = VectorBinaryCodec;
//# sourceMappingURL=vector.js.map