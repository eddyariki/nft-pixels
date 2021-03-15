#![no_std]


elrond_wasm::imports!();
elrond_wasm::derive_imports!();

#[elrond_wasm_derive::contract(DataTestImpl)]
pub trait DataTest {
	
	#[init]
	fn init(&self) {}

	#[view(getListBigUint)]
	fn get_list_biguint(&self)->SCResult<[BigUint;4]>{
		let one = BigUint::from(1u32);
		let two = BigUint::from(2u32);
		let three = BigUint::from(5u32);
		let four = BigUint::from(200u32);
		Ok([one, two, three, four])

	}

	#[view(getVectorBigUint)]
	fn get_vector_biguint(&self) -> MultiResultVec<BigUint>{
		let mut v = Vec::new();
		let one = BigUint::from(1u32);
		let two = BigUint::from(1u32);
		let seventytwo = BigUint::from(72u32);
		let onethousand = BigUint::from(1000u32);
		v.push(one);
		v.push(two);
		v.push(seventytwo);
		v.push(onethousand);
		v.into()
	}

	#[view(getBoolean)]
	fn get_boolean(&self)->bool{
		true
	}
}