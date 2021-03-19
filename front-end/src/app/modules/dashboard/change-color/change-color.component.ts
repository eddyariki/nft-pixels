import { Component, OnInit } from '@angular/core';
import { Address, NetworkConfig, ProxyProvider } from '@elrondnetwork/erdjs/out';
import { Actions } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import CanvasContract from 'src/app/contract-interface/canvas-contract';
import { getUserAddress } from '../../payload';
import * as p5 from 'p5';
import { timeInterval } from 'rxjs/operators';


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
  private canvasContract: CanvasContract;

  ngOnInit(): void {
    
    this.ownedPixels = [];
    this.ownedPixelRGB = [];
    let total = 100 * 100
    for (let i = 1; i <= total; i++) {
      if (Math.random() > (i / total * 2)) {
        this.ownedPixels.push(i);
      }
    }
    console.log(this.ownedPixels.length);
    for (let i = 0; i < this.ownedPixels.length; i++) {
      this.ownedPixelRGB.push([Math.random() * 255, Math.random() * 255, Math.random() * 255, 255])
    }

    this.canvasDimensions = [100, 100];
    this.renderCanvas(700,700,0.5);
    // this.ownedPixels = await this.canvasContract.getOwnedPixel(Address.fromString(this.address), 1);
    
  }

  constructor(private actions$: Actions, private store$: Store<any>) { }

 
  renderCanvas(width:number, height:number, strokeWeight:number){
    const sketch = s => {
      let canvasW = this.canvasDimensions[0];
      let canvasH = this.canvasDimensions[1];
      let totalPixels = canvasW * canvasH;
      let img;
      let imgSize = [0.2, 0.2];
      let pGraphic;
      let wRatio = width/canvasW;
      let hRatio = height/canvasH;
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
      }

      const reDraw = () => {
        for (let i = 1; i <= totalPixels; i++) {
          if (this.ownedPixels.includes(i)) {
            pGraphic.stroke(0, 0, 0, 120);
            pGraphic.strokeWeight(strokeWeight);
            let idx = this.ownedPixels.indexOf(i);
            let rgb = this.ownedPixelRGB[idx]
            pGraphic.fill(rgb[0], rgb[1], rgb[2]);
            pGraphic.rect((i - 1) % canvasW * wRatio, Math.floor((i - 1) / canvasW) * hRatio, wRatio, hRatio);
          } else {
            pGraphic.noFill();
            pGraphic.stroke(0, 0, 0, 20);
            pGraphic.strokeWeight(strokeWeight)
          }

        }
      }

      const enableImage = () =>{
        if(img)showImage = !showImage;
        if(showImage)button.html("Hide Image")
      }

      s.preload = () => {
      }

      s.setup = () => {
        let input = s.createFileInput(handeFile);
        input.parent('file-uploader');

        sliderSize = s.createSlider(0,100,20);
        sliderSize.parent('w-slider');

        button = s.createButton('show Image');
        button.parent('enable-image');
        button.mousePressed(enableImage);


        let _pCanvas = s.createCanvas(width, height);
        pGraphic = s.createGraphics(width, height);
        _pCanvas.parent('sketch-holder');
        s.frameRate(25);
        reDraw();
      }

      s.draw = () => {
        s.background(255);
        s.image(pGraphic, 0, 0);
        if (img && showImage) {
          let imgW = img.width * sliderSize.value()/100;
          let imgH = img.height * sliderSize.value()/100;
          s.image(img,
            s.mouseX - imgW / 2,
            s.mouseY - imgH / 2,
            imgW,
            imgH
          );
        }
      }
      s.mouseClicked = () => {

        if(s.mouseX<=0 || s.mouseY<=0)return
        if (img) {
          //image is setting color
          let imgW = img.width * sliderSize.value()/100;
          let imgH = img.height * sliderSize.value()/100;
          let imgStartX = s.mouseX - imgW / 2;
          let imgStartY = s.mouseY - imgH / 2;

          for (let i = 0; i < this.ownedPixels.length; i++) {
            let pixelId = this.ownedPixels[i];
            let pixelX = (pixelId - 1) % canvasW * wRatio;
            let pixelY = Math.floor((pixelId - 1) / canvasW) * hRatio;
            if (
              pixelX >= imgStartX &&
              pixelX < imgStartX + imgW &&
              pixelY >= imgStartY &&
              pixelY < imgStartY + imgH
            ) {
              //pixel inside hovering image
              let c = s.get(pixelX, pixelY);
              this.ownedPixelRGB[i] = c;
            }
          }
          reDraw();
        }
      }
    }
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