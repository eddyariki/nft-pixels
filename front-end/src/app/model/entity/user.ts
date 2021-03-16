import { Account, UserSigner } from '@elrondnetwork/erdjs';

export interface User {
    address: string;
    account?: Account;
    signer: UserSigner;
}
