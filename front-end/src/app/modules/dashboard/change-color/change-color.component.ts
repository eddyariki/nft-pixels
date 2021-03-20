import { Component, OnInit } from '@angular/core';
import { Address, NetworkConfig, ProxyProvider, Transaction } from '@elrondnetwork/erdjs/out';
import { Actions } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import CanvasContract from 'src/app/contract-interface/canvas-contract';
import * as p5 from 'p5';
import { timeInterval, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/contract-interface/user';
import { getUser, getIsUserLoggedIn, getUserAddress } from '../../payload';

const CANVAS_CONTRACT_ADDRESS = environment.contractAddress;
const PROXY_PROVIDER_ENDPOINT = environment.proxyProviderEndpoint;
@Component({
  selector: 'app-change-color',
  templateUrl: './change-color.component.html',
  styleUrls: ['./change-color.component.less']
})

export class ChangeColorComponent implements OnInit {

<<<<<<< HEAD
  async ngOnInit(): Promise<void> {
    this.updatedPixels = [];
    this.proxyProvider = new ProxyProvider(PROXY_PROVIDER_ENDPOINT, 100000);
    await NetworkConfig.getDefault().sync(this.proxyProvider);
    // this.user = this.store$.select(getUser); // ここにユーザー情報
    this.user = new User();
    this.canvasContract = new CanvasContract(CANVAS_CONTRACT_ADDRESS, this.proxyProvider, this.user, this.networkConfig);
    try {
      console.log(this.user.account.address);
      this.ownedPixels = await this.canvasContract.getOwnedPixels(this.user.account.address, 1);
      console.log(this.ownedPixels);
      const ownedPixelU8intArray = await this.canvasContract.getColorsByPixelIds(1, this.ownedPixels);
      for (let i = 0; i < ownedPixelU8intArray.length; i += 3) {
        const r = ownedPixelU8intArray[i];
        const g = ownedPixelU8intArray[i + 1];
        const b = ownedPixelU8intArray[i + 2];
        this.ownedPixelRGB[i] = [r, g, b];
      }
    } catch (e) {
      console.log('failed to get address information');
      this.ownedPixels = [];
      this.ownedPixelRGB = [];
      for (let i = 0; i < 100; i++) {
        this.ownedPixels[i] = i + 1;
        this.ownedPixelRGB[i] = [Math.random() * 255, Math.random() * 255, Math.random() * 255];
      }
    }
    console.log('total pixels owned: ', this.ownedPixels.length);
    this.canvasDimensions = await this.canvasContract.getCanvasDimensions(1);
    this.renderCanvas(700, 700, 0.5);
  }
=======
  public user$ = this.store$.select(getUser);

  ngOnInit(): void {}
>>>>>>> 8bd81409bad13fd61aed084c44a2e97e2f0ba2d3

  constructor(
    private actions$: Actions,
    private store$: Store<any>
  ) { }
}





//   const proxyProvider = new ProxyProvider('http://localhost:7950', 1000000);
  //   try {
  //     await NetworkConfig.getDefault().sync(proxyProvider);
  //   } catch (e) {
  //     console.log("Failed to get network config.");
  //   }


  //   try {
  //     this.canvasContract = new CanvasContract(
  //       'erd1qqqqqqqqqqqqqpgqfzydqmdw7m2vazsp6u5p95yxz76t2p9rd8ss0zp9ts', //smart contract address
  //       proxyProvider
  //     );
  //   } catch (e) {
  //     this.canvasContract = new CanvasContract();

  //   }
  //   if (this.canvasContract.proxyProvider) {
  //     this.foundContract = true;
  //   } else {
  //     this.foundContract = false;
  //   }
  //   if(!this.foundContract)return;
  //   let user;
  //   this.store$.select(getUserAddress).subscribe(x => {
  //     this.address = x;
