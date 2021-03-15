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
exports.OptionalValueBinaryCodec = void 0;
const errors = __importStar(require("../../errors"));
const typesystem_1 = require("../typesystem");
class OptionalValueBinaryCodec {
    constructor(parentCodec) {
        this.parentCodec = parentCodec;
    }
    /**
     * Reads and decodes an OptionalValue from a given buffer,
     * with respect to: {@link https://docs.elrond.com/developers/developer-reference/the-elrond-serialization-format | The Elrond Serialization Format}.
     */
    decodeNested(buffer, typeDescriptor) {
        if (buffer[0] == 0x00) {
            return [new typesystem_1.OptionalValue(), 1];
        }
        let [decoded, decodedLength] = this.parentCodec.decodeNested(buffer.slice(1), typeDescriptor);
        return [new typesystem_1.OptionalValue(decoded), decodedLength + 1];
    }
    /**
     * Reads and decodes an OptionalValue from a given buffer,
     * with respect to: {@link https://docs.elrond.com/developers/developer-reference/the-elrond-serialization-format | The Elrond Serialization Format}.
     */
    decodeTopLevel(buffer, typeDescriptor) {
        if (buffer.length == 0) {
            return new typesystem_1.OptionalValue();
        }
        if (buffer[0] != 0x01) {
            throw new errors.ErrCodec("invalid buffer for optional value");
        }
        let [decoded, decodedLength] = this.parentCodec.decodeNested(buffer.slice(1), typeDescriptor);
        return new typesystem_1.OptionalValue(decoded);
    }
    encodeNested(optionalValue) {
        if (optionalValue.isSet()) {
            return Buffer.concat([Buffer.from([1]), this.parentCodec.encodeNested(optionalValue.getTypedValue())]);
        }
        return Buffer.from([0]);
    }
    encodeTopLevel(optionalValue) {
        if (optionalValue.isSet()) {
            return Buffer.concat([Buffer.from([1]), this.parentCodec.encodeNested(optionalValue.getTypedValue())]);
        }
        return Buffer.from([]);
    }
}
exports.OptionalValueBinaryCodec = OptionalValueBinaryCodec;
//# sourceMappingURL=optional.js.map