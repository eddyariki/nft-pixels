import { Type } from "./types";
export declare class TypesRegistry {
    private static typesByName;
    static registerType(type: Type): void;
    static resolveType(typeName: string): Type;
    static findTypes(predicate: (type: Type) => boolean): Type[];
}
