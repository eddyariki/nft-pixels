"use strict";
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
exports.WalletProvider = void 0;
const constants_1 = require("./constants");
const dom_1 = require("./dom");
class WalletProvider {
    /**
     * Creates a new WalletProvider
     * @param walletURL
     */
    constructor(walletURL = '') {
        this.walletUrl = walletURL;
        this.attachMainFrame();
        this.init().then();
    }
    /**
     * Waits for the wallet iframe to ping that it has been initialised
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isInitialized()) {
                return true;
            }
            return this.waitForRemote();
        });
    }
    /**
     * Returns if the wallet iframe is up and running
     */
    isInitialized() {
        if (!this.mainFrame) {
            return false;
        }
        return this.mainFrame.dataset.initialized === "true";
    }
    /**
     * Unlike isInitialized, isConnected returns true if the user alredy went through the login process
     *  and has the wallet session active
     */
    isConnected() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.mainFrame) {
                return false;
            }
            const { contentWindow } = this.mainFrame;
            if (!contentWindow) {
                return false;
            }
            return new Promise((resolve, reject) => {
                console.log("postMessage", constants_1.DAPP_MESSAGE_IS_CONNECTED);
                contentWindow.postMessage({
                    type: constants_1.DAPP_MESSAGE_IS_CONNECTED,
                }, this.walletUrl);
                const timeout = setTimeout(_ => reject('window not responding'), 5000);
                const isConnected = (ev) => {
                    console.log("event", "isConnected", ev);
                    if (!this.isValidWalletSource(ev.origin)) {
                        return;
                    }
                    const { data } = ev;
                    if (data.type !== constants_1.DAPP_MESSAGE_IS_CONNECTED) {
                        return;
                    }
                    clearTimeout(timeout);
                    window.removeEventListener('message', isConnected.bind(this));
                    return resolve(data.data);
                };
                window.addEventListener('message', isConnected);
            });
        });
    }
    /**
     * Fetches the login hook url and redirects the client to the wallet login.
     */
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.mainFrame) {
                return '';
            }
            const { contentWindow } = this.mainFrame;
            if (!contentWindow) {
                console.warn("something went wrong, main wallet iframe does not contain a contentWindow");
                return '';
            }
            return new Promise((resolve, reject) => {
                console.log("postMessage", constants_1.DAPP_MESSAGE_CONNECT_URL);
                contentWindow.postMessage({
                    type: constants_1.DAPP_MESSAGE_CONNECT_URL,
                }, this.walletUrl);
                const timeout = setTimeout(_ => reject('connect url not responding'), 5000);
                const connectUrl = (ev) => {
                    console.log("event", "connectUrl", ev);
                    if (!this.isValidWalletSource(ev.origin)) {
                        return;
                    }
                    const { data } = ev;
                    if (data.type !== constants_1.DAPP_MESSAGE_CONNECT_URL) {
                        return;
                    }
                    clearTimeout(timeout);
                    window.removeEventListener('message', connectUrl.bind(this));
                    return resolve(data.data.toString());
                };
                window.addEventListener('message', connectUrl);
            }).then((connectionUrl) => {
                window.location.href = `${this.baseWalletUrl()}${connectionUrl}?callbackUrl=${window.location.href}`;
                return window.location.href;
            }).catch(_ => {
                return '';
            });
        });
    }
    /**
    * Fetches the logout hook url and redirects the client to the wallet logout.
    */
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.mainFrame) {
                return false;
            }
            const { contentWindow } = this.mainFrame;
            if (!contentWindow) {
                console.warn("something went wrong, main wallet iframe does not contain a contentWindow");
                return false;
            }
            return new Promise((resolve, reject) => {
                console.log("postMessage", constants_1.DAPP_MESSAGE_LOG_OUT);
                contentWindow.postMessage({
                    type: constants_1.DAPP_MESSAGE_LOG_OUT,
                }, this.walletUrl);
                const timeout = setTimeout(_ => reject('logout url not responding'), 5000);
                const logout = (ev) => {
                    console.log("event", "logouturl", ev);
                    if (!this.isValidWalletSource(ev.origin)) {
                        return;
                    }
                    const { data } = ev;
                    if (data.type !== constants_1.DAPP_MESSAGE_LOG_OUT) {
                        return;
                    }
                    clearTimeout(timeout);
                    window.removeEventListener('message', logout.bind(this));
                    return resolve(data.data);
                };
                window.addEventListener('message', logout);
            });
        });
    }
    /**
     * Returns currently connected address. Empty string if not connected
     */
    getAddress() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.mainFrame) {
                return '';
            }
            const { contentWindow } = this.mainFrame;
            if (!contentWindow) {
                return '';
            }
            return new Promise((resolve, reject) => {
                console.log("postMessage", constants_1.DAPP_MESSAGE_GET_ADDRESS);
                contentWindow.postMessage({
                    type: constants_1.DAPP_MESSAGE_GET_ADDRESS,
                }, this.walletUrl);
                const timeout = setTimeout(_ => reject('window not responding'), 5000);
                const getAddress = (ev) => {
                    console.log("event", "getAddress", ev);
                    if (!this.isValidWalletSource(ev.origin)) {
                        return;
                    }
                    const { data } = ev;
                    if (data.type !== constants_1.DAPP_MESSAGE_GET_ADDRESS) {
                        return;
                    }
                    clearTimeout(timeout);
                    window.removeEventListener('message', getAddress.bind(this));
                    return resolve(data.data);
                };
                window.addEventListener('message', getAddress);
            });
        });
    }
    /**
     * Packs a {@link Transaction} and fetches correct redirect URL from the wallet API. Then redirects
     *   the client to the send transaction hook
     * @param transaction
     */
    sendTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.mainFrame) {
                throw new Error("Wallet provider is not initialised, call init() first");
            }
            const { contentWindow } = this.mainFrame;
            if (!contentWindow) {
                throw new Error("Wallet provider is not initialised, call init() first");
            }
            return new Promise((resolve, reject) => {
                let plainTransaction = transaction.toPlainObject();
                // We adjust the fields, in order to make them compatible with what the wallet expected
                plainTransaction["data"] = transaction.data.valueOf().toString();
                plainTransaction["value"] = transaction.value.toString();
                plainTransaction["gasPrice"] = transaction.gasPrice.valueOf();
                plainTransaction["gasLimit"] = transaction.gasLimit.valueOf();
                console.log("postMessage", constants_1.DAPP_MESSAGE_SEND_TRANSACTION_URL, plainTransaction);
                contentWindow.postMessage({
                    type: constants_1.DAPP_MESSAGE_SEND_TRANSACTION_URL,
                    data: {
                        transaction: plainTransaction
                    }
                }, this.walletUrl);
                const timeout = setTimeout(_ => reject('send transaction url not responding'), 5000);
                const sendTransactionUrl = (ev) => {
                    console.log("event", "sendTransactionUrl", ev);
                    if (!this.isValidWalletSource(ev.origin)) {
                        return;
                    }
                    const { data } = ev;
                    if (data.type !== constants_1.DAPP_MESSAGE_SEND_TRANSACTION_URL) {
                        return;
                    }
                    clearTimeout(timeout);
                    window.removeEventListener('message', sendTransactionUrl.bind(this));
                    if (data.error) {
                        return reject(data.error);
                    }
                    return resolve(data.data.toString());
                };
                window.addEventListener('message', sendTransactionUrl);
            }).then((url) => {
                window.location.href = `${this.baseWalletUrl()}${url}&callbackUrl=${window.location.href}`;
                return transaction;
            });
        });
    }
    waitForRemote() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const timeout = setTimeout(_ => reject(false), constants_1.DAPP_DEFAULT_TIMEOUT);
                const setConnected = (ev) => {
                    console.log("event", "setConnected", ev);
                    if (!this.mainFrame) {
                        return;
                    }
                    if (!this.isValidWalletSource(ev.origin)) {
                        return;
                    }
                    const { data } = ev;
                    if (data.type !== constants_1.DAPP_MESSAGE_INIT) {
                        return;
                    }
                    clearTimeout(timeout);
                    window.removeEventListener('message', setConnected);
                    this.mainFrame.dataset.initialized = data.data.toString();
                    resolve(data.data);
                };
                window.addEventListener('message', setConnected.bind(this));
            });
        });
    }
    attachMainFrame() {
        const currentMainframe = document.querySelector(`iframe[src="${this.walletUrl}"]`);
        if (currentMainframe) {
            this.mainFrame = currentMainframe;
            return;
        }
        let mainFrame = document.createElement('iframe');
        mainFrame.src = this.walletUrl;
        Object.assign(mainFrame.style, dom_1.mainFrameStyle());
        mainFrame.dataset.initialized = "false";
        document.body.appendChild(mainFrame);
        this.mainFrame = mainFrame;
    }
    isValidWalletSource(origin) {
        return origin === this.walletUrl || origin === this.baseWalletUrl();
    }
    baseWalletUrl() {
        const pathArray = this.walletUrl.split('/');
        const protocol = pathArray[0];
        const host = pathArray[2];
        return protocol + '//' + host;
    }
}
exports.WalletProvider = WalletProvider;
//# sourceMappingURL=walletProvider.js.map