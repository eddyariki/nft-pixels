import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { Observable, map} from 'src/app/lib/rxjs';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import CanvasContract from 'src/app/contract-interface/canvas-contract';

// import { LoginOrLogout, LoginOrLogoutEnum, LoginOrLogoutEnum_En } from './header/log';
import { Actions } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { actions as payloadActions } from 'src/app/modules/payload/payload.actions';
import * as userActions from 'src/app/model/store/user/actions';
import { dispatch } from 'rxjs/internal/observable/pairs';
import { getUser, getIsUserLoggedIn } from '../payload';
// import { User } from 'src/app/contract-interface/user';
import { User } from 'src/app/model/entity';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.less'],
})
export class DashboardComponent implements OnInit {
    public image: SafeUrl;
    public loggedIn$: Observable<boolean>;
    public LoginModalIsVisible: boolean;
    async ngOnInit(): Promise<void> {
        // const canvasContract = new CanvasContract();
        // const rgbArray = await canvasContract.getCanvas(1);
        // this.image = this.sanitizer.bypassSecurityTrustUrl(rgbArray.dataURL);
    }

    onLogin(loggedInOrNot: string): void {

        // this.store$.select()
        if (loggedInOrNot === 'login'){
            this.LoginModalIsVisible = true;
        }else if (loggedInOrNot === 'logout'){
            // logout function (clear cache/localstorage)
        }

    }

    showLoginModal(show: boolean): void{
        if (this.LoginModalIsVisible !== show){
            this.LoginModalIsVisible = show;
        }
    }

    userLoggedIn(user: User): void{
        console.log(user.id);
        this.store$.dispatch(payloadActions.payload({userAddress: user.id, isLoggedIn: true, key: null}));
        this.store$.dispatch(userActions.add({user: {id: user.id,  loggedIn: true}}));
        // this.store$.dispatch(userActions.add({user: {id: user.id, account: user.account, signer: user.signer, loggedIn: true}}));
        this.loggedIn$ = this.store$.select(getIsUserLoggedIn);

    }


    constructor(private actions$: Actions, private store$: Store<any>, private sanitizer: DomSanitizer) {}

}
