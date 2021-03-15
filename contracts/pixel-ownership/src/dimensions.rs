use elrond_wasm::api::BigUintApi;
elrond_wasm::derive_imports!();

#[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi)]
pub struct Dimensions<BigUint: BigUintApi> {
    pub width: BigUint,
    pub height: BigUint
}
