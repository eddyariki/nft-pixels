import { Account } from '@elrondnetwork/erdjs';
import { ISigner } from '@elrondnetwork/erdjs/out/interface';
export interface User {
    id: string;
    account?: Account;
    signer?: ISigner | string;
    loggedIn?: boolean;
    keystoreFile?: string;
    password?: string;
    keystoreFile?: any;
}
