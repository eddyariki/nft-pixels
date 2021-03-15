# decentralized-pixels

## NFT pixels specifications


### Admin Only Functions:
- ```createEmptyCanvas(width: u32, height: u32)```-> canvas_id
- ```mintPixels(canvas_id: u32, amount: u32)``` -> Vec<u32>  (TopEncoded, represents minted pixel_ids)


*to be added in future*
- ```setCanvasLimit(limit: u32)```-> null
- ```relinquishOwnership()```->null
- ```multiSig()```-> SCResult

### Functions:
- ```changePixelColor(canvas_id:u32, pixel_id:u32, r:u8,g:u8,b:u8)```-> SCResult
- ```auctionPixel(canvas_id:u32, pixel_id:u32, startPrice: BigUint, endPrice: BigUint, deadline: BigUint)```->Auction Status (?)
- ```endAuction(canvas_id:u32, pixel_id:u32)```-> Auction Status(?)
#### Payable Functions:
- ```bid(canvas_id:u32, pixel_id:u32, value:BigUint)```-> ???

#### ERC721 & ERC1155 standards (to be added later) Functions
- ```transfer(canvas_id:u32, pixel_id:u32, to: Address)```-> SCResult

*to be added in future*
- ```changeBatchPixelColor(canvas_id: [u32], pixel_ids: [u32], r:[u8], g:[u8], b:[u8])```->SCResult
-
### Views:
- `getCanvas(canvas_id:u32)`-> `Vec<u32>` (Top Encoded)  
- `getPixel(canvas_id:u32, pixel_id:u32)` ->  Pixel: RGB, Owner
- `getPixelAuction(canvas_id:u32, pixel_id:u32)` -> Auction Status if exist
















