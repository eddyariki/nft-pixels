"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendArguments = exports.Argument = void 0;
const buffer_1 = require("buffer");
const codec_1 = require("./codec");
const typesystem_1 = require("./typesystem");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
/**
 * The Argument abstraction allows one to prepare arguments for Smart Contract calls (and deployments).
 */
class Argument {
    /**
     * Creates an Argument object from the actual value (hex-encoded).
     *
     * @param hexEncoded The actual value of the argument
     */
    constructor(hexEncoded) {
        /**
         * The actual value of the argument, to be passed to the Protocol (as a hex-encoded string).
         */
        this.hexEncoded = "";
        this.hexEncoded = Argument.ensureEvenLength(hexEncoded);
    }
    static ensureEvenLength(argument) {
        return argument.length % 2 == 0 ? argument : "0" + argument;
    }
    /**
     * Creates an Argument object given a buffer (a sequence of bytes).
     */
    static fromBytes(buffer) {
        let hex = buffer.toString("hex");
        return new Argument(hex);
    }
    /**
     * Creates an Argument object from a number.
     */
    static fromNumber(value) {
        return Argument.fromBigInt(new bignumber_js_1.default(value));
    }
    /**
     * Creates an Argument object from a big integer.
     */
    static fromBigInt(value) {
        let hex = value.toString(16);
        return new Argument(hex);
    }
    /**
     * Creates an Argument object from an already-encoded hex string.
     */
    static fromHex(value) {
        return new Argument(value);
    }
    /**
     * Creates an Argument object from a utf-8 string.
     */
    static fromUTF8(value) {
        let buffer = buffer_1.Buffer.from(value, "utf-8");
        let hex = buffer.toString("hex");
        return new Argument(hex);
    }
    /**
     * Creates an Argument object, as the pubkey of an {@link Address}.
     */
    static fromPubkey(value) {
        return new Argument(value.hex());
    }
    /**
     * Creates an Argument object, as a missing optional argument.
     */
    static fromMissingOptional() {
        return Argument.fromTypedValue(new typesystem_1.OptionalValue());
    }
    /**
     * Creates an Argument object, as a provided optional argument.
     */
    static fromProvidedOptional(typedValue) {
        return Argument.fromTypedValue(new typesystem_1.OptionalValue(typedValue));
    }
    static fromTypedValue(typedValue) {
        let buffer = Argument.codec.encodeTopLevel(typedValue);
        let hexEncoded = buffer.toString("hex");
        return new Argument(hexEncoded);
    }
    valueOf() {
        return this.hexEncoded;
    }
}
exports.Argument = Argument;
/**
 * For the moment, this is the only codec used.
 */
Argument.codec = new codec_1.BinaryCodec();
/**
 * Appends Argument objects to a given string.
 * The resulted string is to be used for preparing Smart Contract calls (or deployments).
 * In general, this function should not be used directly.
 * It is used by {@link TransactionPayload} builders (such as {@link ContractCallPayloadBuilder}), under the hood.
 *
 * ```
 * let data = appendArguments("transferToken", [Argument.pubkey(alice), Argument.number(42)]);
 * let payload = new TransactionPayload(data);
 * ```
 *
 * @param to
 * @param args
 */
function appendArguments(to, args) {
    if (args.length == 0) {
        return to;
    }
    args.forEach(arg => {
        to += "@" + arg.valueOf();
    });
    return to;
}
exports.appendArguments = appendArguments;
//# sourceMappingURL=argument.js.map