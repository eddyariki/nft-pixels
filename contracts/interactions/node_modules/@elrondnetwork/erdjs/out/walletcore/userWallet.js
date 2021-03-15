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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Randomness = exports.UserWallet = void 0;
const errors = __importStar(require("../errors"));
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const userKeys_1 = require("./userKeys");
const crypto = require("crypto");
const uuid_1 = require("uuid");
const scryptsy_1 = __importDefault(require("scryptsy"));
// In a future PR, improve versioning infrastructure for key-file objects in erdjs.
const Version = 4;
const CipherAlgorithm = "aes-128-ctr";
const DigestAlgorithm = "sha256";
const KeyDerivationFunction = "scrypt";
class UserWallet {
    /**
     * Copied from: https://github.com/ElrondNetwork/elrond-core-js/blob/v1.28.0/src/account.js#L76
     * Notes: adjustements (code refactoring, no change in logic), in terms of:
     *  - typing (since this is the TypeScript version)
     *  - error handling (in line with erdjs's error system)
     *  - references to crypto functions
     *  - references to object members
     *
     * Given a password, generates the contents for a file containing the account's secret key,
     * passed through a password-based key derivation function (kdf).
     */
    constructor(secretKey, password, randomness = new Randomness()) {
        const kdParams = new ScryptKeyDerivationParams();
        const derivedKey = UserWallet.generateDerivedKey(Buffer.from(password), randomness.salt, kdParams);
        const derivedKeyFirstHalf = derivedKey.slice(0, 16);
        const derivedKeySecondHalf = derivedKey.slice(16, 32);
        const cipher = crypto.createCipheriv(CipherAlgorithm, derivedKeyFirstHalf, randomness.iv);
        const text = Buffer.concat([secretKey.valueOf(), secretKey.generatePublicKey().valueOf()]);
        const ciphertext = Buffer.concat([cipher.update(text), cipher.final()]);
        const mac = crypto.createHmac(DigestAlgorithm, derivedKeySecondHalf).update(ciphertext).digest();
        this.publicKey = secretKey.generatePublicKey();
        this.randomness = randomness;
        this.ciphertext = ciphertext;
        this.mac = mac;
        this.kdfparams = kdParams;
    }
    /**
     * Copied from: https://github.com/ElrondNetwork/elrond-core-js/blob/v1.28.0/src/account.js#L42
     * Notes: adjustements (code refactoring, no change in logic), in terms of:
     *  - typing (since this is the TypeScript version)
     *  - error handling (in line with erdjs's error system)
     *  - references to crypto functions
     *  - references to object members
     *
     * From an encrypted keyfile, given the password, loads the secret key and the public key.
     */
    static decryptSecretKey(keyFileObject, password) {
        const kdfparams = keyFileObject.crypto.kdfparams;
        const salt = Buffer.from(kdfparams.salt, "hex");
        const iv = Buffer.from(keyFileObject.crypto.cipherparams.iv, "hex");
        const ciphertext = Buffer.from(keyFileObject.crypto.ciphertext, "hex");
        const derivedKey = UserWallet.generateDerivedKey(Buffer.from(password), salt, kdfparams);
        const derivedKeyFirstHalf = derivedKey.slice(0, 16);
        const derivedKeySecondHalf = derivedKey.slice(16, 32);
        const computedMAC = crypto.createHmac(DigestAlgorithm, derivedKeySecondHalf).update(ciphertext).digest();
        const actualMAC = keyFileObject.crypto.mac;
        if (computedMAC.toString("hex") !== actualMAC) {
            throw new errors.ErrWallet("MAC mismatch, possibly wrong password");
        }
        const decipher = crypto.createDecipheriv(keyFileObject.crypto.cipher, derivedKeyFirstHalf, iv);
        let text = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
        while (text.length < 32) {
            let zeroPadding = Buffer.from([0x00]);
            text = Buffer.concat([zeroPadding, text]);
        }
        let seed = text.slice(0, 32);
        return new userKeys_1.UserSecretKey(seed);
    }
    /**
     * Will take about:
     *  - 80-90 ms in Node.js, on a i3-8100 CPU @ 3.60GHz
     *  - 350-360 ms in browser (Firefox), on a i3-8100 CPU @ 3.60GHz
     */
    static generateDerivedKey(password, salt, kdfparams) {
        // Question for review: @ccorcoveanu, why not this implementation?
        // https://nodejs.org/api/crypto.html#crypto_crypto_scrypt_password_salt_keylen_options_callback
        const derivedKey = scryptsy_1.default(password, salt, kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen);
        return derivedKey;
    }
    /**
     * Converts the encrypted keyfile to plain JavaScript object.
     */
    toJSON() {
        return {
            version: Version,
            id: this.randomness.id,
            address: this.publicKey.hex(),
            bech32: this.publicKey.toAddress().toString(),
            crypto: {
                ciphertext: this.ciphertext.toString("hex"),
                cipherparams: { iv: this.randomness.iv.toString("hex") },
                cipher: CipherAlgorithm,
                kdf: KeyDerivationFunction,
                kdfparams: {
                    dklen: this.kdfparams.dklen,
                    salt: this.randomness.salt.toString("hex"),
                    n: this.kdfparams.n,
                    r: this.kdfparams.r,
                    p: this.kdfparams.p
                },
                mac: this.mac.toString("hex"),
            }
        };
    }
}
exports.UserWallet = UserWallet;
class ScryptKeyDerivationParams {
    constructor() {
        /**
         * numIterations
         */
        this.n = 4096;
        /**
         * memFactor
         */
        this.r = 8;
        /**
         * pFactor
         */
        this.p = 1;
        this.dklen = 32;
    }
}
class Randomness {
    constructor(init) {
        this.salt = (init === null || init === void 0 ? void 0 : init.salt) || Buffer.from(tweetnacl_1.default.randomBytes(32));
        this.iv = (init === null || init === void 0 ? void 0 : init.iv) || Buffer.from(tweetnacl_1.default.randomBytes(16));
        this.id = (init === null || init === void 0 ? void 0 : init.id) || uuid_1.v4({ random: crypto.randomBytes(16) });
    }
}
exports.Randomness = Randomness;
//# sourceMappingURL=userWallet.js.map