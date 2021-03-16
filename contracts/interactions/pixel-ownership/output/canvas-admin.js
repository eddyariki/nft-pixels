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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var erdjs_1 = require("@elrondnetwork/erdjs");
var config_1 = require("./config");
var fs = require('fs');
var address = config_1.SMART_CONTRACT_ADDRESS;
var readJSON = function (file) { return __awaiter(void 0, void 0, void 0, function () {
    var jsonString;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fs.readFileSync("../users/" + file)];
            case 1:
                jsonString = _a.sent();
                return [2 /*return*/, JSON.parse(jsonString)];
        }
    });
}); };
var admin = function () { return __awaiter(void 0, void 0, void 0, function () {
    var proxyProvider, smartContractAddress, smartContract, aliceJSON, aliceSecret, aliceWallet, aliceAddress, alice, aliceSigner, createCanvas, getCanvasDimensions, getCanvasTotalSupply, mint, getCanvas;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                proxyProvider = new erdjs_1.ProxyProvider(config_1.LOCAL_PROXY);
                return [4 /*yield*/, erdjs_1.NetworkConfig.getDefault().sync(proxyProvider)];
            case 1:
                _a.sent();
                smartContractAddress = new erdjs_1.Address(address);
                smartContract = new erdjs_1.SmartContract({ address: smartContractAddress });
                return [4 /*yield*/, readJSON("alice.json")];
            case 2:
                aliceJSON = _a.sent();
                aliceSecret = erdjs_1.UserWallet.decryptSecretKey(aliceJSON, "password");
                aliceWallet = new erdjs_1.UserWallet(aliceSecret, "password");
                aliceAddress = new erdjs_1.Address(aliceSecret.generatePublicKey().toAddress());
                alice = new erdjs_1.Account(aliceAddress);
                aliceSigner = erdjs_1.UserSigner.fromWallet(aliceJSON, "password");
                createCanvas = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var func, qResponse, qAddress, callTransaction, hashOne, txResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                func = new erdjs_1.ContractFunction("getOwner");
                                return [4 /*yield*/, smartContract.runQuery(proxyProvider, { func: func
                                    })];
                            case 1:
                                qResponse = _a.sent();
                                qAddress = new erdjs_1.Address(qResponse.firstResult().asHex);
                                console.log(qAddress.toString());
                                console.log(aliceAddress.toString());
                                callTransaction = smartContract.call({
                                    func: new erdjs_1.ContractFunction("createCanvas"),
                                    args: [erdjs_1.Argument.fromNumber(50), erdjs_1.Argument.fromNumber(50)],
                                    gasLimit: new erdjs_1.GasLimit(20000000)
                                });
                                return [4 /*yield*/, alice.sync(proxyProvider)];
                            case 2:
                                _a.sent();
                                callTransaction.setNonce(alice.nonce);
                                alice.incrementNonce();
                                aliceSigner.sign(callTransaction);
                                return [4 /*yield*/, callTransaction.send(proxyProvider)];
                            case 3:
                                hashOne = _a.sent();
                                return [4 /*yield*/, callTransaction.awaitExecuted(proxyProvider)];
                            case 4:
                                _a.sent();
                                return [4 /*yield*/, alice.sync(proxyProvider)];
                            case 5:
                                _a.sent();
                                return [4 /*yield*/, proxyProvider.getTransaction(hashOne)];
                            case 6:
                                txResult = _a.sent();
                                console.log(txResult);
                                return [2 /*return*/];
                        }
                    });
                }); };
                getCanvasDimensions = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var func, qResponse, returnData, i;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                func = new erdjs_1.ContractFunction("getCanvasDimensionsTopEncoded");
                                return [4 /*yield*/, smartContract.runQuery(proxyProvider, {
                                        func: func,
                                        args: [erdjs_1.Argument.fromNumber(1)]
                                    })];
                            case 1:
                                qResponse = _a.sent();
                                qResponse.assertSuccess();
                                console.log("Size: ", qResponse.returnData.length);
                                console.log(qResponse.returnData);
                                returnData = qResponse.returnData;
                                for (i = 0; i < returnData.length; i++) {
                                    console.log(returnData[i].asNumber); //.asHex/Bool/etc 
                                }
                                return [2 /*return*/];
                        }
                    });
                }); };
                getCanvasTotalSupply = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var func, qResponse, returnData, i;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                func = new erdjs_1.ContractFunction("getTotalPixelSupplyOfCanvas");
                                return [4 /*yield*/, smartContract.runQuery(proxyProvider, {
                                        func: func,
                                        args: [erdjs_1.Argument.fromNumber(1)]
                                    })];
                            case 1:
                                qResponse = _a.sent();
                                qResponse.assertSuccess();
                                console.log("Size: ", qResponse.returnData.length);
                                console.log(qResponse.returnData);
                                returnData = qResponse.returnData;
                                for (i = 0; i < returnData.length; i++) {
                                    console.log(returnData[i].asNumber); //.asHex/Bool/etc 
                                }
                                return [2 /*return*/];
                        }
                    });
                }); };
                mint = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var callTransaction, hashOne, callResult, txResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                callTransaction = smartContract.call({
                                    func: new erdjs_1.ContractFunction("mintPixels"),
                                    args: [erdjs_1.Argument.fromNumber(1), erdjs_1.Argument.fromNumber(20)],
                                    gasLimit: new erdjs_1.GasLimit(100000000)
                                });
                                return [4 /*yield*/, alice.sync(proxyProvider)];
                            case 1:
                                _a.sent();
                                callTransaction.setNonce(alice.nonce);
                                aliceSigner.sign(callTransaction);
                                alice.incrementNonce();
                                return [4 /*yield*/, callTransaction.send(proxyProvider)];
                            case 2:
                                hashOne = _a.sent();
                                return [4 /*yield*/, callTransaction.awaitExecuted(proxyProvider)];
                            case 3:
                                callResult = _a.sent();
                                return [4 /*yield*/, alice.sync(proxyProvider)];
                            case 4:
                                _a.sent();
                                return [4 /*yield*/, proxyProvider.getTransaction(hashOne)];
                            case 5:
                                txResult = _a.sent();
                                console.log(callResult);
                                return [2 /*return*/];
                        }
                    });
                }); };
                getCanvas = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var func, qResponse, returnData, i;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                func = new erdjs_1.ContractFunction("getCanvas");
                                return [4 /*yield*/, smartContract.runQuery(proxyProvider, {
                                        func: func,
                                        args: [erdjs_1.Argument.fromNumber(1)]
                                    })];
                            case 1:
                                qResponse = _a.sent();
                                qResponse.assertSuccess();
                                console.log("Size: ", qResponse.returnData.length);
                                console.log(qResponse.returnData);
                                returnData = qResponse.returnData;
                                for (i = 0; i < returnData.length; i++) {
                                    console.log(returnData[i].asNumber); //.asHex/Bool/etc 
                                }
                                return [2 /*return*/];
                        }
                    });
                }); };
                // await createCanvas();
                // await getCanvasDimensions();
                // await getCanvasTotalSupply();
                return [4 /*yield*/, mint()];
            case 3:
                // await createCanvas();
                // await getCanvasDimensions();
                // await getCanvasTotalSupply();
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, admin()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
