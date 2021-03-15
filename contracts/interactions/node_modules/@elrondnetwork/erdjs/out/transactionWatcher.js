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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionWatcher = void 0;
const asyncTimer_1 = require("./asyncTimer");
const transaction_1 = require("./transaction");
const errors = __importStar(require("./errors"));
const logger_1 = require("./logger");
/**
 * TransactionWatcher allows one to continuously watch (monitor), by means of polling, the status of a given transaction.
 */
class TransactionWatcher {
    /**
     *
     * @param hash The hash of the transaction to watch
     * @param provider The provider to query the status from
     * @param pollingInterval The polling interval, in milliseconds
     * @param timeout The timeout, in milliseconds
     */
    constructor(hash, provider, pollingInterval = TransactionWatcher.DefaultPollingInterval, timeout = TransactionWatcher.DefaultTimeout) {
        this.hash = hash;
        this.provider = provider;
        this.pollingInterval = pollingInterval;
        this.timeout = timeout;
    }
    /**
     * Waits until the transaction reaches the "pending" status.
     */
    awaitPending() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.awaitStatus(status => status.isPending());
        });
    }
    /**
      * Waits until the transaction reaches the "executed" status.
      */
    awaitExecuted() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.awaitStatus(status => status.isExecuted());
        });
    }
    /**
     * Waits until the predicate over the transaction status evaluates to "true".
     * @param isAwaitedStatus A predicate over the status
     */
    awaitStatus(isAwaitedStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            let periodicTimer = new asyncTimer_1.AsyncTimer("watcher:periodic");
            let timeoutTimer = new asyncTimer_1.AsyncTimer("watcher:timeout");
            let stop = false;
            let currentStatus = transaction_1.TransactionStatus.createUnknown();
            timeoutTimer.start(this.timeout).finally(() => {
                timeoutTimer.stop();
                stop = true;
            });
            while (!stop) {
                try {
                    currentStatus = yield this.provider.getTransactionStatus(this.hash);
                    if (isAwaitedStatus(currentStatus) || stop) {
                        break;
                    }
                }
                catch (error) {
                    logger_1.Logger.trace("cannot (yet) get status");
                }
                yield periodicTimer.start(this.pollingInterval);
            }
            if (!timeoutTimer.isStopped()) {
                timeoutTimer.stop();
            }
            if (!isAwaitedStatus(currentStatus)) {
                throw new errors.ErrExpectedTransactionStatusNotReached();
            }
        });
    }
}
exports.TransactionWatcher = TransactionWatcher;
TransactionWatcher.DefaultPollingInterval = 5000;
TransactionWatcher.DefaultTimeout = TransactionWatcher.DefaultPollingInterval * 10;
//# sourceMappingURL=transactionWatcher.js.map