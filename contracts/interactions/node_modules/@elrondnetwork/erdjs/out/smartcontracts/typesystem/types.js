"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTyped = exports.PrimitiveValue = exports.TypedValue = exports.PrimitiveType = exports.Type = void 0;
const utils_1 = require("../../utils");
const typesRegistry_1 = require("./typesRegistry");
class Type {
    constructor(name) {
        utils_1.guardValueIsSet("name", name);
        this.name = name;
        typesRegistry_1.TypesRegistry.registerType(this);
    }
    toString() {
        return this.name;
    }
    equals(type) {
        return this.name == type.name;
    }
    valueOf() {
        return this.name;
    }
    /**
     * Inspired from: https://docs.microsoft.com/en-us/dotnet/api/system.type.isassignablefrom
     */
    isAssignableFrom(type) {
        return type instanceof this.constructor;
    }
}
exports.Type = Type;
Type.One = new Type("Type");
class PrimitiveType extends Type {
    constructor(name) {
        super(name);
    }
}
exports.PrimitiveType = PrimitiveType;
PrimitiveType.One = new PrimitiveType("PrimitiveType");
class TypedValue {
}
exports.TypedValue = TypedValue;
class PrimitiveValue extends TypedValue {
}
exports.PrimitiveValue = PrimitiveValue;
function isTyped(value) {
    return value instanceof TypedValue;
}
exports.isTyped = isTyped;
//# sourceMappingURL=types.js.map