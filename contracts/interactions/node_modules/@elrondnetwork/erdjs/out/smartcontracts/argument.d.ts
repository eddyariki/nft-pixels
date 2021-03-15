/// <reference types="node" />
import { Address } from "../address";
import { TypedValue } from "./typesystem";
import BigNumber from "bignumber.js";
/**
 * The Argument abstraction allows one to prepare arguments for Smart Contract calls (and deployments).
 */
export declare class Argument {
    /**
     * For the moment, this is the only codec used.
     */
    private static codec;
    /**
     * The actual value of the argument, to be passed to the Protocol (as a hex-encoded string).
     */
    private readonly hexEncoded;
    /**
     * Creates an Argument object from the actual value (hex-encoded).
     *
     * @param hexEncoded The actual value of the argument
     */
    private constructor();
    private static ensureEvenLength;
    /**
     * Creates an Argument object given a buffer (a sequence of bytes).
     */
    static fromBytes(buffer: Buffer): Argument;
    /**
     * Creates an Argument object from a number.
     */
    static fromNumber(value: number): Argument;
    /**
     * Creates an Argument object from a big integer.
     */
    static fromBigInt(value: BigNumber): Argument;
    /**
     * Creates an Argument object from an already-encoded hex string.
     */
    static fromHex(value: string): Argument;
    /**
     * Creates an Argument object from a utf-8 string.
     */
    static fromUTF8(value: string): Argument;
    /**
     * Creates an Argument object, as the pubkey of an {@link Address}.
     */
    static fromPubkey(value: Address): Argument;
    /**
     * Creates an Argument object, as a missing optional argument.
     */
    static fromMissingOptional(): Argument;
    /**
     * Creates an Argument object, as a provided optional argument.
     */
    static fromProvidedOptional(typedValue: TypedValue): Argument;
    static fromTypedValue(typedValue: TypedValue): Argument;
    valueOf(): string;
}
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
export declare function appendArguments(to: string, args: Argument[]): string;
