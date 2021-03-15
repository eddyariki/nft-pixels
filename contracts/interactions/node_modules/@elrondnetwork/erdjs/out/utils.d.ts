export declare const HASH_LENGTH = 32;
export declare const ADDRESS_LENGTH = 32;
export declare const SEED_STRING_LENGTH = 64;
export declare const CODE_HASH_LENGTH = 32;
export declare const VMTYPES: string[];
export declare function guardType(name: string, type: any, value?: any, allowUndefined?: boolean): void;
export declare function guardValueIsSet(name: string, value?: any | null | undefined): void;
export declare function guardSameLength(a: any[], b: any[]): void;
export declare function guardLength(withLength: {
    length?: number;
}, expectedLength: number): void;
