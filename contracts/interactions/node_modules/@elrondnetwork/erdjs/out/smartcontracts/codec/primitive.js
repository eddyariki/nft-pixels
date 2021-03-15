"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrimitiveBinaryCodec = void 0;
const typesystem_1 = require("../typesystem");
const address_1 = require("./address");
const boolean_1 = require("./boolean");
const numerical_1 = require("./numerical");
class PrimitiveBinaryCodec {
    constructor(parentCodec) {
        this.parentCodec = parentCodec;
        this.booleanCodec = new boolean_1.BooleanBinaryCodec();
        this.numericalCodec = new numerical_1.NumericalBinaryCodec();
        this.addressCoded = new address_1.AddressBinaryCodec();
    }
    decodeNested(buffer, type) {
        return typesystem_1.onPrimitiveTypeSelect(type, {
            onBoolean: () => this.booleanCodec.decodeNested(buffer),
            onNumerical: () => this.numericalCodec.decodeNested(buffer, type),
            onAddress: () => this.addressCoded.decodeNested(buffer)
        });
    }
    decodeTopLevel(buffer, type) {
        return typesystem_1.onPrimitiveTypeSelect(type, {
            onBoolean: () => this.booleanCodec.decodeTopLevel(buffer),
            onNumerical: () => this.numericalCodec.decodeTopLevel(buffer, type),
            onAddress: () => this.addressCoded.decodeTopLevel(buffer)
        });
    }
    encodeNested(value) {
        return typesystem_1.onPrimitiveValueSelect(value, {
            onBoolean: () => this.booleanCodec.encodeNested(value),
            onNumerical: () => this.numericalCodec.encodeNested(value),
            onAddress: () => this.addressCoded.encodeNested(value)
        });
    }
    encodeTopLevel(value) {
        return typesystem_1.onPrimitiveValueSelect(value, {
            onBoolean: () => this.booleanCodec.encodeTopLevel(value),
            onNumerical: () => this.numericalCodec.encodeTopLevel(value),
            onAddress: () => this.addressCoded.encodeTopLevel(value)
        });
    }
}
exports.PrimitiveBinaryCodec = PrimitiveBinaryCodec;
//# sourceMappingURL=primitive.js.map