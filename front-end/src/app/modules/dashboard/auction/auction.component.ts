import { Component, OnInit } from '@angular/core';
import { Address, NetworkConfig, ProxyProvider, Transaction } from '@elrondnetwork/erdjs/out';
import { Actions } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import CanvasContract from 'src/app/contract-interface/canvas-contract';
import { User } from 'src/app/contract-interface/user';
import { environment } from 'src/environments/environment';
import { actions as pathActions } from '../../payload/path/path.actions';

const CANVAS_CONTRACT_ADDRESS = environment.contractAddress;
const PROXY_PROVIDER_ENDPOINT = environment.proxyProviderEndpoint;

interface Auction{
  pixelId: number;
  startingPrice: number;
  endingPrice: number;
  deadline: number;
  owner: Address;
  currentBid: number;
  currentWinner: Address;
}
@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.less']
})
export class AuctionComponent implements OnInit {
  public transactionModalIsVisible: boolean;
  public sendingTransaction: boolean;
  public loginModalIsVisible: boolean;
  public loadingStateMessage: string;
  public currentAuction: Auction;
  public transactionCallBack: Transaction;
  private canvasContract: CanvasContract;
  private proxyProvider: ProxyProvider;
  private networkConfig: NetworkConfig;
  private activeAuctions: number[];
  public bidAmount: number;
  
  public user: User;

  async ngOnInit(): Promise<void> {
      this.store$.dispatch(pathActions.path({path: 'auction'}));
      this.proxyProvider = new ProxyProvider(PROXY_PROVIDER_ENDPOINT, 1000000);
      this.loadingStateMessage = 'Connecting to Proxy...';
      await NetworkConfig.getDefault().sync(this.proxyProvider);
      this.loadingStateMessage = 'Syncing network...';
      this.loadingStateMessage = 'Getting Contract...';
      this.canvasContract = new CanvasContract(
        CANVAS_CONTRACT_ADDRESS,
        this.proxyProvider,
        this.user,
        this.networkConfig
      );
      try{
        this.activeAuctions = await this.canvasContract.getAuctions(1, 1, 10000);
      }catch (e){
        console.log(e);
      }
  }

  constructor(private actions$: Actions, private store$: Store<any>) {
  }

  showLoginModal(show: boolean): void {
    this.loginModalIsVisible = show;
  }
  async createAuctionTransaction(): Promise<void>{
    try{
    
    this.transactionCallBack = await this.canvasContract.bidAuction(
      1, 
      this.currentAuction.pixelId,
      this.bidAmount
      );
        console.log('Successful transaction created.');
        this.transactionModalIsVisible = true;
    }catch (e){
      this.transactionModalIsVisible = false;
      console.log('Failed at transacion creation');
      console.log(e);
    }
  }
  onKey($event: any): void{
    this.bidAmount = $event.target.value;
  }

  async confirmTransaction(): Promise<void>{
    console.log('Sending transaction');

    await NetworkConfig.getDefault().sync(this.proxyProvider);

    this.sendingTransaction = true;

    await this.user.account.sync(this.proxyProvider);

    this.transactionCallBack.setNonce(this.user.account.nonce);

    await this.user.signer.sign(this.transactionCallBack);

    this.user.account.incrementNonce();

    const hash = await this.transactionCallBack.send(this.proxyProvider);
    this.loadingStateMessage = 'sent transaction';
    await this.transactionCallBack.awaitPending(this.proxyProvider);
    this.loadingStateMessage = 'pending... transaction';
    await this.transactionCallBack.awaitExecuted(this.proxyProvider);
    this.loadingStateMessage = 'transaction executed';
  }

  async userLoggedIn(user: User): Promise<void> {
    this.user = user;
    this.loginModalIsVisible = false;
  }
  async getAuctionInfo(id: number): Promise<Auction>{
    const startingPrice = await this.canvasContract.getAuctionStartingPrice(1, id);
    const endingPrice = await this.canvasContract.getAuctionEndingPrice(1, id);
    const deadline = await this.canvasContract.getAuctionDeadline(1, id);
    const owner: Address = await this.canvasContract.getAuctionOwner(1, id);
    const currentBid = await this.canvasContract.getAuctionCurrentBid(1, id);
    const currentWinner = await this.canvasContract.getAuctionCurrentWinner(1, id);
    const selectedAuctionInfo: Auction = {
      pixelId: id,
      startingPrice,
      endingPrice,
      deadline,
      owner,
      currentBid,
      currentWinner
    };
    return selectedAuctionInfo;
  }

  async selectPixel(id: number): Promise<void>{
    this.currentAuction = await this.getAuctionInfo(id);
  }


}
