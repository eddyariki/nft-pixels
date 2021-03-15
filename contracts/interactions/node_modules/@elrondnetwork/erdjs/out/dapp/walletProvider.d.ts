import { IDappProvider } from "./interface";
import { Transaction } from "../transaction";
export declare class WalletProvider implements IDappProvider {
    walletUrl: string;
    mainFrame: HTMLIFrameElement | undefined;
    /**
     * Creates a new WalletProvider
     * @param walletURL
     */
    constructor(walletURL?: string);
    /**
     * Waits for the wallet iframe to ping that it has been initialised
     */
    init(): Promise<boolean>;
    /**
     * Returns if the wallet iframe is up and running
     */
    isInitialized(): boolean;
    /**
     * Unlike isInitialized, isConnected returns true if the user alredy went through the login process
     *  and has the wallet session active
     */
    isConnected(): Promise<boolean>;
    /**
     * Fetches the login hook url and redirects the client to the wallet login.
     */
    login(): Promise<string>;
    /**
    * Fetches the logout hook url and redirects the client to the wallet logout.
    */
    logout(): Promise<boolean>;
    /**
     * Returns currently connected address. Empty string if not connected
     */
    getAddress(): Promise<string>;
    /**
     * Packs a {@link Transaction} and fetches correct redirect URL from the wallet API. Then redirects
     *   the client to the send transaction hook
     * @param transaction
     */
    sendTransaction(transaction: Transaction): Promise<Transaction>;
    private waitForRemote;
    private attachMainFrame;
    private isValidWalletSource;
    private baseWalletUrl;
}
