import { Namespace } from "./namespace";
/**
 * Contract ABIs aren't yet fully implemented. This is just a prototype.
 * A future release of `erdjs` will handle ABIs properly.
 */
export declare class AbiRegistry {
    readonly namespaces: Namespace[];
    extend(json: any): void;
    private registerStructures;
    findNamespace(namespace: string): Namespace;
}
