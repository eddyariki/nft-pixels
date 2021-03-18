ALICE="../users/alice.pem"
DEPLOY_GAS="80000000"
PROXY=http://localhost:7950


erdpy --verbose contract call erd1qqqqqqqqqqqqqpgqr3yt02u59g2hwptpeawd5z8vt8qete0sd8ss6x8cnu --recall-nonce --pem="../users/alice.pem" --gas-limit=100000000 \
--function="mintPixels" --arguments "0x01@05" --proxy=http://localhost:7950 --outfile="mint-pixels.json"
