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
exports.guardLength = exports.guardSameLength = exports.guardValueIsSet = exports.guardType = exports.VMTYPES = exports.CODE_HASH_LENGTH = exports.SEED_STRING_LENGTH = exports.ADDRESS_LENGTH = exports.HASH_LENGTH = void 0;
const errors = __importStar(require("./errors"));
exports.HASH_LENGTH = 32;
exports.ADDRESS_LENGTH = 32;
exports.SEED_STRING_LENGTH = 64;
exports.CODE_HASH_LENGTH = exports.HASH_LENGTH;
exports.VMTYPES = ["0500"];
function guardType(name, type, value, allowUndefined = true) {
    if (allowUndefined && value === undefined) {
        return;
    }
    if (value instanceof type) {
        return;
    }
    throw new errors.ErrBadType(name, type, value);
}
exports.guardType = guardType;
function guardValueIsSet(name, value) {
    if (value == null || value === undefined) {
        throw new errors.ErrMissingValue(name);
    }
}
exports.guardValueIsSet = guardValueIsSet;
function guardSameLength(a, b) {
    a = a || [];
    b = b || [];
    if (a.length != b.length) {
        throw new errors.ErrInvariantFailed("arrays do not have the same length");
    }
}
exports.guardSameLength = guardSameLength;
function guardLength(withLength, expectedLength) {
    let actualLength = withLength.length || 0;
    if (actualLength != expectedLength) {
        throw new errors.ErrInvariantFailed(`wrong length, expected: ${expectedLength}, actual: ${actualLength}`);
    }
}
exports.guardLength = guardLength;
//# sourceMappingURL=utils.js.map