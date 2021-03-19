import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, mergeMap, mapTo, switchMap, tap, concat} from 'src/app/lib/rxjs';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import CanvasContract from 'src/app/contract-interface/canvas-contract';
import { Actions } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { actions as payloadActions } from 'src/app/modules/payload/payload.actions';
import * as userActions from 'src/app/model/store/user/actions';
import { dispatch } from 'rxjs/internal/observable/pairs';
import { getUser, getIsUserLoggedIn, getUserAddress } from '../../payload';
import { User } from 'src/app/model/entity';
import { ProxyProvider } from '@elrondnetwork/erdjs/out/proxyProvider';
import { NetworkConfig } from '@elrondnetwork/erdjs/out';
import { Navigator } from '../navigator';
import { getLoginModalIsVisible } from 'src/app/modules/payload/login/login-visible.selectors';
import { actions as loginVisibleActions } from 'src/app/modules/payload/login/login-visible.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
    public user$ = this.store$.select(getUser);
    public image: SafeUrl;
    public loggedIn$: Observable<boolean>;
    public LoginModalIsVisible: boolean;
    public gettingCanvas: boolean;
    public foundContract: boolean;
    public url: string;
    async ngOnInit(): Promise<void> {
        const proxyProvider = new ProxyProvider('http://localhost:7950', 1000000);
        await NetworkConfig.getDefault().sync(proxyProvider);
        let canvasContract: CanvasContract;
        try {
            canvasContract = new CanvasContract(
                // 'erd1qqqqqqqqqqqqqpgqd4kel97fslldfrfv2jce5u76qwa8w48pd8ss7zyjft',
                // proxyProvider
            );
        }catch (e){
            canvasContract = new CanvasContract();

        }
        if (canvasContract.proxyProvider){
            this.foundContract = true;
        }else{
            this.foundContract = false;
        }
        this.gettingCanvas = true;
        const rgbArray = await canvasContract.getCanvas(1);
        this.gettingCanvas = false;
        this.image = this.sanitizer.bypassSecurityTrustUrl(rgbArray.dataURL);
    }

    onAuction() {
        this.store$.select(getIsUserLoggedIn).subscribe(x => {
            if (x === false) {
                this.store$.dispatch(loginVisibleActions.loginVisible({LoginModalIsVisible: true}));
            }
        });

        this.store$.select(getUserAddress).subscribe(
            id => {
                if (id) {
                    this.url = Navigator.goAuction(id);
                } else {
                    this.url = '';
                }
            }
        );
        this.router.navigate([this.url]);
    }

    onChangeColor(): void{
        this.store$.select(getIsUserLoggedIn).subscribe(x => {
            if (x === false) {
                this.store$.dispatch(loginVisibleActions.loginVisible({LoginModalIsVisible: true}));
            }
        });

        this.store$.select(getUserAddress).subscribe(
            id => {
                if (id){
                    this.url = Navigator.goChangeColor(id);
                } else {
                    this.url = '';
                }
            }
        );
        this.router.navigate([this.url]);
    }

   constructor(
        private actions$: Actions,
        private store$: Store<any>,
        private sanitizer: DomSanitizer,
        private router: Router,
        ) {}

}
