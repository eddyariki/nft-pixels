"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Namespace = void 0;
const utils_1 = require("../../utils");
const function_1 = require("./function");
const structure_1 = require("./structure");
/**
 * A namespace contains ABI definitions (function signatures and structure layouts) for one or more Smart Contracts.
 * In the simplest case, a namespace contains ABI definitions for a single contract.
 *
 * For components reused across multiple contracts - say, framework-level base classes or commonly-used structures,
 * a namespace serves as a way to capture the commonality (for the purpose of reducing duplication within ABI definitions).
 */
class Namespace {
    constructor(namespace, functions, structures) {
        this.functions = [];
        this.structures = [];
        this.namespace = namespace;
        this.functions = functions;
        this.structures = structures;
    }
    static fromJSON(json) {
        let functions = json.functions.map(item => function_1.FunctionDefinition.fromJSON(item));
        let structures = json.structures.map(item => structure_1.StructureDefinition.fromJSON(item));
        return new Namespace(json.namespace, functions, structures);
    }
    findFunction(functionName) {
        let result = this.functions.find(e => e.name == functionName);
        utils_1.guardValueIsSet("result", result);
        return result;
    }
}
exports.Namespace = Namespace;
//# sourceMappingURL=namespace.js.map