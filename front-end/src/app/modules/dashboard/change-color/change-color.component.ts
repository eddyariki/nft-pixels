import { Component, OnInit } from '@angular/core';
import { Address, NetworkConfig, ProxyProvider } from '@elrondnetwork/erdjs/out';
import { Actions } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import CanvasContract from 'src/app/contract-interface/canvas-contract';
import { getUserAddress } from '../../payload';

@Component({
  selector: 'app-change-color',
  templateUrl: './change-color.component.html',
  styleUrls: ['./change-color.component.less']
})
export class ChangeColorComponent implements OnInit {

  public foundContract: boolean;
  public ownedPixels: number[];
  public address: string;
  private canvasContract: CanvasContract;
  ngOnInit(): void{
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
  // });

  this.ownedPixels = [1,2,3,4,5,7]
    // this.ownedPixels = await this.canvasContract.getOwnedPixel(Address.fromString(this.address), 1);

  }

  constructor(private actions$: Actions, private store$: Store<any>) { }



}
