use data_test::*;
use elrond_wasm_debug::*;

fn main() {
	let contract = DataTestImpl::new(TxContext::dummy());
	print!("{}", abi_json::contract_abi(&contract));
}
