use pixel_ownership::*;
use elrond_wasm_debug::*;

fn main() {
	let contract = PixelOwnershipImpl::new(TxContext::dummy());
	print!("{}", abi_json::contract_abi(&contract));
}
