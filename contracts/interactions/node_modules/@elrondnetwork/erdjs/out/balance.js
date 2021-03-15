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
exports.Balance = void 0;
const errors = __importStar(require("./errors"));
const bignumber_js_1 = require("bignumber.js");
/**
 * The base used for toString methods to avoid exponential notation
 */
const BASE_10 = 10;
/**
 * The number of decimals handled when working with eGLD values.
 */
const DENOMINATION = 18;
/**
 * One eGLD, in its big-integer form (as a string).
 */
const OneEGLDString = "1000000000000000000";
bignumber_js_1.BigNumber.set({ DECIMAL_PLACES: DENOMINATION, ROUNDING_MODE: 1 });
/**
 * Balance, as an immutable object.
 */
class Balance {
    /**
     * Creates a Balance object.
     */
    constructor(value) {
        this.value = new bignumber_js_1.BigNumber(0);
        this.value = new bignumber_js_1.BigNumber(value);
        if (this.value.isNegative()) {
            throw new errors.ErrBalanceInvalid(this.value);
        }
    }
    /**
     * Creates a balance object from an eGLD value (denomination will be applied).
     */
    static eGLD(value) {
        let bigGold = new bignumber_js_1.BigNumber(value);
        let bigUnits = bigGold.multipliedBy(new bignumber_js_1.BigNumber(OneEGLDString));
        let bigUnitsString = bigUnits.integerValue().toString(BASE_10);
        return new Balance(bigUnitsString);
    }
    /**
     * Creates a balance object from a string (with denomination included).
     */
    static fromString(value) {
        return new Balance(value);
    }
    /**
     * Creates a zero-valued balance object.
     */
    static Zero() {
        return new Balance('0');
    }
    /**
     * Returns the string representation of the value (as eGLD currency).
     */
    toCurrencyString() {
        let denominated = this.toDenominated();
        return `${denominated} eGLD`;
    }
    toDenominated() {
        let padded = this.toString().padStart(DENOMINATION, "0");
        let decimals = padded.slice(-DENOMINATION);
        let integer = padded.slice(0, padded.length - DENOMINATION) || 0;
        return `${integer}.${decimals}`;
    }
    /**
     * Returns the string representation of the value (its big-integer form).
     */
    toString() {
        return this.value.toString(BASE_10);
    }
    /**
     * Converts the balance to a pretty, plain JavaScript object.
     */
    toJSON() {
        return {
            asString: this.toString(),
            asCurrencyString: this.toCurrencyString()
        };
    }
    valueOf() {
        return this.value;
    }
}
exports.Balance = Balance;
//# sourceMappingURL=balance.js.map