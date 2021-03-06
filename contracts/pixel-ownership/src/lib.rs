#![no_std]
#![allow(non_snake_case)]

elrond_wasm::imports!();
elrond_wasm::derive_imports!();

mod color;
mod dimensions;
mod auction;

use color::*;
use dimensions::*;
use auction::*;

#[elrond_wasm_derive::contract(PixelOwnershipImpl)]
pub trait PixelOwnership {
	#[init]
	fn init(&self){
		let my_address: Address = self.get_caller();
		self.set_owner(&my_address);
	}

	//Admin only

	#[endpoint(createCanvas)]
	fn create_canvas(&self, width:u32, height: u32)->SCResult<u32>{
		let caller = self.get_caller();
		require!(caller == self.get_owner(), "Only owners can create new canvases!");
		require!(width<=10000u32, "Width is too large!");
		require!(height<=10000u32, "Height is too large!");

		let total_supply = u64::from(&width * &height);
		let canvas_id;
		if self.is_empty_last_valid_canvas_id(){
			canvas_id = 1u32;
		}else{
			canvas_id = self.get_last_valid_canvas_id() + 1u32;
		}

		self.set_canvas_creator(&canvas_id, &caller);

		let dimensions = Dimensions { 
			width,
			height
		};
		self.set_last_valid_canvas_id(&canvas_id);
		self.set_canvas_dimensions(&canvas_id,&dimensions);
		self.set_total_pixel_supply_of_canvas(&canvas_id, &total_supply);
		self.set_last_valid_pixel_id(&canvas_id, &0u64);

		Ok(canvas_id)
	}	

	#[endpoint(mintPixels)]
	fn mint_pixels(&self, canvas_id: u32, amount: u64) -> SCResult<()>{
		let caller = self.get_caller();
		require!(caller == self.get_owner(), "Only owners can mint pixels");

		let last_canvas_id = self.get_last_valid_canvas_id();
		require!(canvas_id<=last_canvas_id, "Canvas Id does not exist!");
		require!(canvas_id>0 , "Canvas Id does not exist!");

		let total_pixel_supply = self.get_total_pixel_supply_of_canvas(&canvas_id);
		let last_valid_pixel_id = self._get_last_valid_pixel_id(&canvas_id);
		require!(last_valid_pixel_id < total_pixel_supply, "Cannot print beyond total pixel supply of this canvas!");


		let mut end = last_valid_pixel_id.clone() + amount.clone();  //5

		if end>=total_pixel_supply{
			end = total_pixel_supply.clone();
		}

		let mut pixel_id = last_valid_pixel_id.clone() + 1u64.clone(); //1

		while &pixel_id <= &end{

			self.set_pixel_owner(&canvas_id, &pixel_id, &caller);//5
			//owner: &Address, canvas_id: &u32, pixel_id: &u64, owned: &bool) {
			// self._set_pixel_ownership(&caller, &canvas_id, &pixel_id, &true);
			let mut r = 0u8;
			let mut g = 0u8;
			let mut b = 0u8;
			if &pixel_id<=&2500u64{
				r = 25u8;
				g = 255u8;
				b = 55u8;
			}else if &pixel_id<=&5000u64{
				r = 255u8;
				g = 55u8;
				b = 55u8;
			}else if &pixel_id<=&7500u64{
				r = 55u8;
				g = 55u8;
				b = 255u8;
			}else{
				r = 5u8;
				g = 255u8;
				b = 255u8;
			}
			let color = Color{r,g,b};
			self.set_pixel_color(&canvas_id,&pixel_id, &color);//5
			pixel_id+=1u64.clone();
		}//6

		self.set_last_valid_pixel_id(&canvas_id,&end);

		Ok(())
	}
	//Pixel Owner Only
	#[endpoint(changePixelColor)]
	fn change_pixel_color(&self, canvas_id: u32, pixel_id:u64, r:u8,g:u8,b:u8) -> SCResult<Color>{

		let last_canvas_id = self.get_last_valid_canvas_id();
		require!(canvas_id<=last_canvas_id, "Canvas Id does not exist!");
		require!(canvas_id>0 , "Canvas Id does not exist!");

		let last_valid_pixel_id = self._get_last_valid_pixel_id(&canvas_id);
		require!(pixel_id<=last_valid_pixel_id, "Pixel does not exist! ");
		require!(pixel_id>0, "Pixel does not exist!");
		
		let caller = self.get_caller();
		let pixel_owner = self.get_pixel_owner(&canvas_id, &pixel_id);
		require!(pixel_owner == caller, "Only pixel owners can change the color!");
		// let pixel_ownership_mapper = self.get_pixel_ownership_mapper(&caller, &canvas_id);

		// require!(pixel_ownership_mapper.get(&pixel_id).unwrap_or_else(||false), "Only pixel owners can change the color!");
		
		let new_color = Color{r,g,b};

		self.set_pixel_color(&canvas_id, &pixel_id, &new_color);
		
		Ok(new_color)
	}

	#[endpoint(changeBatchPixelColor)]
	fn change_batch_pixel_color(&self, canvas_id: u32, pixel_ids:&[u64], r: &[u8], g: &[u8], b: &[u8])->SCResult<()>{
		let last_canvas_id = self.get_last_valid_canvas_id();
		require!(canvas_id<=last_canvas_id, "Canvas Id does not exist!");
		require!(canvas_id>0 , "Canvas Id does not exist!");
		let caller = self.get_caller();
		let last_valid_pixel_id = self._get_last_valid_pixel_id(&canvas_id);

		for (((pixel_id,&r),&g),&b) in pixel_ids.iter().zip(r.iter()).zip(g.iter()).zip(b.iter()){
			require!(pixel_id<=&last_valid_pixel_id, "Pixel does not exist! ");
			require!(pixel_id>&0, "Pixel does not exist!");
			let pixel_owner = self.get_pixel_owner(&canvas_id, &pixel_id);
			require!(pixel_owner == caller, "Only pixel owners can change the color!");
			let new_color = Color{r,g,b};
			self.set_pixel_color(&canvas_id, &pixel_id, &new_color);
		}
		Ok(())
	}



	#[endpoint(auctionPixel)]
	fn auction_pixel(&self, canvas_id:u32, pixel_id:u64, starting_price:BigUint, ending_price:BigUint, deadline:u64)->SCResult<Auction<BigUint>>{

		let last_canvas_id = self.get_last_valid_canvas_id();
		require!(canvas_id<=last_canvas_id, "Canvas Id does not exist!");
		require!(canvas_id>0 , "Canvas Id does not exist!");

		let last_valid_pixel_id = self._get_last_valid_pixel_id(&canvas_id);
		require!(pixel_id<=last_valid_pixel_id, "Pixel does not exist! ");
		require!(pixel_id>0, "Pixel does not exist!");
		
		let caller = self.get_caller();
		let pixel_owner = self.get_pixel_owner(&canvas_id, &pixel_id);
		require!(pixel_owner == caller, "Only pixel owners can auction their pixels");

		require!(starting_price<ending_price, "End Price must be smaller than Start Price");

		require!(deadline>=600u64, "Deadline must be more than 10 minutes in the future.");

		let deadline_from_now = deadline.clone() + self.get_block_timestamp();
		let auction = Auction::new(
			&starting_price,
			&ending_price,
			&deadline_from_now,
			&caller,
		);
		self.set_pixel_owner(&canvas_id, &pixel_id, &self.get_sc_address());

		self.set_auction(&canvas_id, &pixel_id, &auction);

		Ok(auction)
	}

	#[endpoint(endAuction)]
	fn end_auction(&self, canvas_id: u32, pixel_id: u64)->SCResult<()>{
		let last_canvas_id = self.get_last_valid_canvas_id();
		require!(canvas_id<=last_canvas_id, "Canvas Id does not exist!");
		require!(canvas_id>0 , "Canvas Id does not exist!");

		let last_valid_pixel_id = self._get_last_valid_pixel_id(&canvas_id);
		require!(pixel_id<=last_valid_pixel_id, "Pixel does not exist! ");
		require!(pixel_id>0, "Pixel does not exist!");
		
		require!(!self.is_empty_auction(&canvas_id, &pixel_id), "Auction does not exist!");

		let auction = self.get_auction(&canvas_id, &pixel_id);
		let current_winner = auction.current_winner;
		let current_bid = auction.current_bid;
		let pixel_owner = auction.pixel_owner;

		let caller = self.get_caller();
		let deadline = auction.deadline;
		let current_timestamp = self.get_block_timestamp();
		if caller == pixel_owner{
			self._end_auction(canvas_id, pixel_id, current_winner,current_bid, pixel_owner);
			return Ok(())
		}
		//auction ended
		if deadline < current_timestamp {
			require!(caller == current_winner, "Winners can only end the auction after the deadline!");
			if current_winner == caller{
				self._end_auction(canvas_id, pixel_id, current_winner, current_bid, pixel_owner);
				return Ok(())
			}
		}
		require!(caller == pixel_owner, "Only the pixel owner can end the auction before deadline!");
		Ok(())
	}

	//Payable
	#[payable("EGLD")]
	#[endpoint]
	fn bid(&self, canvas_id: u32, pixel_id: u64, #[payment] payment: BigUint) -> SCResult<()>{
		let last_canvas_id = self.get_last_valid_canvas_id();
		require!(canvas_id<=last_canvas_id, "Canvas Id does not exist!");
		require!(canvas_id>0 , "Canvas Id does not exist!");

		let last_valid_pixel_id = self._get_last_valid_pixel_id(&canvas_id);
		require!(pixel_id<=last_valid_pixel_id, "Pixel does not exist! ");
		require!(pixel_id>0, "Pixel does not exist!");
		
		require!(!self.is_empty_auction(&canvas_id, &pixel_id), "Auction does not exist!");
		
		let caller = self.get_caller();
		require!(caller != self._get_auction_pixel_owner(&canvas_id, &pixel_id), "Auction pixel owners cannot bid!");

		let mut auction = self.get_auction(&canvas_id, &pixel_id);

		require!(self.get_block_timestamp() < auction.deadline, "Auction ended already!");

		require!(payment >= auction.starting_price,"Bid amount must be higher than or equal to starting price!");

		require!(payment > auction.current_bid,"Bid amount must be higher than current winning bid!");

		require!(payment <= auction.ending_price,"Bid amount must be less than or equal to ending price!");

		// refund losing bid
		if auction.current_winner != Address::zero() {
			self.send()
				.direct_egld(&auction.current_winner, &auction.current_bid, b"bid refund");
		}

		if auction.ending_price == payment{
			//Payment is exact ending_price -> Ends auction
			let prev_pixel_owner = self._get_auction_pixel_owner(&canvas_id, &pixel_id);
			//transfers ownership, ends auction, and pays to previous pixel owner
			self._end_auction(canvas_id,pixel_id, caller, payment, prev_pixel_owner);
		}else{
			//Payment is bigger than bid but lower than ending_price
			auction.current_bid = payment;
			auction.current_winner = caller;

			self.set_auction(&canvas_id, &pixel_id, &auction);
		}
		Ok(())
	} 


	//Private 

	fn _get_auction_pixel_owner(&self, canvas_id: &u32, pixel_id:&u64)->Address{
		let auction = self.get_auction(&canvas_id, &pixel_id);
		auction.pixel_owner
	}

	fn _get_auction_winner(&self, canvas_id: &u32, pixel_id:&u64)->Address{
		let auction = self.get_auction(&canvas_id, &pixel_id);
		auction.current_winner
	}

	fn _end_auction(&self, canvas_id:u32, pixel_id:u64, current_winner: Address, current_bid: BigUint, prev_pixel_owner: Address){
		if current_bid == BigUint::zero() || current_winner  == Address::zero(){
			//No bids, pixel transfered back to owner
			self.clear_auction(&canvas_id, &pixel_id);
			self.set_pixel_owner(&canvas_id, &pixel_id, &prev_pixel_owner);
		}else{
			//Bidder, current bid sent to winner, pixel ownership transferred, and auction cleared
			self.send().direct_egld(
				&prev_pixel_owner,
				&current_bid,
				b"sold pixel"
			)	;
			self.clear_auction(&canvas_id, &pixel_id);
			self.set_pixel_owner(&canvas_id, &pixel_id, &current_winner);
		}
	}

	fn _get_last_valid_pixel_id(&self,canvas_id: &u32)->u64{
		if self.is_empty_last_valid_pixel_id(&canvas_id){
			return 0u64
		}else{
			return self.get_last_valid_pixel_id(&canvas_id)
		}
	}

	// address -> canvas_id -> pixel -> bool
	// #[view(balanceOf)]
	// fn balance_of(&self, owner: &Address, type_id: &u32, pixel_id: &u64) -> bool {
	// 	let pixel_ownership = self.get_balance_mapper(&owner, &canvas_id);
	// 	return pixel_ownership
	// }

	// returns id of pixels address owns
	// #[view(getOwnedPixels)]
	// fn get_owned_pixels(
	// 	&self,
	// 	owner: &Address,
	// 	canvas_id: &u32,
	// ) -> MultiResultVec<u64> {

	// 	let mut owned_pixel_vec = Vec::new();

	// 	let pixel_ownership_mapper = self.get_pixel_ownership_mapper(&owner, &canvas_id);

	// 	for (pixel_id, is_owner) in pixel_ownership_mapper.iter(){
	// 		if is_owner{
	// 			owned_pixel_vec.push(pixel_id);
	// 		}
	// 	}

	// 	owned_pixel_vec.into()
	// }

	//pixel_id is unique so it is 0 or 1

	fn _set_pixel_ownership(&self, owner: &Address, canvas_id: &u32, pixel_id: &u64, owned: &bool) {
		let mut pixel_ownership_mapper = self.get_pixel_ownership_mapper(owner, &canvas_id);
		pixel_ownership_mapper.insert(pixel_id.clone(), owned.clone());
	}


	//Views

	#[storage_mapper("pixelOwnership")]
	fn get_pixel_ownership_mapper(&self, owner: &Address, canvas_id: &u32) -> MapMapper<Self::Storage, u64, bool>;

	#[view(getOwner)]
	#[storage_get("owner")]
	fn get_owner(&self)-> Address;

	#[view(getCanvas)]
	fn get_canvas(
		&self,
		canvas_id: &u32,
		from:&u64,
		up_to: &u64
	)->MultiResultVec<u8>{
		
		// let total_pixels = self.get_total_pixel_supply_of_canvas(&canvas_id);
		let last_valid_pixel_id = self._get_last_valid_pixel_id(&canvas_id);
		let mut end = last_valid_pixel_id.clone();
		if up_to < &last_valid_pixel_id{
			end = up_to.clone();
		}
		let mut pixel_id = from.clone();

		let mut pixels = Vec::new();

		while &pixel_id <= &end {
			let color = self.get_pixel_color(&canvas_id, &pixel_id);
			pixels.push(color.r);
			pixels.push(color.g);
			pixels.push(color.b);
			pixel_id +=1u64;
		}
		pixels.into()
	}

	#[view(getAuctionsActive)]
	fn get_auctions_active(
		&self,
		canvas_id: &u32,
		from:&u64,
		up_to: &u64
	)->MultiResultVec<u64>{
		
		// let total_pixels = self.get_total_pixel_supply_of_canvas(&canvas_id);
		let last_valid_pixel_id = self._get_last_valid_pixel_id(&canvas_id);
		let mut end = last_valid_pixel_id.clone();
		if up_to < &last_valid_pixel_id{
			end = up_to.clone();
		}
		let mut pixel_id = from.clone();

		let mut pixels = Vec::new();

		while &pixel_id <= &end {
			if !self.is_empty_auction(&canvas_id, &pixel_id){
				let auction = self.get_auction(&canvas_id, &pixel_id);
				if auction.deadline>=self.get_block_timestamp(){
					pixels.push(pixel_id);
				}
				
			}
			pixel_id +=1u64;
		}
		pixels.into()
	}
	

	#[view(getOwnedPixels)]
	fn get_owned_pixels(
		&self,
     address: Address,
		canvas_id: &u32,
		from:&u64,
		up_to: &u64
	)->MultiResultVec<u64>{
		
		// let total_pixels = self.get_total_pixel_supply_of_canvas(&canvas_id);
		let last_valid_pixel_id = self._get_last_valid_pixel_id(&canvas_id);
		let mut end = last_valid_pixel_id.clone();
		if up_to < &last_valid_pixel_id{
			end = up_to.clone();
		}
		let mut pixel_id = from.clone();

		let mut pixels = Vec::new();

		while &pixel_id <= &end {
			let id = self.get_pixel_owner(&canvas_id, &pixel_id);
			if id == address{
				pixels.push(pixel_id);
			}
			
			pixel_id +=1u64;
		}
		pixels.into()
	}

	#[view(getOwnedPixelsColor)]
	fn get_owned_pixels_color(
		&self,
     	address: Address,
		canvas_id: &u32,
		from:&u64,
		up_to: &u64
	)->MultiResultVec<u8>{
		
		// let total_pixels = self.get_total_pixel_supply_of_canvas(&canvas_id);
		let last_valid_pixel_id = self._get_last_valid_pixel_id(&canvas_id);
		let mut end = last_valid_pixel_id.clone();
		if up_to < &last_valid_pixel_id{
			end = up_to.clone();
		}
		let mut pixel_id = from.clone();

		let mut pixels = Vec::new();

		while &pixel_id <= &end {
			let id = self.get_pixel_owner(&canvas_id, &pixel_id);
			if id == address{
				let color = self.get_pixel_color(&canvas_id, &pixel_id);
				pixels.push(color.r);
				pixels.push(color.g);
				pixels.push(color.b);
			}
			
			pixel_id +=1u64;
		}
		pixels.into()
	}

	#[view(getColorsByPixelIds)]
	fn get_colors_by_pixel_ids(
		&self,
		canvas_id: &u32,
		pixel_ids: &[u64]
	)->MultiResultVec<u8>{
		let mut pixels = Vec::new();
		for pixel_id in pixel_ids.iter(){
			let color = self.get_pixel_color(&canvas_id, &pixel_id);
			pixels.push(color.r);
			pixels.push(color.g);
			pixels.push(color.b);
		}
		pixels.into()
	}

	#[view(getAuctionStartingPrice)]
	fn get_auction_starting_price(
		&self,
		canvas_id: &u32,
		pixel_id: &u64
	)->BigUint{
		let auction = self.get_auction(&canvas_id, &pixel_id);
		auction.starting_price
	}
	#[view(getAuctionEndingPrice)]
	fn get_auction_ending_price(
		&self,
		canvas_id: &u32,
		pixel_id: &u64
	)->BigUint{
		let auction = self.get_auction(&canvas_id, &pixel_id);
		auction.ending_price
	}	
	#[view(getAuctionDeadline)]
	fn get_auction_deadline(
		&self,
		canvas_id: &u32,
		pixel_id: &u64
	)->u64{
		let auction = self.get_auction(&canvas_id, &pixel_id);
		auction.deadline
	}	
	#[view(getAuctionOwner)]
	fn get_auction_owner(
		&self,
		canvas_id: &u32,
		pixel_id: &u64
	)->Address{
		let auction = self.get_auction(&canvas_id, &pixel_id);
		auction.pixel_owner
	}
	#[view(getAuctionCurrentBid)]
	fn get_auction_current_bid(
		&self,
		canvas_id: &u32,
		pixel_id: &u64
	)->BigUint{
		let auction = self.get_auction(&canvas_id, &pixel_id);
		auction.current_bid
	}		

	#[view(getAuctionCurrentWinner)]
	fn get_auction_current_winner(
		&self,
		canvas_id: &u32,
		pixel_id: &u64
	)->Address{
		let auction = self.get_auction(&canvas_id, &pixel_id);
		auction.current_winner
	}				

	#[view(getCanvasDimensionsTopEncoded)]
	fn get_canvas_dimensions_topencoded(&self, canvas_id:u32)->MultiResultVec<u32>{
		let dimensions = self.get_canvas_dimensions(&canvas_id);
		let mut v = Vec::new();
		v.push(dimensions.width);
		v.push(dimensions.height);
		v.into()
	}




	#[storage_get("canvasDimensions")]
	fn get_canvas_dimensions(&self, canvas_id: &u32) -> Dimensions;

	#[view(getCanvasCreator)]
	#[storage_get("canvasCreator")]
	fn get_canvas_creator(&self, canvas_id: &u32) -> Address;

	#[view(getPixelColor)]
	#[storage_get("pixelColor")]
	fn get_pixel_color(&self, canvas_id: &u32, pixel_id: &u64)->Color;

	#[view(getPixelOwner)]
	#[storage_get("pixelOwner")]
	fn get_pixel_owner(&self, canvas_id: &u32, pixel_id: &u64)->Address;

	#[view(getLastValidPixelId)]
	#[storage_get("lastValidPixelId")]
	fn get_last_valid_pixel_id(&self, canvas_id: &u32) -> u64;

	#[view(getLastValidCanvasId)]
	#[storage_get("lastValidCanvasId")]
	fn get_last_valid_canvas_id(&self) -> u32;

	#[view(getTotalPixelSupplyOfCanvas)]
	#[storage_get("totalPixelSupplyOfCanvas")]
	fn get_total_pixel_supply_of_canvas(&self, canvas_id: &u32) -> u64;

	#[storage_is_empty("lastCanvasId")]
	fn is_empty_last_valid_canvas_id(&self)->bool;

	#[storage_is_empty("lastValidPixelId")]
	fn is_empty_last_valid_pixel_id(&self, canvas_id: &u32)->bool;

	#[storage_is_empty("auction")]
	fn is_empty_auction(&self, canvas_id: &u32, pixel_id: &u64)->bool;
	
	#[view(getAuction)]
	#[storage_get("auction")]
	fn get_auction(&self, canvas_id:&u32, pixel_id:&u64) -> Auction<BigUint>;


	// #[storage_mapper("colorOf")]
	// fn get_color_mapper(&self, canvas_id: &u32) -> MapMapper<Self::Storage, u64, Color>;
	//Setters

	#[storage_set("owner")]
	fn set_owner(&self, address:&Address);

	#[storage_set("canvasDimensions")]
	fn set_canvas_dimensions(&self, canvas_id: &u32, dimensions: &Dimensions);

	#[storage_set("canvasCreator")]
	fn set_canvas_creator(&self, canvas_id: &u32, creator: &Address);

	#[storage_set("pixelColor")]
	fn set_pixel_color(&self, canvas_id: &u32, pixel_id: &u64, color: &Color);

	#[storage_set("pixelOwner")]
	fn set_pixel_owner(&self, canvas_id: &u32, pixel_id: &u64, owner: &Address);

	#[storage_set("lastValidPixelId")]
	fn set_last_valid_pixel_id(&self, canvas_id: &u32, last_valid_pixel_id: &u64);

	#[storage_set("totalPixelSupplyOfCanvas")]
	fn set_total_pixel_supply_of_canvas(&self, canvas_id:&u32, total_pixel_supply: &u64);

	#[storage_set("lastValidCanvasId")]
	fn set_last_valid_canvas_id(&self, last_canvas_id:&u32);

	#[storage_set("auction")]
	fn set_auction(&self, canvas_id: &u32, pixel_id: &u64, auction: &Auction<BigUint>);

	#[storage_clear("auction")]
	fn clear_auction(&self, canvas_id: &u32, pixel_id: &u64);
}
