import { Component, Input, OnInit } from '@angular/core';
import { Account, Address, NetworkConfig, ProxyProvider, Transaction, UserSigner } from '@elrondnetwork/erdjs/out';
import { Actions } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import CanvasContract from 'src/app/contract-interface/canvas-contract';
import * as p5 from 'p5';
import { timeInterval, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
// import { User } from 'src/app/contract-interface/user';
import { getUser, getIsUserLoggedIn, getUserAddress } from '../../payload';
import { User } from 'src/app/model/entity';
// let a: User
const CANVAS_CONTRACT_ADDRESS = environment.contractAddress;
const PROXY_PROVIDER_ENDPOINT = environment.proxyProviderEndpoint;
@Component({
  selector: 'app-change-color-child',
  templateUrl: './change-color-child.component.html',
  styleUrls: ['./change-color-child.component.less']
})
export class ChangeColorChildComponent implements OnInit {
  @Input() user: User;
  public pCanvas: any;
  public foundContract: boolean;
  public ownedPixels: number[];
  public address: string;
  public canvasDimensions: number[];
  public ownedPixelRGB: number[][];
  public updatedPixels: boolean[];
  public updatedPixelsSum: number;
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
    // this.user = this.store$.select(getUser); // ここにユーザー情報
    this.canvasContract = new CanvasContract(CANVAS_CONTRACT_ADDRESS, this.proxyProvider, this.user, this.networkConfig);
    try {
      // console.log(this.user.account.address);
      this.ownedPixels = await this.canvasContract.getOwnedPixels(
        this.user.account.address,
        1,
        1,
        10000
      );
      const ownedPixelArray = await this.canvasContract.getOwnedPixelsColor(
        this.user.account.address,
        1,
        1,
        1000,
        this.ownedPixels.length
      );
      this.ownedPixelRGB = [];
      for (let i = 0; i < ownedPixelArray.length * 3; i += 3) {
        const r = ownedPixelArray[i];
        const g = ownedPixelArray[i + 1];
        const b = ownedPixelArray[i + 2];
        this.ownedPixelRGB.push([r, g, b]);
      }
      console.log(this.ownedPixelRGB[0]);
    } catch (e) {
      console.log(e);
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
    this.updatedPixels = this.ownedPixels.map(() => false);
  }

  constructor(
    private actions$: Actions,
    private store$: Store<any>
  ) { }

  async changeColorTransaction(): Promise<void> {
    const updatedPixelArray = this.ownedPixels.filter((el, idx) => {
      return this.updatedPixels[idx] === true;
    });
    const updatedPixelArrayRGB =  this.ownedPixelRGB.filter((el, idx) => {
      return this.updatedPixels[idx] === true;
    });
    const rs = updatedPixelArrayRGB.map(rgb => rgb[0]);
    const gs = updatedPixelArrayRGB.map(rgb => rgb[1]);
    const bs = updatedPixelArrayRGB.map(rgb => rgb[2]);
    try {
      this.transactionCallBack = await this.canvasContract.changeBatchPixelColor(1, updatedPixelArray, rs, gs, bs);
      this.showTransactionModal = true;
      console.log('Successful transaction created.');
    } catch (e) {
      console.log('Failed to create transaction');
      console.log(e);
    }
  }
  async confirmTransaction(): Promise<void> {
    console.log('1 here');
    this.sendingTransaction = true;
    const newUser = new Account(this.user.account.address);
    await newUser.sync(this.proxyProvider);
    console.log('2 here');
    this.transactionCallBack.setNonce(newUser.nonce);
    const signer = this.user.signer as UserSigner;
    await signer.sign(this.transactionCallBack);

    console.log('3 here');
    newUser.incrementNonce();
    console.log('4 here');
    const hash = await this.transactionCallBack.send(this.proxyProvider);
    console.log('5 here');
    await this.transactionCallBack.awaitExecuted(this.proxyProvider);
    console.log('6 here');
    const executed = await this.proxyProvider.getTransactionStatus(hash);
    console.log('7 here');
    this.sendingTransaction = false;
    this.showTransactionModal = false;
  }



  renderCanvas(width: number, height: number, strokeWeight: number): void {
    const sketch = s => {
      const canvasW = this.canvasDimensions[0];
      const canvasH = this.canvasDimensions[1];
      const totalPixels = canvasW * canvasH;
      let img: any;
      let pGraphic: any;
      let imageGrapic: any;
      const wRatio = width / canvasW;
      const hRatio = height / canvasH;
      let sliderSize: any;
      let button: any;
      let showImage: any;

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
            try {
              const rgb = this.ownedPixelRGB[idx];
              pGraphic.fill(rgb[0], rgb[1], rgb[2]);
              pGraphic.rect((i - 1) % canvasW * wRatio, Math.floor((i - 1) / canvasW) * hRatio, wRatio, hRatio);
            } catch (e) {
              console.log(e);
            }
          } else {
            pGraphic.noFill();
            pGraphic.stroke(0, 0, 0, 10);
            pGraphic.strokeWeight(strokeWeight);
            pGraphic.rect((i - 1) % canvasW * wRatio, Math.floor((i - 1) / canvasW) * hRatio, wRatio, hRatio);
          }

        }
      };

      const enableImage = () => {
        if (img) { showImage = !showImage; }

        if (showImage) { button.html('画像オフ'); }
      };

      s.setup = () => {
        const input = s.createFileInput(handeFile);
        input.parent('file-uploader');

        sliderSize = s.createSlider(1, 100, 20);
        sliderSize.parent('w-slider');

        button = s.createButton('画像オン');
        button.parent('enable-image');
        button.mousePressed(enableImage);


        const pCanvas = s.createCanvas(width, height);
        pGraphic = s.createGraphics(width, height);
        imageGrapic = s.createGraphics(width, height);
        pCanvas.parent('sketch-holder');
        s.frameRate(25);
        if (this.ownedPixels.length === this.ownedPixelRGB.length) {
          reDraw();
        } else {
          console.log(this.ownedPixels.length);
          console.log(this.ownedPixelRGB.length);
        }
      };

      s.draw = () => {
        s.background(255);

        s.image(pGraphic, 0, 0);
        if (img && showImage) {
          const imgW = img.width * sliderSize.value() / 100;
          const imgH = img.height * sliderSize.value() / 100;
          imageGrapic.clear();
          imageGrapic.image(img,
            s.mouseX - imgW / 2,
            s.mouseY - imgH / 2,
            imgW,
            imgH
          );
          s.image(imageGrapic, 0, 0);
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
              pixelX < (imgStartX + imgW) &&
              pixelY >= imgStartY &&
              pixelY < (imgStartY + imgH)
            ) {
              // pixel inside hovering image
              const c = imageGrapic.get(pixelX, pixelY);
              this.ownedPixelRGB[i] = c;
              this.updatedPixels[i] = true;
              this.updatedPixelsSum = this.updatedPixels.filter(Boolean).length;
            }
          }
          reDraw();
        }
      };
    };
    this.pCanvas = new p5(sketch);
  }
}
