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
exports.BinaryCodecConstraints = exports.BinaryCodec = void 0;
const errors = __importStar(require("../../errors"));
const typesystem_1 = require("../typesystem");
const utils_1 = require("../../utils");
const optional_1 = require("./optional");
const primitive_1 = require("./primitive");
const vector_1 = require("./vector");
const structure_1 = require("./structure");
class BinaryCodec {
    constructor(constraints = null) {
        this.constraints = constraints || new BinaryCodecConstraints();
        this.optionalCodec = new optional_1.OptionalValueBinaryCodec(this);
        this.vectorCodec = new vector_1.VectorBinaryCodec(this);
        this.primitiveCodec = new primitive_1.PrimitiveBinaryCodec(this);
        this.structureCodec = new structure_1.StructureBinaryCodec(this);
    }
    decodeFunctionOutput(outputItems, definition) {
        utils_1.guardSameLength(outputItems, definition.output);
        let result = [];
        // For output parameters, top-level decoding is normally used.
        // TODO: Question for review - is this assumption correct?
        for (let i = 0; i < outputItems.length; i++) {
            let buffer = outputItems[i];
            let parameterDefinition = definition.output[i];
            let typeDescriptor = parameterDefinition.getTypeDescriptor();
            let decoded = this.decodeTopLevel(buffer, typeDescriptor);
            result.push(decoded);
        }
        return result;
    }
    decodeTopLevel(buffer, typeDescriptor) {
        this.constraints.checkBufferLength(buffer);
        let type = typeDescriptor.getOutmostType();
        // Open types (generics) will require the scoped type descriptor as well.
        let scoped = typeDescriptor.scopeInto();
        let typedValue = typesystem_1.onTypeSelect(type, {
            onOptional: () => this.optionalCodec.decodeTopLevel(buffer, scoped),
            onVector: () => this.vectorCodec.decodeTopLevel(buffer, scoped),
            onPrimitive: () => this.primitiveCodec.decodeTopLevel(buffer, type),
            onStructure: () => this.structureCodec.decodeTopLevel(buffer, type)
        });
        return typedValue;
    }
    decodeNested(buffer, typeDescriptor) {
        this.constraints.checkBufferLength(buffer);
        let type = typeDescriptor.getOutmostType();
        // Open types (generics) will require the scoped type descriptor as well.
        let scoped = typeDescriptor.scopeInto();
        let [typedResult, decodedLength] = typesystem_1.onTypeSelect(type, {
            onOptional: () => this.optionalCodec.decodeNested(buffer, scoped),
            onVector: () => this.vectorCodec.decodeNested(buffer, scoped),
            onPrimitive: () => this.primitiveCodec.decodeNested(buffer, type),
            onStructure: () => this.structureCodec.decodeNested(buffer, type)
        });
        return [typedResult, decodedLength];
    }
    encodeNested(typedValue) {
        return typesystem_1.onTypedValueSelect(typedValue, {
            onPrimitive: () => this.primitiveCodec.encodeNested(typedValue),
            onOptional: () => this.optionalCodec.encodeNested(typedValue),
            onVector: () => this.vectorCodec.encodeNested(typedValue),
            onStructure: () => this.structureCodec.encodeNested(typedValue)
        });
    }
    encodeTopLevel(typedValue) {
        return typesystem_1.onTypedValueSelect(typedValue, {
            onPrimitive: () => this.primitiveCodec.encodeTopLevel(typedValue),
            onOptional: () => this.optionalCodec.encodeTopLevel(typedValue),
            onVector: () => this.vectorCodec.encodeTopLevel(typedValue),
            onStructure: () => this.structureCodec.encodeTopLevel(typedValue)
        });
    }
}
exports.BinaryCodec = BinaryCodec;
class BinaryCodecConstraints {
    constructor(init) {
        this.maxBufferLength = (init === null || init === void 0 ? void 0 : init.maxBufferLength) || 4096;
        this.maxVectorLength = (init === null || init === void 0 ? void 0 : init.maxVectorLength) || 1024;
    }
    checkBufferLength(buffer) {
        if (buffer.length > this.maxBufferLength) {
            throw new errors.ErrCodec(`Buffer too large: ${buffer.length} > ${this.maxBufferLength}`);
        }
    }
    /**
     * This constraint avoids computer-freezing decode bugs (e.g. due to invalid ABI or structure definitions).
     */
    checkVectorLength(length) {
        if (length > this.maxVectorLength) {
            throw new errors.ErrCodec(`Vector too large: ${length} > ${this.maxVectorLength}`);
        }
    }
}
exports.BinaryCodecConstraints = BinaryCodecConstraints;
//# sourceMappingURL=binary.js.map