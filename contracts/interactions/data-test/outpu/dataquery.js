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
var address = "erd1qqqqqqqqqqqqqpgqfzydqmdw7m2vazsp6u5p95yxz76t2p9rd8ss0zp9ts";
// #[view(getListBigUint)]
// 	fn get_list_biguint(&self)->SCResult<[BigUint;2]>{
// 		let one = BigUint::from(1u32);
// 		let two = BigUint::from(2u32);
// 		Ok([one, two])
// 	}
// 	#[view(getVectorBigUint)]
// 	fn get_vector_biguint(&self) -> Vec<BigUint>{
// 		let mut v = Vec::new();
// 		let one = BigUint::from(1u32);
// 		let two = BigUint::from(1u32);
// 		let seventytwo = BigUint::from(72u32);
// 		let onehundred = BigUint::from(100u32);
// 		v.push(one);
// 		v.push(two);
// 		v.push(seventytwo);
// 		v.push(onehundred);
// 		v
// 	}
// 	#[view(getBoolean)]
// 	fn get_boolean(&self)->bool{
// 		true
// 	}
var extractValues = function (array) {
    var values = [];
    for (var i = 4; i < array.length; i += 5) {
        values.push(array[i]);
    }
    return values;
};
var query = function () { return __awaiter(void 0, void 0, void 0, function () {
    var proxyProvider, smartContractAddress, smartContract, getListBigUint, getVectorBigUint, getBool;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                proxyProvider = new erdjs_1.ProxyProvider(config_1.LOCAL_PROXY);
                smartContractAddress = new erdjs_1.Address(address);
                smartContract = new erdjs_1.SmartContract({ address: smartContractAddress });
                getListBigUint = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var func, qResponse, uint32array, values;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                func = new erdjs_1.ContractFunction("getListBigUint");
                                return [4 /*yield*/, smartContract.runQuery(proxyProvider, { func: func })];
                            case 1:
                                qResponse = _a.sent();
                                qResponse.assertSuccess();
                                console.log("Elements: ", qResponse.firstResult().asBuffer.length / 4);
                                console.log(qResponse);
                                uint32array = new Uint32Array(qResponse.firstResult().asBuffer);
                                values = extractValues(uint32array);
                                console.log(values);
                                return [2 /*return*/];
                        }
                    });
                }); };
                getVectorBigUint = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var func, qResponse, returnData, i;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                func = new erdjs_1.ContractFunction("getVectorBigUint");
                                return [4 /*yield*/, smartContract.runQuery(proxyProvider, { func: func })];
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
                return [4 /*yield*/, getVectorBigUint()];
            case 1:
                _a.sent();
                getBool = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var func, qResponse;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                func = new erdjs_1.ContractFunction("getBoolean");
                                return [4 /*yield*/, smartContract.runQuery(proxyProvider, { func: func })];
                            case 1:
                                qResponse = _a.sent();
                                qResponse.assertSuccess();
                                console.log("Elements: ", qResponse.firstResult().asBuffer.length / 4);
                                console.log(qResponse.firstResult());
                                return [2 /*return*/];
                        }
                    });
                }); };
                return [2 /*return*/];
        }
    });
}); };
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, query()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
