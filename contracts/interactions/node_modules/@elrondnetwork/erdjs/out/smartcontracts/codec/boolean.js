"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanBinaryCodec = void 0;
const errors = __importStar(require("../../errors"));
const typesystem_1 = require("../typesystem");
class BooleanBinaryCodec {
    /**
    * Reads and decodes a BooleanValue from a given buffer,
    * with respect to: {@link https://docs.elrond.com/developers/developer-reference/the-elrond-serialization-format | The Elrond Serialization Format}.
    *
    * @param buffer the input buffer
    */
    decodeNested(buffer) {
        // We don't check the size of the buffer, we just read the first byte.
        let byte = buffer.readUInt8();
        return [new typesystem_1.BooleanValue(byte == BooleanBinaryCodec.TRUE), 1];
    }
    /**
     * Reads and decodes a BooleanValue from a given buffer,
     * with respect to: {@link https://docs.elrond.com/developers/developer-reference/the-elrond-serialization-format | The Elrond Serialization Format}.
     *
     * @param buffer the input buffer
     */
    decodeTopLevel(buffer) {
        if (buffer.length > 1) {
            throw new errors.ErrInvalidArgument("buffer", buffer, "should be a buffer of size <= 1");
        }
        let firstByte = buffer[0];
        return new typesystem_1.BooleanValue(firstByte == BooleanBinaryCodec.TRUE);
    }
    /**
     * Encodes a BooleanValue to a buffer,
     * with respect to: {@link https://docs.elrond.com/developers/developer-reference/the-elrond-serialization-format | The Elrond Serialization Format}.
     */
    encodeNested(primitive) {
        if (primitive.isTrue()) {
            return Buffer.from([BooleanBinaryCodec.TRUE]);
        }
        return Buffer.from([BooleanBinaryCodec.FALSE]);
    }
    /**
     * Encodes a BooleanValue to a buffer,
     * with respect to: {@link https://docs.elrond.com/developers/developer-reference/the-elrond-serialization-format | The Elrond Serialization Format}.
     */
    encodeTopLevel(primitive) {
        if (primitive.isTrue()) {
            return Buffer.from([BooleanBinaryCodec.TRUE]);
        }
        return Buffer.from([]);
    }
}
exports.BooleanBinaryCodec = BooleanBinaryCodec;
BooleanBinaryCodec.TRUE = 0x01;
BooleanBinaryCodec.FALSE = 0x00;
//# sourceMappingURL=boolean.js.map