#![no_std]

elrond_wasm::imports!();
elrond_wasm::derive_imports!();

#[elrond_wasm_derive::contract(DataTestImpl)]
pub trait DataTest {
	
	#[init]
	fn init(&self) {}

	// #[view(getListBigUint)]
	// fn get_list_biguint(&self)->SCResult<[BigUint;2]>{
	// 	let one = BigUint::from(1u32);
	// 	let two = BigUint::from(2u32);
	// 	Ok([one, two])

	// }

	// #[view(getVectorBigUint)]
	// fn get_vector_biguint(&self) -> Vec<BigUint>{
	// 	let mut v = Vec::new();
	// 	let one = BigUint::from(1u32);
	// 	let two = BigUint::from(1u32);
	// 	let seventytwo = BigUint::from(72u32);
	// 	let onehundred = BigUint::from(100u32);
	// 	v.push(one);
	// 	v.push(two);
	// 	v.push(seventytwo);
	// 	v.push(onehundred);
	// 	v
	// }

	// #[view(getBoolean)]
	// fn get_boolean(&self)->bool{
	// 	true
	// }
}
