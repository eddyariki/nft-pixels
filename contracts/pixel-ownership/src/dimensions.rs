elrond_wasm::derive_imports!();

#[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi)]
pub struct Dimensions  {
    pub width: u32,
    pub height: u32
}
