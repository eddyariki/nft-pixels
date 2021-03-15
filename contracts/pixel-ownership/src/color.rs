elrond_wasm::derive_imports!();


#[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi)]
pub struct Color {
    pub r: u8,
    pub g: u8,
    pub b: u8
}



impl Default for Color {
    fn default() -> Self {
        Color {
            r: 120,
            g: 0,
            b: 89
        }
    }
}

