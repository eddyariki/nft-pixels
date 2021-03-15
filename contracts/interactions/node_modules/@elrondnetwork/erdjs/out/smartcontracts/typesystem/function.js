"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionParameterDefinition = exports.FunctionDefinition = void 0;
const typeDescriptor_1 = require("./typeDescriptor");
class FunctionDefinition {
    constructor(name, input, output) {
        this.input = [];
        this.output = [];
        this.name = name;
        this.input = input || [];
        this.output = output || [];
    }
    static fromJSON(json) {
        let input = json.input.map(param => FunctionParameterDefinition.fromJSON(param));
        let output = json.output.map(param => FunctionParameterDefinition.fromJSON(param));
        return new FunctionDefinition(json.name, input, output);
    }
}
exports.FunctionDefinition = FunctionDefinition;
class FunctionParameterDefinition {
    constructor(name, description, type) {
        this.name = name;
        this.description = description;
        this.scopedTypeNames = type;
    }
    static fromJSON(json) {
        return new FunctionParameterDefinition(json.name, json.description, json.type);
    }
    getTypeDescriptor() {
        return typeDescriptor_1.TypeDescriptor.createFromTypeNames(this.scopedTypeNames);
    }
}
exports.FunctionParameterDefinition = FunctionParameterDefinition;
//# sourceMappingURL=function.js.map