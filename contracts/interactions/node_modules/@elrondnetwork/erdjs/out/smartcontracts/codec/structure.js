"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructureBinaryCodec = void 0;
const typesystem_1 = require("../typesystem");
class StructureBinaryCodec {
    constructor(parentCodec) {
        this.parentCodec = parentCodec;
    }
    decodeTopLevel(buffer, type) {
        let [decoded, length] = this.decodeNested(buffer, type);
        return decoded;
    }
    decodeNested(buffer, type) {
        let originalBuffer = buffer;
        let offset = 0;
        let fieldDefinitions = type.definition.fields;
        let fields = [];
        for (const fieldDefinition of fieldDefinitions) {
            let [decoded, decodedLength] = this.parentCodec.decodeNested(buffer, fieldDefinition.getTypeDescriptor());
            let field = new typesystem_1.StructureField(decoded, fieldDefinition.name);
            fields.push(field);
            offset += decodedLength;
            buffer = originalBuffer.slice(offset);
        }
        let structure = new typesystem_1.Structure(type, fields);
        return [structure, offset];
    }
    encodeNested(structure) {
        let buffers = [];
        let fields = structure.getFields();
        for (const field of fields) {
            let fieldBuffer = this.parentCodec.encodeNested(field.value);
            buffers.push(fieldBuffer);
        }
        let buffer = Buffer.concat(buffers);
        return buffer;
    }
    encodeTopLevel(structure) {
        return this.encodeNested(structure);
    }
}
exports.StructureBinaryCodec = StructureBinaryCodec;
//# sourceMappingURL=structure.js.map