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
var typesystem_1 = require("@elrondnetwork/erdjs/out/smartcontracts/typesystem");
var bignumber_js_1 = require("bignumber.js");
var fs = require('fs');
var address = config_1.SMART_CONTRACT_ADDRESS;
var readJSON = function (file) { return __awaiter(void 0, void 0, void 0, function () {
    var jsonString;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fs.readFileSync("../keystores/" + file)];
            case 1:
                jsonString = _a.sent();
                return [2 /*return*/, JSON.parse(jsonString)];
        }
    });
}); };
var admin = function () { return __awaiter(void 0, void 0, void 0, function () {
    var proxyProvider, smartContractAddress, smartContract, adminJSON, adminSecret, adminWallet, adminAddress, admin, adminSigner, createCanvas, getCanvasDimensions, getLastValidPixelId, getCanvasTotalSupply, mintPixels, getCanvas, getOwnedPixels, getOwnedPixelsBob, getOwnedPixelsColor, changePixelColor, createU8VectorArgument, createU32VectorArgument, createU64VectorArgument, changeBatchPixelColor, createAuction, endAuction, endAuctionBob, getAuctions, bidAuction, getAuctionStartingPrice, getAuctionEndingPrice, getAuctionDeadline, getAuctionOwner, getAuctionCurrentBid, getAuctionCurrentWinner, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                proxyProvider = new erdjs_1.ProxyProvider(config_1.LOCAL_PROXY, 100000000);
                return [4 /*yield*/, erdjs_1.NetworkConfig.getDefault().sync(proxyProvider)];
            case 1:
                _a.sent();
                smartContractAddress = new erdjs_1.Address(address);
                smartContract = new erdjs_1.SmartContract({ address: smartContractAddress });
                return [4 /*yield*/, readJSON("admin.json")];
            case 2:
                adminJSON = _a.sent();
                adminSecret = erdjs_1.UserWallet.decryptSecretKey(adminJSON, 'Hackathon01!');
                adminWallet = new erdjs_1.UserWallet(adminSecret, 'Hackathon01!');
                adminAddress = new erdjs_1.Address(adminSecret.generatePublicKey().toAddress());
                admin = new erdjs_1.Account(adminAddress);
                adminSigner = erdjs_1.UserSigner.fromWallet(adminJSON, 'Hackathon01!');
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
                                console.log(adminAddress.toString());
                                callTransaction = smartContract.call({
                                    func: new erdjs_1.ContractFunction("createCanvas"),
                                    args: [erdjs_1.Argument.fromNumber(w), erdjs_1.Argument.fromNumber(h)],
                                    gasLimit: new erdjs_1.GasLimit(20000000)
                                });
                                return [4 /*yield*/, admin.sync(proxyProvider)];
                            case 2:
                                _a.sent();
                                callTransaction.setNonce(admin.nonce);
                                admin.incrementNonce();
                                adminSigner.sign(callTransaction);
                                return [4 /*yield*/, callTransaction.send(proxyProvider)];
                            case 3:
                                hashOne = _a.sent();
                                return [4 /*yield*/, callTransaction.awaitExecuted(proxyProvider)];
                            case 4:
                                _a.sent();
                                return [4 /*yield*/, admin.sync(proxyProvider)];
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
                                return [4 /*yield*/, admin.sync(proxyProvider)];
                            case 1:
                                _c.sent();
                                sync_then_sign = function (txs) { return __awaiter(void 0, void 0, void 0, function () {
                                    var i;
                                    return __generator(this, function (_a) {
                                        for (i = 0; i < loop; i++) {
                                            txs[i].setNonce(admin.nonce);
                                            adminSigner.sign(txs[i]);
                                            admin.incrementNonce();
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
                                        args: [erdjs_1.Argument.fromPubkey(admin.address),
                                            erdjs_1.Argument.fromNumber(1),
                                            erdjs_1.Argument.fromNumber(1),
                                            erdjs_1.Argument.fromNumber(10000)]
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
                getOwnedPixelsBob = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var bobJSON, bobSecret, bobWallet, bobAddress, bob, bobSigner, func, qResponse, e_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, readJSON("bob.json")];
                            case 1:
                                bobJSON = _a.sent();
                                bobSecret = erdjs_1.UserWallet.decryptSecretKey(bobJSON, "password");
                                bobWallet = new erdjs_1.UserWallet(bobSecret, "password");
                                bobAddress = new erdjs_1.Address(bobSecret.generatePublicKey().toAddress());
                                bob = new erdjs_1.Account(bobAddress);
                                bobSigner = erdjs_1.UserSigner.fromWallet(bobJSON, "password");
                                func = new erdjs_1.ContractFunction("getOwnedPixels");
                                _a.label = 2;
                            case 2:
                                _a.trys.push([2, 4, , 5]);
                                return [4 /*yield*/, smartContract.runQuery(proxyProvider, {
                                        func: func,
                                        args: [erdjs_1.Argument.fromPubkey(bob.address),
                                            erdjs_1.Argument.fromNumber(1),
                                            erdjs_1.Argument.fromNumber(1),
                                            erdjs_1.Argument.fromNumber(10000)]
                                    })];
                            case 3:
                                qResponse = _a.sent();
                                qResponse.assertSuccess();
                                console.log("Size: ", qResponse.returnData.length);
                                return [3 /*break*/, 5];
                            case 4:
                                e_2 = _a.sent();
                                console.log(e_2);
                                return [3 /*break*/, 5];
                            case 5: return [2 /*return*/];
                        }
                    });
                }); };
                getOwnedPixelsColor = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var func, qResponse, e_3;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                func = new erdjs_1.ContractFunction("getOwnedPixelsColor");
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, smartContract.runQuery(proxyProvider, {
                                        func: func,
                                        args: [erdjs_1.Argument.fromPubkey(admin.address),
                                            erdjs_1.Argument.fromNumber(1),
                                            erdjs_1.Argument.fromNumber(1),
                                            erdjs_1.Argument.fromNumber(1000)]
                                    })];
                            case 2:
                                qResponse = _a.sent();
                                qResponse.assertSuccess();
                                console.log("Size: ", qResponse.returnData.length);
                                return [3 /*break*/, 4];
                            case 3:
                                e_3 = _a.sent();
                                console.log(e_3);
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
                                return [4 /*yield*/, admin.sync(proxyProvider)];
                            case 1:
                                _c.sent();
                                sync_then_sign = function (txs) { return __awaiter(void 0, void 0, void 0, function () {
                                    var i;
                                    return __generator(this, function (_a) {
                                        for (i = 0; i < loop; i++) {
                                            txs[i].setNonce(admin.nonce);
                                            adminSigner.sign(txs[i]);
                                            admin.incrementNonce();
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
                createU8VectorArgument = function (from) {
                    var res = [];
                    for (var j = 0; j < from.length; j++) {
                        res[j] = new typesystem_1.U8Value(from[j]);
                    }
                    return res;
                };
                createU32VectorArgument = function (from) {
                    var res = [];
                    for (var j = 0; j < from.length; j++) {
                        res[j] = new typesystem_1.U32Value(from[j]);
                    }
                    return res;
                };
                createU64VectorArgument = function (from) {
                    var res = [];
                    for (var j = 0; j < from.length; j++) {
                        res[j] = new typesystem_1.U64Value(new bignumber_js_1["default"](from[j]));
                    }
                    return res;
                };
                changeBatchPixelColor = function (canvas_id, pixel_ids, r, g, b, loop) { return __awaiter(void 0, void 0, void 0, function () {
                    var pixel_ids_vec, rs, gs, bs, callTransaction, hash, executed;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                pixel_ids_vec = createU64VectorArgument(pixel_ids);
                                rs = createU8VectorArgument(r);
                                gs = createU8VectorArgument(g);
                                bs = createU8VectorArgument(b);
                                console.log("creating tx");
                                callTransaction = smartContract.call({
                                    func: new erdjs_1.ContractFunction("changeBatchPixelColor"),
                                    args: [
                                        erdjs_1.Argument.fromNumber(canvas_id),
                                        erdjs_1.Argument.fromTypedValue(new typesystem_1.Vector(pixel_ids_vec)),
                                        erdjs_1.Argument.fromTypedValue(new typesystem_1.Vector(rs)),
                                        erdjs_1.Argument.fromTypedValue(new typesystem_1.Vector(gs)),
                                        erdjs_1.Argument.fromTypedValue(new typesystem_1.Vector(bs)),
                                    ],
                                    gasLimit: new erdjs_1.GasLimit(Math.min(pixel_ids.length * 50000, 100000000))
                                });
                                return [4 /*yield*/, admin.sync(proxyProvider)];
                            case 1:
                                _a.sent();
                                callTransaction.setNonce(admin.nonce);
                                adminSigner.sign(callTransaction);
                                admin.incrementNonce();
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
                createAuction = function (canvasId, pixelId) { return __awaiter(void 0, void 0, void 0, function () {
                    var callTransaction, hash, executed, e_4;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                callTransaction = smartContract.call({
                                    func: new erdjs_1.ContractFunction("auctionPixel"),
                                    args: [
                                        erdjs_1.Argument.fromNumber(canvasId),
                                        erdjs_1.Argument.fromNumber(pixelId),
                                        erdjs_1.Argument.fromBigInt(new bignumber_js_1["default"](1 * (Math.pow(10, 18)))),
                                        erdjs_1.Argument.fromBigInt(new bignumber_js_1["default"](2 * (Math.pow(10, 18)))),
                                        erdjs_1.Argument.fromNumber(92000),
                                    ],
                                    gasLimit: new erdjs_1.GasLimit(50000000)
                                });
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 7, , 8]);
                                return [4 /*yield*/, admin.sync(proxyProvider)];
                            case 2:
                                _a.sent();
                                callTransaction.setNonce(admin.nonce);
                                return [4 /*yield*/, adminSigner.sign(callTransaction)];
                            case 3:
                                _a.sent();
                                admin.incrementNonce();
                                return [4 /*yield*/, callTransaction.send(proxyProvider)];
                            case 4:
                                hash = _a.sent();
                                return [4 /*yield*/, callTransaction.awaitExecuted(proxyProvider)];
                            case 5:
                                _a.sent();
                                return [4 /*yield*/, proxyProvider.getTransactionStatus(hash)];
                            case 6:
                                executed = _a.sent();
                                console.log(executed);
                                return [3 /*break*/, 8];
                            case 7:
                                e_4 = _a.sent();
                                console.log(e_4);
                                return [3 /*break*/, 8];
                            case 8: return [2 /*return*/];
                        }
                    });
                }); };
                endAuction = function (canvasId, pixelId) { return __awaiter(void 0, void 0, void 0, function () {
                    var callTransaction, hash, executed;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                callTransaction = smartContract.call({
                                    func: new erdjs_1.ContractFunction("endAuction"),
                                    args: [
                                        erdjs_1.Argument.fromNumber(canvasId),
                                        erdjs_1.Argument.fromNumber(pixelId),
                                    ],
                                    gasLimit: new erdjs_1.GasLimit(50000000)
                                });
                                return [4 /*yield*/, admin.sync(proxyProvider)];
                            case 1:
                                _a.sent();
                                callTransaction.setNonce(admin.nonce);
                                adminSigner.sign(callTransaction);
                                admin.incrementNonce();
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
                endAuctionBob = function (canvasId, pixelId) { return __awaiter(void 0, void 0, void 0, function () {
                    var bobJSON, bobSecret, bobWallet, bobAddress, bob, bobSigner, callTransaction, hash, executed;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, readJSON("bob.json")];
                            case 1:
                                bobJSON = _a.sent();
                                bobSecret = erdjs_1.UserWallet.decryptSecretKey(bobJSON, "password");
                                bobWallet = new erdjs_1.UserWallet(bobSecret, "password");
                                bobAddress = new erdjs_1.Address(bobSecret.generatePublicKey().toAddress());
                                bob = new erdjs_1.Account(bobAddress);
                                bobSigner = erdjs_1.UserSigner.fromWallet(bobJSON, "password");
                                callTransaction = smartContract.call({
                                    func: new erdjs_1.ContractFunction("endAuction"),
                                    args: [
                                        erdjs_1.Argument.fromNumber(canvasId),
                                        erdjs_1.Argument.fromNumber(pixelId),
                                    ],
                                    gasLimit: new erdjs_1.GasLimit(50000000)
                                });
                                return [4 /*yield*/, bob.sync(proxyProvider)];
                            case 2:
                                _a.sent();
                                callTransaction.setNonce(bob.nonce);
                                bobSigner.sign(callTransaction);
                                bob.incrementNonce();
                                return [4 /*yield*/, callTransaction.send(proxyProvider)];
                            case 3:
                                hash = _a.sent();
                                return [4 /*yield*/, callTransaction.awaitExecuted(proxyProvider)];
                            case 4:
                                _a.sent();
                                return [4 /*yield*/, proxyProvider.getTransactionStatus(hash)];
                            case 5:
                                executed = _a.sent();
                                console.log(executed);
                                return [2 /*return*/];
                        }
                    });
                }); };
                getAuctions = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var func, qResponse, i, e_5;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                func = new erdjs_1.ContractFunction("getAuctionsActive");
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, smartContract.runQuery(proxyProvider, {
                                        func: func,
                                        args: [
                                            erdjs_1.Argument.fromNumber(1),
                                            erdjs_1.Argument.fromNumber(1),
                                            erdjs_1.Argument.fromNumber(10000)
                                        ]
                                    })];
                            case 2:
                                qResponse = _a.sent();
                                qResponse.assertSuccess();
                                console.log("Size: ", qResponse.returnData.length);
                                for (i = 0; i < qResponse.returnData.length; i++) {
                                    console.log(qResponse.returnData[i].asNumber);
                                }
                                return [3 /*break*/, 4];
                            case 3:
                                e_5 = _a.sent();
                                console.log(e_5);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); };
                bidAuction = function (pixelId, amount) { return __awaiter(void 0, void 0, void 0, function () {
                    var bobJSON, bobSecret, bobWallet, bobAddress, bob, bobSigner, callTransaction, hash, executed;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, readJSON("bob.json")];
                            case 1:
                                bobJSON = _a.sent();
                                bobSecret = erdjs_1.UserWallet.decryptSecretKey(bobJSON, "password");
                                bobWallet = new erdjs_1.UserWallet(bobSecret, "password");
                                bobAddress = new erdjs_1.Address(bobSecret.generatePublicKey().toAddress());
                                bob = new erdjs_1.Account(bobAddress);
                                bobSigner = erdjs_1.UserSigner.fromWallet(bobJSON, "password");
                                callTransaction = smartContract.call({
                                    func: new erdjs_1.ContractFunction("bid"),
                                    args: [
                                        erdjs_1.Argument.fromNumber(1),
                                        erdjs_1.Argument.fromNumber(pixelId),
                                    ],
                                    gasLimit: new erdjs_1.GasLimit(50000000),
                                    value: erdjs_1.Balance.eGLD(amount)
                                });
                                return [4 /*yield*/, bob.sync(proxyProvider)];
                            case 2:
                                _a.sent();
                                callTransaction.setNonce(bob.nonce);
                                bobSigner.sign(callTransaction);
                                bob.incrementNonce();
                                return [4 /*yield*/, callTransaction.send(proxyProvider)];
                            case 3:
                                hash = _a.sent();
                                return [4 /*yield*/, callTransaction.awaitExecuted(proxyProvider)];
                            case 4:
                                _a.sent();
                                return [4 /*yield*/, proxyProvider.getTransactionStatus(hash)];
                            case 5:
                                executed = _a.sent();
                                console.log(executed);
                                return [2 /*return*/];
                        }
                    });
                }); };
                getAuctionStartingPrice = function (pixelId) { return __awaiter(void 0, void 0, void 0, function () {
                    var func, qResponse, i, e_6;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                func = new erdjs_1.ContractFunction("getAuctionStartingPrice");
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, smartContract.runQuery(proxyProvider, {
                                        func: func,
                                        args: [
                                            erdjs_1.Argument.fromNumber(1),
                                            erdjs_1.Argument.fromNumber(pixelId),
                                        ]
                                    })];
                            case 2:
                                qResponse = _a.sent();
                                qResponse.assertSuccess();
                                for (i = 0; i < qResponse.returnData.length; i++) {
                                    console.log(qResponse.returnData[i].asNumber);
                                }
                                return [3 /*break*/, 4];
                            case 3:
                                e_6 = _a.sent();
                                console.log(e_6);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); };
                getAuctionEndingPrice = function (pixelId) { return __awaiter(void 0, void 0, void 0, function () {
                    var func, qResponse, i, e_7;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                func = new erdjs_1.ContractFunction("getAuctionEndingPrice");
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, smartContract.runQuery(proxyProvider, {
                                        func: func,
                                        args: [
                                            erdjs_1.Argument.fromNumber(1),
                                            erdjs_1.Argument.fromNumber(pixelId),
                                        ]
                                    })];
                            case 2:
                                qResponse = _a.sent();
                                qResponse.assertSuccess();
                                for (i = 0; i < qResponse.returnData.length; i++) {
                                    console.log(qResponse.returnData[i].asNumber);
                                }
                                return [3 /*break*/, 4];
                            case 3:
                                e_7 = _a.sent();
                                console.log(e_7);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); };
                getAuctionDeadline = function (pixelId) { return __awaiter(void 0, void 0, void 0, function () {
                    var func, qResponse, i, unix, dateTime, e_8;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                func = new erdjs_1.ContractFunction("getAuctionDeadline");
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, smartContract.runQuery(proxyProvider, {
                                        func: func,
                                        args: [
                                            erdjs_1.Argument.fromNumber(1),
                                            erdjs_1.Argument.fromNumber(pixelId),
                                        ]
                                    })];
                            case 2:
                                qResponse = _a.sent();
                                qResponse.assertSuccess();
                                for (i = 0; i < qResponse.returnData.length; i++) {
                                    unix = qResponse.returnData[i].asNumber;
                                    dateTime = new Date(unix * 1000);
                                    console.log(dateTime.toString());
                                }
                                return [3 /*break*/, 4];
                            case 3:
                                e_8 = _a.sent();
                                console.log(e_8);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); };
                getAuctionOwner = function (pixelId) { return __awaiter(void 0, void 0, void 0, function () {
                    var func, qResponse, i, e_9;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                func = new erdjs_1.ContractFunction("getAuctionOwner");
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, smartContract.runQuery(proxyProvider, {
                                        func: func,
                                        args: [
                                            erdjs_1.Argument.fromNumber(1),
                                            erdjs_1.Argument.fromNumber(pixelId),
                                        ]
                                    })];
                            case 2:
                                qResponse = _a.sent();
                                qResponse.assertSuccess();
                                for (i = 0; i < qResponse.returnData.length; i++) {
                                    console.log(erdjs_1.Address.fromHex(qResponse.returnData[i].asHex).toString());
                                }
                                return [3 /*break*/, 4];
                            case 3:
                                e_9 = _a.sent();
                                console.log(e_9);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); };
                getAuctionCurrentBid = function (pixelId) { return __awaiter(void 0, void 0, void 0, function () {
                    var func, qResponse, i, e_10;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                func = new erdjs_1.ContractFunction("getAuctionCurrentBid");
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, smartContract.runQuery(proxyProvider, {
                                        func: func,
                                        args: [
                                            erdjs_1.Argument.fromNumber(1),
                                            erdjs_1.Argument.fromNumber(pixelId),
                                        ]
                                    })];
                            case 2:
                                qResponse = _a.sent();
                                qResponse.assertSuccess();
                                for (i = 0; i < qResponse.returnData.length; i++) {
                                    console.log(qResponse.returnData[i].asNumber);
                                }
                                return [3 /*break*/, 4];
                            case 3:
                                e_10 = _a.sent();
                                console.log(e_10);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); };
                getAuctionCurrentWinner = function (pixelId) { return __awaiter(void 0, void 0, void 0, function () {
                    var func, qResponse, i, e_11;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                func = new erdjs_1.ContractFunction("getAuctionCurrentWinner");
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, smartContract.runQuery(proxyProvider, {
                                        func: func,
                                        args: [
                                            erdjs_1.Argument.fromNumber(1),
                                            erdjs_1.Argument.fromNumber(pixelId),
                                        ]
                                    })];
                            case 2:
                                qResponse = _a.sent();
                                qResponse.assertSuccess();
                                for (i = 0; i < qResponse.returnData.length; i++) {
                                    console.log(erdjs_1.Address.fromHex(qResponse.returnData[i].asHex).toString());
                                }
                                return [3 /*break*/, 4];
                            case 3:
                                e_11 = _a.sent();
                                console.log(e_11);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); };
                return [4 /*yield*/, createCanvas(100, 100)];
            case 3:
                _a.sent();
                i = 0;
                _a.label = 4;
            case 4:
                if (!(i < 10)) return [3 /*break*/, 8];
                return [4 /*yield*/, mintPixels(5, 200)];
            case 5:
                _a.sent(); //100pixels
                return [4 /*yield*/, getLastValidPixelId()];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7:
                i++;
                return [3 /*break*/, 4];
            case 8: return [4 /*yield*/, getLastValidPixelId()];
            case 9:
                _a.sent();
                // for (let i=0; i< 2000; i++){
                //     await createAuction(1,Math.floor(Math.random()*10000));
                // }
                // await createAuction(1,3);
                // await createAuction(1,4);
                // await bidAuction(4, 1.2);
                // console.log("Pixels owned by bob: ");
                // await getOwnedPixelsBob();
                // await endAuctionBob(1,4);
                // console.log("Pixels owned by bob: ");
                // await getOwnedPixelsBob();
                // console.log('STARTING PRICE');
                // await getAuctionStartingPrice(4);
                // console.log('ENDING PRICE');
                // await getAuctionEndingPrice(4);
                // console.log('DEADLINE');
                // await getAuctionDeadline(4);
                // console.log('OWNER');
                // await getAuctionOwner(4);
                // console.log('CURRENT BID');
                // await getAuctionCurrentBid(4);
                // console.log('CURRENT WINNER');
                // await getAuctionCurrentWinner(4);
                // await createAuction(1,6);
                // await createAuction(1,7);
                // await createAuction(1,21);
                // await getAuctionStartingPrice(15);
                console.log('Active Auction Count: ');
                return [4 /*yield*/, getAuctions()];
            case 10:
                _a.sent();
                return [4 /*yield*/, getOwnedPixels()];
            case 11:
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
