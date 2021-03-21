elrond_wasm::derive_imports!();

use elrond_wasm::api::BigUintApi;
use elrond_wasm::types::Address;

// Reference: 
//https://github.com/ElrondNetwork/elrond-wasm-rs/blob/master/contracts/examples/crypto-kitties/kitty-auction/src/auction.rs

#[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi)]
pub struct Auction<BigUint: BigUintApi>  {
    pub starting_price: BigUint,
    pub ending_price: BigUint,
    pub deadline: u64,
    pub pixel_owner: Address,
    pub current_bid: BigUint,
    pub current_winner: Address
}

impl<BigUint: BigUintApi> Auction<BigUint> {
	pub fn new(
		starting_price: &BigUint,
		ending_price: &BigUint,
		deadline: &u64,
		pixel_owner: &Address,
	) -> Self {
		Auction {
			starting_price: starting_price.clone(),
			ending_price: ending_price.clone(),
			deadline: deadline.clone(),
			pixel_owner: pixel_owner.clone(),
			current_bid: BigUint::zero(),
			current_winner: Address::zero(),
		}
	}
}