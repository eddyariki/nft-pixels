import { IProvider } from "./interface";
import { TransactionHash, TransactionStatus } from "./transaction";
/**
 * TransactionWatcher allows one to continuously watch (monitor), by means of polling, the status of a given transaction.
 */
export declare class TransactionWatcher {
    static DefaultPollingInterval: number;
    static DefaultTimeout: number;
    private readonly hash;
    private readonly provider;
    private readonly pollingInterval;
    private readonly timeout;
    /**
     *
     * @param hash The hash of the transaction to watch
     * @param provider The provider to query the status from
     * @param pollingInterval The polling interval, in milliseconds
     * @param timeout The timeout, in milliseconds
     */
    constructor(hash: TransactionHash, provider: IProvider, pollingInterval?: number, timeout?: number);
    /**
     * Waits until the transaction reaches the "pending" status.
     */
    awaitPending(): Promise<void>;
    /**
      * Waits until the transaction reaches the "executed" status.
      */
    awaitExecuted(): Promise<void>;
    /**
     * Waits until the predicate over the transaction status evaluates to "true".
     * @param isAwaitedStatus A predicate over the status
     */
    awaitStatus(isAwaitedStatus: (status: TransactionStatus) => boolean): Promise<void>;
}
