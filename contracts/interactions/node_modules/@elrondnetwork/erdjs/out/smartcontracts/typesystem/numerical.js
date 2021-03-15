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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigIntValue = exports.BigUIntValue = exports.I64Value = exports.U64Value = exports.I32Value = exports.U32Value = exports.I16Value = exports.U16Value = exports.I8Value = exports.U8Value = exports.NumericalValue = exports.BigIntType = exports.BigUIntType = exports.I64Type = exports.U64Type = exports.I32Type = exports.U32Type = exports.I16Type = exports.U16Type = exports.I8Type = exports.U8Type = exports.NumericalType = void 0;
const errors = __importStar(require("../../errors"));
const types_1 = require("./types");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
class NumericalType extends types_1.PrimitiveType {
    constructor(name, sizeInBytes, withSign) {
        super(name);
        this.sizeInBytes = sizeInBytes;
        this.withSign = withSign;
    }
    hasFixedSize() {
        return this.sizeInBytes ? true : false;
    }
    hasArbitrarySize() {
        return !this.hasFixedSize();
    }
}
exports.NumericalType = NumericalType;
NumericalType.One = new NumericalType("NumericalType", 0, false);
class U8Type extends NumericalType {
    constructor() {
        super("U8", 1, false);
    }
}
exports.U8Type = U8Type;
U8Type.One = new U8Type();
class I8Type extends NumericalType {
    constructor() {
        super("I8", 1, true);
    }
}
exports.I8Type = I8Type;
I8Type.One = new I8Type();
class U16Type extends NumericalType {
    constructor() {
        super("U16", 2, false);
    }
}
exports.U16Type = U16Type;
U16Type.One = new U16Type();
class I16Type extends NumericalType {
    constructor() {
        super("I16", 2, true);
    }
}
exports.I16Type = I16Type;
I16Type.One = new I16Type();
class U32Type extends NumericalType {
    constructor() {
        super("U32", 4, false);
    }
}
exports.U32Type = U32Type;
U32Type.One = new U32Type();
class I32Type extends NumericalType {
    constructor() {
        super("I32", 4, true);
    }
}
exports.I32Type = I32Type;
I32Type.One = new I32Type();
class U64Type extends NumericalType {
    constructor() {
        super("U64", 8, false);
    }
}
exports.U64Type = U64Type;
U64Type.One = new U64Type();
class I64Type extends NumericalType {
    constructor() {
        super("I64", 8, true);
    }
}
exports.I64Type = I64Type;
I64Type.One = new I64Type();
class BigUIntType extends NumericalType {
    constructor() {
        super("BigUInt", 0, false);
    }
}
exports.BigUIntType = BigUIntType;
BigUIntType.One = new BigUIntType();
class BigIntType extends NumericalType {
    constructor() {
        super("BigInt", 0, true);
    }
}
exports.BigIntType = BigIntType;
BigIntType.One = new BigIntType();
/**
 * A numerical value fed to or fetched from a Smart Contract contract, as a strongly-typed, immutable abstraction.
 */
class NumericalValue extends types_1.PrimitiveValue {
    constructor(value, type) {
        super();
        if (!(value instanceof bignumber_js_1.default)) {
            throw new errors.ErrInvalidArgument("value", value, "not a big number");
        }
        this.value = value;
        this.type = type;
        this.sizeInBytes = type.sizeInBytes;
        this.withSign = type.withSign;
        if (!this.withSign && value.isNegative()) {
            throw new errors.ErrInvalidArgument("value", value.toString(10), "negative, but type is unsigned");
        }
    }
    /**
     * Returns whether two objects have the same value.
     *
     * @param other another NumericalValue
     */
    equals(other) {
        return this.value.isEqualTo(other.value);
    }
    valueOf() {
        return this.value;
    }
    getType() {
        return this.type;
    }
}
exports.NumericalValue = NumericalValue;
class U8Value extends NumericalValue {
    constructor(value) {
        super(new bignumber_js_1.default(value), U8Type.One);
    }
}
exports.U8Value = U8Value;
class I8Value extends NumericalValue {
    constructor(value) {
        super(new bignumber_js_1.default(value), I8Type.One);
    }
}
exports.I8Value = I8Value;
class U16Value extends NumericalValue {
    constructor(value) {
        super(new bignumber_js_1.default(value), U16Type.One);
    }
}
exports.U16Value = U16Value;
class I16Value extends NumericalValue {
    constructor(value) {
        super(new bignumber_js_1.default(value), I16Type.One);
    }
}
exports.I16Value = I16Value;
class U32Value extends NumericalValue {
    constructor(value) {
        super(new bignumber_js_1.default(value), U32Type.One);
    }
}
exports.U32Value = U32Value;
class I32Value extends NumericalValue {
    constructor(value) {
        super(new bignumber_js_1.default(value), I32Type.One);
    }
}
exports.I32Value = I32Value;
class U64Value extends NumericalValue {
    constructor(value) {
        super(value, U64Type.One);
    }
}
exports.U64Value = U64Value;
class I64Value extends NumericalValue {
    constructor(value) {
        super(value, I64Type.One);
    }
}
exports.I64Value = I64Value;
class BigUIntValue extends NumericalValue {
    constructor(value) {
        super(value, BigUIntType.One);
    }
}
exports.BigUIntValue = BigUIntValue;
class BigIntValue extends NumericalValue {
    constructor(value) {
        super(value, BigIntType.One);
    }
}
exports.BigIntValue = BigIntValue;
//# sourceMappingURL=numerical.js.map