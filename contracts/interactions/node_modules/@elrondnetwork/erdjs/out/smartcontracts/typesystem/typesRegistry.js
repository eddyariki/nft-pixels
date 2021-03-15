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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypesRegistry = void 0;
const errors = __importStar(require("../../errors"));
const utils_1 = require("../../utils");
class TypesRegistry {
    static registerType(type) {
        utils_1.guardValueIsSet("type", type);
        utils_1.guardValueIsSet("type.name", type.name);
        if (TypesRegistry.typesByName.has(type.name)) {
            throw new errors.ErrTypingSystem(`Type already registered: ${type.name}`);
        }
        TypesRegistry.typesByName.set(type.name, type);
    }
    static resolveType(typeName) {
        utils_1.guardValueIsSet("typeName", typeName);
        let type = TypesRegistry.typesByName.get(typeName);
        if (!type) {
            throw new errors.ErrTypingSystem(`Cannot resolve type: ${typeName}`);
        }
        return type;
    }
    static findTypes(predicate) {
        let values = Array.from(TypesRegistry.typesByName.values());
        let filtered = values.filter(item => predicate(item));
        return filtered;
    }
}
exports.TypesRegistry = TypesRegistry;
TypesRegistry.typesByName = new Map();
//# sourceMappingURL=typesRegistry.js.map