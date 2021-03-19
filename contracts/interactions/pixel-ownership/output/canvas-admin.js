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
    var proxyProvider, smartContractAddress, smartContract, aliceJSON, aliceSecret, aliceWallet, aliceAddress, alice, aliceSigner, createCanvas, getCanvasDimensions, getLastValidPixelId, getCanvasTotalSupply, mintPixels, getCanvas, getOwnedPixels, changePixelColor, changeBatchPixelColor, pixel_ids, rs, gs, bs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                proxyProvider = new erdjs_1.ProxyProvider(config_1.LOCAL_PROXY, 100000000);
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
                createCanvas = function (w, h) { return __awaiter(void 0, void 0, void 0, function () {
                    var func, qResponse, qAddress, callTransaction, hashOne, txResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                func = new erdjs_1.ContractFunction("getOwner");
                                return [4 /*yield*/, smartContract.runQuery(proxyProvider, {
                                        func: func
                                    })];
                            case 1:
                                qResponse = _a.sent();
                                qAddress = new erdjs_1.Address(qResponse.firstResult().asHex);
                                console.log(qAddress.toString());
                                console.log(aliceAddress.toString());
                                callTransaction = smartContract.call({
                                    func: new erdjs_1.ContractFunction("createCanvas"),
                                    args: [erdjs_1.Argument.fromNumber(w), erdjs_1.Argument.fromNumber(h)],
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
                                returnData = qResponse.returnData;
                                for (i = 0; i < returnData.length; i++) {
                                    console.log(returnData[i].asNumber); //.asHex/Bool/etc 
                                }
                                return [2 /*return*/];
                        }
                    });
                }); };
                getLastValidPixelId = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var func, qResponse, returnData, i;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                func = new erdjs_1.ContractFunction("getLastValidPixelId");
                                return [4 /*yield*/, smartContract.runQuery(proxyProvider, {
                                        func: func,
                                        args: [erdjs_1.Argument.fromNumber(1)]
                                    })];
                            case 1:
                                qResponse = _a.sent();
                                qResponse.assertSuccess();
                                console.log("Size: ", qResponse.returnData.length);
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
                                returnData = qResponse.returnData;
                                for (i = 0; i < returnData.length; i++) {
                                    console.log(returnData[i].asNumber); //.asHex/Bool/etc 
                                }
                                return [2 /*return*/];
                        }
                    });
                }); };
                mintPixels = function (loop, units) { return __awaiter(void 0, void 0, void 0, function () {
                    var callTransactions, i, callTransaction, sync_then_sign, hashes, i, _a, _b, i, i, executed;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                callTransactions = [];
                                for (i = 0; i < loop; i++) {
                                    callTransaction = smartContract.call({
                                        func: new erdjs_1.ContractFunction("mintPixels"),
                                        args: [erdjs_1.Argument.fromNumber(1), erdjs_1.Argument.fromNumber(units)],
                                        gasLimit: new erdjs_1.GasLimit(1000000000)
                                    });
                                    callTransactions[i] = callTransaction;
                                }
                                return [4 /*yield*/, alice.sync(proxyProvider)];
                            case 1:
                                _c.sent();
                                sync_then_sign = function (txs) { return __awaiter(void 0, void 0, void 0, function () {
                                    var i;
                                    return __generator(this, function (_a) {
                                        for (i = 0; i < loop; i++) {
                                            txs[i].setNonce(alice.nonce);
                                            aliceSigner.sign(txs[i]);
                                            alice.incrementNonce();
                                        }
                                        return [2 /*return*/];
                                    });
                                }); };
                                return [4 /*yield*/, sync_then_sign(callTransactions)];
                            case 2:
                                _c.sent();
                                hashes = [];
                                i = 0;
                                _c.label = 3;
                            case 3:
                                if (!(i < loop)) return [3 /*break*/, 6];
                                _a = hashes;
                                _b = i;
                                return [4 /*yield*/, callTransactions[i].send(proxyProvider)];
                            case 4:
                                _a[_b] = _c.sent();
                                _c.label = 5;
                            case 5:
                                i++;
                                return [3 /*break*/, 3];
                            case 6:
                                i = 0;
                                _c.label = 7;
                            case 7:
                                if (!(i < loop)) return [3 /*break*/, 10];
                                return [4 /*yield*/, callTransactions[i].awaitExecuted(proxyProvider)];
                            case 8:
                                _c.sent();
                                _c.label = 9;
                            case 9:
                                i++;
                                return [3 /*break*/, 7];
                            case 10:
                                i = 0;
                                _c.label = 11;
                            case 11:
                                if (!(i < loop)) return [3 /*break*/, 14];
                                return [4 /*yield*/, proxyProvider.getTransactionStatus(hashes[i])];
                            case 12:
                                executed = _c.sent();
                                _c.label = 13;
                            case 13:
                                i++;
                                return [3 /*break*/, 11];
                            case 14: return [2 /*return*/];
                        }
                    });
                }); };
                getCanvas = function (from, upTo, log) { return __awaiter(void 0, void 0, void 0, function () {
                    var func, qResponse, returnData, i;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                func = new erdjs_1.ContractFunction("getCanvas");
                                return [4 /*yield*/, smartContract.runQuery(proxyProvider, {
                                        func: func,
                                        args: [erdjs_1.Argument.fromNumber(1), erdjs_1.Argument.fromNumber(from), erdjs_1.Argument.fromNumber(upTo)]
                                    })];
                            case 1:
                                qResponse = _a.sent();
                                // qResponse.assertSuccess();
                                console.log("Size: ", qResponse.returnData.length);
                                returnData = qResponse.returnData;
                                if (!log) {
                                    return [2 /*return*/];
                                }
                                for (i = 0; i < returnData.length; i++) {
                                    if (i % 3 === 0)
                                        console.log(" //");
                                    console.log(returnData[i].asNumber); //.asHex/Bool/etc 
                                }
                                return [2 /*return*/];
                        }
                    });
                }); };
                getOwnedPixels = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var func, qResponse, e_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                func = new erdjs_1.ContractFunction("getOwnedPixels");
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, smartContract.runQuery(proxyProvider, {
                                        func: func,
                                        args: [erdjs_1.Argument.fromPubkey(alice.address), erdjs_1.Argument.fromNumber(1), erdjs_1.Argument.fromNumber(1), erdjs_1.Argument.fromNumber(10000)]
                                    })];
                            case 2:
                                qResponse = _a.sent();
                                qResponse.assertSuccess();
                                console.log("Size: ", qResponse.returnData.length);
                                return [3 /*break*/, 4];
                            case 3:
                                e_1 = _a.sent();
                                console.log(e_1);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); };
                changePixelColor = function (canvas_id, pixel_ids, r, g, b, loop) { return __awaiter(void 0, void 0, void 0, function () {
                    var callTransactions, i, callTransaction, sync_then_sign, hashes, i, _a, _b, i, i, executed;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                callTransactions = [];
                                //&self, canvas_id: u32, pixel_id:u64, r:u8,g:u8,b:u8
                                for (i = 0; i < loop; i++) {
                                    console.log("creating tx");
                                    callTransaction = smartContract.call({
                                        func: new erdjs_1.ContractFunction("changePixelColor"),
                                        args: [
                                            erdjs_1.Argument.fromNumber(canvas_id),
                                            erdjs_1.Argument.fromNumber(pixel_ids[i]),
                                            erdjs_1.Argument.fromNumber(r[i]),
                                            erdjs_1.Argument.fromNumber(r[i]),
                                            erdjs_1.Argument.fromNumber(r[i])
                                        ],
                                        gasLimit: new erdjs_1.GasLimit(100000000)
                                    });
                                    callTransactions[i] = callTransaction;
                                }
                                return [4 /*yield*/, alice.sync(proxyProvider)];
                            case 1:
                                _c.sent();
                                sync_then_sign = function (txs) { return __awaiter(void 0, void 0, void 0, function () {
                                    var i;
                                    return __generator(this, function (_a) {
                                        for (i = 0; i < loop; i++) {
                                            txs[i].setNonce(alice.nonce);
                                            aliceSigner.sign(txs[i]);
                                            alice.incrementNonce();
                                        }
                                        return [2 /*return*/];
                                    });
                                }); };
                                return [4 /*yield*/, sync_then_sign(callTransactions)];
                            case 2:
                                _c.sent();
                                hashes = [];
                                i = 0;
                                _c.label = 3;
                            case 3:
                                if (!(i < loop)) return [3 /*break*/, 6];
                                _a = hashes;
                                _b = i;
                                return [4 /*yield*/, callTransactions[i].send(proxyProvider)];
                            case 4:
                                _a[_b] = _c.sent();
                                _c.label = 5;
                            case 5:
                                i++;
                                return [3 /*break*/, 3];
                            case 6:
                                i = 0;
                                _c.label = 7;
                            case 7:
                                if (!(i < loop)) return [3 /*break*/, 10];
                                return [4 /*yield*/, callTransactions[i].awaitExecuted(proxyProvider)];
                            case 8:
                                _c.sent();
                                _c.label = 9;
                            case 9:
                                i++;
                                return [3 /*break*/, 7];
                            case 10:
                                i = 0;
                                _c.label = 11;
                            case 11:
                                if (!(i < loop)) return [3 /*break*/, 14];
                                return [4 /*yield*/, proxyProvider.getTransactionStatus(hashes[i])];
                            case 12:
                                executed = _c.sent();
                                _c.label = 13;
                            case 13:
                                i++;
                                return [3 /*break*/, 11];
                            case 14: return [2 /*return*/];
                        }
                    });
                }); };
                changeBatchPixelColor = function (canvas_id, pixel_ids, r, g, b, loop) { return __awaiter(void 0, void 0, void 0, function () {
                    var callTransaction, hash, executed;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                //&self, canvas_id: u32, pixel_id:u64, r:u8,g:u8,b:u8
                                console.log("creating tx");
                                callTransaction = smartContract.call({
                                    func: new erdjs_1.ContractFunction("changePixelColor"),
                                    args: [
                                        erdjs_1.Argument.fromNumber(canvas_id),
                                        erdjs_1.Argument.fromBytes(Buffer.from(pixel_ids)),
                                        erdjs_1.Argument.fromBytes(Buffer.from(r)),
                                        erdjs_1.Argument.fromBytes(Buffer.from(g)),
                                        erdjs_1.Argument.fromBytes(Buffer.from(b)),
                                    ],
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
                                hash = _a.sent();
                                return [4 /*yield*/, callTransaction.awaitExecuted(proxyProvider)];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, proxyProvider.getTransactionStatus(hash)];
                            case 4:
                                executed = _a.sent();
                                console.log(executed);
                                return [2 /*return*/];
                        }
                    });
                }); };
                // await createCanvas(100, 100);
                // await getCanvasDimensions();
                // await getCanvasTotalSupply();
                // // await getLastValidPixelId();
                // for (let i = 0; i < 10; i++) {
                //     await mintPixels(5, 200); //100pixels
                //     await getLastValidPixelId();
                // }
                // await getLastValidPixelId();
                // // const stream =async()=>{
                //     // for(let i=0;i<10;i++){
                // await getCanvas(1,10000, false);
                //     // }
                // // } 
                // // await stream();
                // await getOwnedPixels(); // worked
                return [4 /*yield*/, getCanvas(1, 10, true)];
            case 3:
                // await createCanvas(100, 100);
                // await getCanvasDimensions();
                // await getCanvasTotalSupply();
                // // await getLastValidPixelId();
                // for (let i = 0; i < 10; i++) {
                //     await mintPixels(5, 200); //100pixels
                //     await getLastValidPixelId();
                // }
                // await getLastValidPixelId();
                // // const stream =async()=>{
                //     // for(let i=0;i<10;i++){
                // await getCanvas(1,10000, false);
                //     // }
                // // } 
                // // await stream();
                // await getOwnedPixels(); // worked
                _a.sent();
                pixel_ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                rs = [6, 6, 6, 6, 6, 6, 6, 6, 6, 6];
                gs = [6, 6, 6, 6, 6, 6, 6, 6, 6, 6];
                bs = [6, 6, 6, 6, 6, 6, 6, 6, 6, 6];
                return [4 /*yield*/, changePixelColor(1, pixel_ids, rs, gs, bs, 1)];
            case 4:
                _a.sent();
                return [4 /*yield*/, getCanvas(1, 10, true)];
            case 5:
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
