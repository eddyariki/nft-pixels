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
exports.StructureFieldDefinition = exports.StructureDefinition = exports.StructureField = exports.Structure = exports.StructureType = void 0;
const errors = __importStar(require("../../errors"));
const typeDescriptor_1 = require("./typeDescriptor");
const types_1 = require("./types");
class StructureType extends types_1.Type {
    constructor(definition) {
        super(definition.name);
        this.definition = definition;
    }
}
exports.StructureType = StructureType;
// TODO: implement setField(), convenience method.
// TODO: Hold fields in a map (by name), and use the order within "field definitions" to perform codec operations.
class Structure extends types_1.TypedValue {
    /**
     * Currently, one can only set fields at initialization time. Construction will be improved at a later time.
     */
    constructor(type, fields) {
        super();
        this.fields = [];
        this.type = type;
        this.fields = fields;
        this.checkTyping();
    }
    checkTyping() {
        let fields = this.fields;
        let definitions = this.type.definition.fields;
        if (fields.length != definitions.length) {
            throw new errors.ErrStructureTyping("fields length vs. field definitions length");
        }
        for (let i = 0; i < fields.length; i++) {
            let field = fields[i];
            let definition = definitions[i];
            let fieldType = field.value.getType();
            let definitionType = definition.getTypeDescriptor().getOutmostType();
            if (!fieldType.equals(definitionType)) {
                throw new errors.ErrStructureTyping(`check type of field "${definition.name}"`);
            }
            if (field.name != definition.name) {
                throw new errors.ErrStructureTyping(`check name of field "${definition.name}"`);
            }
        }
    }
    getFields() {
        return this.fields;
    }
    valueOf() {
        let result = {};
        for (const field of this.fields) {
            result[field.name] = field.value.valueOf();
        }
        return result;
    }
    equals(other) {
        if (!this.type.equals(other.type)) {
            return false;
        }
        let selfFields = this.getFields();
        let otherFields = other.getFields();
        if (selfFields.length != otherFields.length) {
            return false;
        }
        for (let i = 0; i < selfFields.length; i++) {
            let selfField = selfFields[i];
            let otherField = otherFields[i];
            if (!selfField.equals(otherField)) {
                return false;
            }
        }
        return true;
    }
    getType() {
        return this.type;
    }
}
exports.Structure = Structure;
class StructureField {
    constructor(value, name = "") {
        this.value = value;
        this.name = name;
    }
    equals(other) {
        return this.name == other.name && this.value.equals(other.value);
    }
}
exports.StructureField = StructureField;
class StructureDefinition {
    constructor(name, fields) {
        this.fields = [];
        this.name = name;
        this.fields = fields || [];
    }
    static fromJSON(json) {
        let fields = json.fields.map(field => StructureFieldDefinition.fromJSON(field));
        return new StructureDefinition(json.name, fields);
    }
}
exports.StructureDefinition = StructureDefinition;
class StructureFieldDefinition {
    constructor(name, description, type) {
        this.name = name;
        this.description = description;
        this.scopedTypeNames = type;
    }
    static fromJSON(json) {
        return new StructureFieldDefinition(json.name, json.description, json.type);
    }
    getTypeDescriptor() {
        return typeDescriptor_1.TypeDescriptor.createFromTypeNames(this.scopedTypeNames);
    }
}
exports.StructureFieldDefinition = StructureFieldDefinition;
//# sourceMappingURL=structure.js.map