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
		self.set_canvas_dimensions(&canvas_id,&dimensions);
		self.set_total_pixel_supply_of_canvas(&canvas_id, &total_supply);
		self.set_last_valid_pixel_id(&canvas_id, &1u64);

		Ok(canvas_id)
	}	


	//Views

	#[view(getOwner)]
	#[storage_get("owner")]
	fn get_owner(&self)-> Address;

	#[view(getCanvas)]
	fn getCanvas(
		&self,
		canvas_id: &u32,
	)->MultiResultVec<Color>{
		let dimensions = self.get_canvas_dimensions(&canvas_id);
		
		let total_pixels = self.get_total_pixel_supply_of_canvas(&canvas_id);

		let mut pixel_id = 1u64;

		let mut pixels = Vec::new();

		while &pixel_id <= &total_pixels {
			let color = self.get_pixel_color(&canvas_id, &pixel_id);
			pixels.push(color);
			pixel_id +=1;
		}
		pixels.into()
	}


	#[view(getCanvasDimensions)]
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



	//Setters

	#[storage_set("owner")]
	fn set_owner(&self, address:&Address);

	#[storage_set("canvasDimensions")]
	fn set_canvas_dimensions(&self, canvas_id: &u32, dimensions: &Dimensions);

	#[storage_set("canvasCreator")]
	fn set_canvas_creator(&self, canvas_id: &u32, creator: &Address);

	#[storage_set("pixelColor")]
	fn set_pixel_color(&self, canvas_id: &u32, pixel_id: &u64, color: Color);

	#[storage_set("pixelOwner")]
	fn set_pixel_owner(&self, canvas_id: &u32, pixel_id: &u64, owner: &Address);

	#[storage_set("lastValidPixelId")]
	fn set_last_valid_pixel_id(&self, canvas_id: &u32, last_valid_pixel_id: &u64);

	#[storage_set("totalPixelSupplyOfCanvas")]
	fn set_total_pixel_supply_of_canvas(&self, canvas_id:&u32, total_pixel_supply: &u64);

	#[storage_set("lastValidCanvasId")]
	fn set_last_valid_canvas_id(&self, last_canvas_id:&u32);

}
