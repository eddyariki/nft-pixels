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
exports.onPrimitiveTypeSelect = exports.onPrimitiveValueSelect = exports.onTypedValueSelect = exports.onTypeSelect = void 0;
const errors = __importStar(require("../../errors"));
const address_1 = require("./address");
const boolean_1 = require("./boolean");
const generic_1 = require("./generic");
const numerical_1 = require("./numerical");
const structure_1 = require("./structure");
const types_1 = require("./types");
function onTypeSelect(type, selectors) {
    if (type instanceof generic_1.OptionalType) {
        return selectors.onOptional();
    }
    if (type instanceof generic_1.VectorType) {
        return selectors.onVector();
    }
    if (type instanceof types_1.PrimitiveType) {
        return selectors.onPrimitive();
    }
    if (type instanceof structure_1.StructureType) {
        return selectors.onStructure();
    }
    if (selectors.onOther) {
        return selectors.onOther();
    }
    throw new errors.ErrTypingSystem(`type isn't known: ${type}`);
}
exports.onTypeSelect = onTypeSelect;
function onTypedValueSelect(value, selectors) {
    if (value instanceof types_1.PrimitiveValue) {
        return selectors.onPrimitive();
    }
    if (value instanceof generic_1.OptionalValue) {
        return selectors.onOptional();
    }
    if (value instanceof generic_1.Vector) {
        return selectors.onVector();
    }
    if (value instanceof structure_1.Structure) {
        return selectors.onStructure();
    }
    if (selectors.onOther) {
        return selectors.onOther();
    }
    throw new errors.ErrTypingSystem(`value isn't typed: ${value}`);
}
exports.onTypedValueSelect = onTypedValueSelect;
function onPrimitiveValueSelect(value, selectors) {
    if (value instanceof boolean_1.BooleanValue) {
        return selectors.onBoolean();
    }
    if (value instanceof numerical_1.NumericalValue) {
        return selectors.onNumerical();
    }
    if (value instanceof address_1.AddressValue) {
        return selectors.onAddress();
    }
    if (selectors.onOther) {
        return selectors.onOther();
    }
    throw new errors.ErrTypingSystem(`values isn't a primitive: ${value}`);
}
exports.onPrimitiveValueSelect = onPrimitiveValueSelect;
function onPrimitiveTypeSelect(type, selectors) {
    if (type instanceof boolean_1.BooleanType) {
        return selectors.onBoolean();
    }
    if (type instanceof numerical_1.NumericalType) {
        return selectors.onNumerical();
    }
    if (type instanceof address_1.AddressType) {
        return selectors.onAddress();
    }
    if (selectors.onOther) {
        return selectors.onOther();
    }
    throw new errors.ErrTypingSystem(`type isn't a known primitive: ${type}`);
}
exports.onPrimitiveTypeSelect = onPrimitiveTypeSelect;
//# sourceMappingURL=matchers.js.map