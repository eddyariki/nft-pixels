#![no_std]
#![allow(non_snake_case)]

elrond_wasm::imports!();
elrond_wasm::derive_imports!();

mod color;
mod dimensions;

use color::*;
use dimensions::*;

#[elrond_wasm_derive::contract(PixelOwnershipImpl)]
pub trait PixelOwnership {
	#[init]
	fn init(&self){
		let my_address: Address = self.get_caller();
		self.set_owner(&my_address);
	}

	
}
