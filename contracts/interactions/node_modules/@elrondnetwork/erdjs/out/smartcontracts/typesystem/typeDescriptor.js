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
exports.TypeDescriptor = void 0;
const errors = __importStar(require("../../errors"));
const typesRegistry_1 = require("./typesRegistry");
/**
 * Handles nested generic types.
 * A nested type parameter is a type parameter that is also a generic type.
 */
class TypeDescriptor {
    constructor(scopedTypes) {
        this.scopedTypes = [];
        this.scopedTypes = scopedTypes;
    }
    static createFromTypeNames(scopedTypeNames) {
        let types = [];
        for (const typeName of scopedTypeNames) {
            let type = typesRegistry_1.TypesRegistry.resolveType(typeName);
            types.push(type);
        }
        return new TypeDescriptor(types);
    }
    scopeInto() {
        return new TypeDescriptor(this.scopedTypes.slice(1));
    }
    getGenericType() {
        this.assertIsGenericType();
        return this.getOutmostType();
    }
    getOutmostType() {
        return this.scopedTypes[0];
    }
    /**
     * Only one (direct) type parameter is supported (e.g. Map<TKey, TValue> isn't supported). The type parameter can be a generic type, though.
     */
    getTypeParameter() {
        this.assertIsGenericType();
        return this.scopedTypes[1];
    }
    assertIsGenericType() {
        if (!this.isGenericType()) {
            throw new errors.ErrTypingSystem("not a generic type");
        }
    }
    /**
     * Will return `true` for types such as Vector, Optional.
     */
    isGenericType() {
        return this.scopedTypes.length > 1;
    }
    assertNotVoid() {
        if (this.isVoid()) {
            throw new errors.ErrTypingSystem("void (trivial) type descriptor");
        }
    }
    isVoid() {
        return this.scopedTypes.length == 0;
    }
}
exports.TypeDescriptor = TypeDescriptor;
//# sourceMappingURL=typeDescriptor.js.map