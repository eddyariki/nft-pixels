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
exports.loadContractCode = exports.getMainnetProvider = exports.getTestnetProvider = exports.getDevnetProvider = void 0;
const proxyProvider_1 = require("../proxyProvider");
const code_1 = require("../smartcontracts/code");
function getDevnetProvider() {
    return new proxyProvider_1.ProxyProvider("http://localhost:7950", 5000);
}
exports.getDevnetProvider = getDevnetProvider;
function getTestnetProvider() {
    return new proxyProvider_1.ProxyProvider("https://testnet-gateway.elrond.com", 5000);
}
exports.getTestnetProvider = getTestnetProvider;
function getMainnetProvider() {
    return new proxyProvider_1.ProxyProvider("https://gateway.elrond.com", 5000);
}
exports.getMainnetProvider = getMainnetProvider;
function loadContractCode(path) {
    return __awaiter(this, void 0, void 0, function* () {
        if (isBrowser()) {
            return code_1.Code.fromUrl(path.toString());
        }
        return code_1.Code.fromFile(path);
    });
}
exports.loadContractCode = loadContractCode;
function isBrowser() {
    return typeof window !== "undefined";
}
//# sourceMappingURL=utils.js.map