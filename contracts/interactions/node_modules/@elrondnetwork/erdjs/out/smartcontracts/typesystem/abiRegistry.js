"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbiRegistry = void 0;
const utils_1 = require("../../utils");
const namespace_1 = require("./namespace");
const structure_1 = require("./structure");
/**
 * Contract ABIs aren't yet fully implemented. This is just a prototype.
 * A future release of `erdjs` will handle ABIs properly.
 */
class AbiRegistry {
    constructor() {
        this.namespaces = [];
    }
    extend(json) {
        for (let item of json.namespaces || []) {
            this.namespaces.push(namespace_1.Namespace.fromJSON(item));
        }
        this.registerStructures();
    }
    registerStructures() {
        for (const namespace of this.namespaces) {
            for (const definition of namespace.structures) {
                new structure_1.StructureType(definition);
            }
        }
    }
    findNamespace(namespace) {
        let result = this.namespaces.find(e => e.namespace == namespace);
        utils_1.guardValueIsSet("result", result);
        return result;
    }
}
exports.AbiRegistry = AbiRegistry;
//# sourceMappingURL=abiRegistry.js.map