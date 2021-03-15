import { ISigner, ISignable } from "./interface";
import { Address } from "./address";
/**
 * Null-object pattern: a null Signer, which does nothing.
 */
export declare class NullSigner implements ISigner {
    /**
     * Creates a NullSigner.
     */
    constructor();
    /**
     * Returns a void {@link Address}
     */
    getAddress(): Address;
    /**
     * Does nothing.
     */
    sign(_: ISignable): Promise<void>;
}
