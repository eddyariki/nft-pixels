/// <reference types="node" />
import { PathLike } from "fs";
import { ProxyProvider } from "../proxyProvider";
import { Code } from "../smartcontracts/code";
export declare function getDevnetProvider(): ProxyProvider;
export declare function getTestnetProvider(): ProxyProvider;
export declare function getMainnetProvider(): ProxyProvider;
export declare function loadContractCode(path: PathLike): Promise<Code>;
