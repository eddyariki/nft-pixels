"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector = exports.OptionalValue = exports.VectorType = exports.OptionalType = void 0;
const utils_1 = require("../../utils");
const types_1 = require("./types");
class OptionalType extends types_1.Type {
    constructor() {
        super("Optional");
    }
}
exports.OptionalType = OptionalType;
OptionalType.One = new OptionalType();
class VectorType extends types_1.Type {
    constructor() {
        super("Vector");
    }
}
exports.VectorType = VectorType;
VectorType.One = new VectorType();
class OptionalValue extends types_1.TypedValue {
    constructor(value = null) {
        super();
        this.value = value;
    }
    isSet() {
        return this.value ? true : false;
    }
    getTypedValue() {
        utils_1.guardValueIsSet("value", this.value);
        return this.value;
    }
    valueOf() {
        return this.value ? this.value.valueOf() : null;
    }
    equals(other) {
        var _a;
        return ((_a = this.value) === null || _a === void 0 ? void 0 : _a.equals(other.value)) || false;
    }
    getType() {
        return OptionalType.One;
    }
}
exports.OptionalValue = OptionalValue;
// TODO: make generic (in TypeScript's sense) or check homogenity.
class Vector extends types_1.TypedValue {
    constructor(items) {
        super();
        this.items = items;
    }
    getLength() {
        return this.items.length;
    }
    getItems() {
        return this.items;
    }
    valueOf() {
        return this.items.map(item => item.valueOf());
    }
    equals(other) {
        if (this.getLength() != other.getLength()) {
            return false;
        }
        for (let i = 0; i < this.getLength(); i++) {
            let selfItem = this.items[i];
            let otherItem = other.items[i];
            if (!selfItem.equals(otherItem)) {
                return false;
            }
        }
        return true;
    }
    getType() {
        return VectorType.One;
    }
}
exports.Vector = Vector;
//# sourceMappingURL=generic.js.map