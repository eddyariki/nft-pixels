import { Component, OnInit } from '@angular/core';
import { Address, NetworkConfig, ProxyProvider, Transaction } from '@elrondnetwork/erdjs/out';
import { Actions } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import CanvasContract from 'src/app/contract-interface/canvas-contract';
import * as p5 from 'p5';
import { timeInterval } from 'rxjs/operators';
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
  public pCanvas: any;
  public foundContract: boolean;
  public ownedPixels: number[];
  public address: string;
  public canvasDimensions: number[];
  public ownedPixelRGB: number[][];
  public user: User;
  public updatedPixels: number[];
  public transactionCallBack: Transaction;
  public showTransactionModal: boolean;
  public sendingTransaction: boolean;
  private canvasContract: CanvasContract;
  private proxyProvider: ProxyProvider;
  private networkConfig: NetworkConfig;

  async ngOnInit(): Promise<void> {
    this.updatedPixels = [];
    this.proxyProvider = new ProxyProvider(PROXY_PROVIDER_ENDPOINT, 100000);
    await NetworkConfig.getDefault().sync(this.proxyProvider);
    this.user = this.store$.select(getUser); // ここにユーザー情報
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

  constructor(
    private actions$: Actions,
    private store$: Store<any>
  ) { }

  async changeColor(): Promise<void> {
    const rs = this.ownedPixelRGB.map(rgb => rgb[0]);
    const gs = this.ownedPixelRGB.map(rgb => rgb[1]);
    const bs = this.ownedPixelRGB.map(rgb => rgb[2]);
    try {
      this.transactionCallBack = await this.canvasContract.changeBatchPixelColor(1, this.ownedPixels, rs, gs, bs);
      this.showTransactionModal = true;
    } catch (e) {
      console.log('Failed to create transaction');
    }
  }
  async confirmTransation(): Promise<void> {
    this.sendingTransaction = true;
    const hash = await this.transactionCallBack.send(this.proxyProvider);
    await this.transactionCallBack.awaitExecuted(this.proxyProvider);
    const executed = await this.proxyProvider.getTransactionStatus(hash);
    this.sendingTransaction = false;
    this.showTransactionModal = false;
  }



  renderCanvas(width: number, height: number, strokeWeight: number): void {
    const sketch = s => {
      const canvasW = this.canvasDimensions[0];
      const canvasH = this.canvasDimensions[1];
      const totalPixels = canvasW * canvasH;
      let img;
      const imgSize = [0.2, 0.2];
      let pGraphic;
      const wRatio = width / canvasW;
      const hRatio = height / canvasH;
      let sliderSize;
      let button;
      let showImage;
      const handeFile = file => {
        if (file.type === 'image') {
          img = s.createImg(file.data, '');
          img.hide();
        } else {
          img = null;
        }
      };

      const reDraw = () => {
        for (let i = 1; i <= totalPixels; i++) {
          if (this.ownedPixels.includes(i)) {
            pGraphic.stroke(0, 0, 0, 120);
            pGraphic.strokeWeight(strokeWeight);
            const idx = this.ownedPixels.indexOf(i);
            const rgb = this.ownedPixelRGB[idx];
            pGraphic.fill(rgb[0], rgb[1], rgb[2]);
            pGraphic.rect((i - 1) % canvasW * wRatio, Math.floor((i - 1) / canvasW) * hRatio, wRatio, hRatio);
          } else {
            pGraphic.noFill();
            pGraphic.stroke(0, 0, 0, 20);
            pGraphic.strokeWeight(strokeWeight);
            pGraphic.rect((i - 1) % canvasW * wRatio, Math.floor((i - 1) / canvasW) * hRatio, wRatio, hRatio);

          }

        }
      };

      const enableImage = () => {
        if (img) { showImage = !showImage; }
        if (showImage) { button.html('Hide Image'); }
      };

      s.preload = () => {
      };

      s.setup = () => {
        const input = s.createFileInput(handeFile);
        input.parent('file-uploader');

        sliderSize = s.createSlider(0, 100, 20);
        sliderSize.parent('w-slider');

        button = s.createButton('画像オン');
        button.parent('enable-image');
        button.mousePressed(enableImage);


        const pCanvas = s.createCanvas(width, height);
        pGraphic = s.createGraphics(width, height);
        pCanvas.parent('sketch-holder');
        s.frameRate(25);
        reDraw();
      };

      s.draw = () => {
        s.background(255);
        s.image(pGraphic, 0, 0);
        if (img && showImage) {
          const imgW = img.width * sliderSize.value() / 100;
          const imgH = img.height * sliderSize.value() / 100;
          s.image(img,
            s.mouseX - imgW / 2,
            s.mouseY - imgH / 2,
            imgW,
            imgH
          );
        }
      };
      s.mouseClicked = () => {

        if (s.mouseX <= 0 || s.mouseY <= 0) { return; }
        if (img) {
          // image is setting color
          const imgW = img.width * sliderSize.value() / 100;
          const imgH = img.height * sliderSize.value() / 100;
          const imgStartX = s.mouseX - imgW / 2;
          const imgStartY = s.mouseY - imgH / 2;

          for (let i = 0; i < this.ownedPixels.length; i++) {
            const pixelId = this.ownedPixels[i];
            const pixelX = (pixelId - 1) % canvasW * wRatio;
            const pixelY = Math.floor((pixelId - 1) / canvasW) * hRatio;
            if (
              pixelX >= imgStartX &&
              pixelX < imgStartX + imgW &&
              pixelY >= imgStartY &&
              pixelY < imgStartY + imgH
            ) {
              // pixel inside hovering image
              const c = s.get(pixelX, pixelY);
              this.ownedPixelRGB[i] = c;
              this.updatedPixels.push(i);
            }
          }
          reDraw();
        }
      };
    };
    this.pCanvas = new p5(sketch);
  }

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
  // });
