import { BigNumber } from "bignumber.js";
/**
 * Balance, as an immutable object.
 */
export declare class Balance {
    private readonly value;
    /**
     * Creates a Balance object.
     */
    constructor(value: string);
    /**
     * Creates a balance object from an eGLD value (denomination will be applied).
     */
    static eGLD(value: any): Balance;
    /**
     * Creates a balance object from a string (with denomination included).
     */
    static fromString(value: string): Balance;
    /**
     * Creates a zero-valued balance object.
     */
    static Zero(): Balance;
    /**
     * Returns the string representation of the value (as eGLD currency).
     */
    toCurrencyString(): string;
    toDenominated(): string;
    /**
     * Returns the string representation of the value (its big-integer form).
     */
    toString(): string;
    /**
     * Converts the balance to a pretty, plain JavaScript object.
     */
    toJSON(): object;
    valueOf(): BigNumber;
}
