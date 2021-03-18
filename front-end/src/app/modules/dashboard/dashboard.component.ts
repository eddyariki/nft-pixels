import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { Observable, map, mergeMap, mapTo, switchMap, tap, concat} from 'src/app/lib/rxjs';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import CanvasContract from 'src/app/contract-interface/canvas-contract';

// import { LoginOrLogout, LoginOrLogoutEnum, LoginOrLogoutEnum_En } from './header/log';
import { Actions } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { actions as payloadActions } from 'src/app/modules/payload/payload.actions';
import * as userActions from 'src/app/model/store/user/actions';
import { dispatch } from 'rxjs/internal/observable/pairs';
import { getUser, getIsUserLoggedIn, getUserAddress } from '../payload';
// import { User } from 'src/app/contract-interface/user';
import { User } from 'src/app/model/entity';
import { ProxyProvider } from '@elrondnetwork/erdjs/out/proxyProvider';
import { NetworkConfig } from '@elrondnetwork/erdjs/out';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.less'],
})
export class DashboardComponent implements OnInit {
    public user$ = this.store$.select(getUser);
    public loggedIn$: Observable<boolean>;
    public LoginModalIsVisible: boolean;

    ngOnInit(): void {}


    onLogin(loggedInOrNot: string): void {

        // this.store$.select()
        if (loggedInOrNot === 'login'){
            this.LoginModalIsVisible = true;
        }else if (loggedInOrNot === 'logout'){
            // logout function (clear cache/localstorage)
        }

    }

    onLogout(): void {
        this.store$.select(getUserAddress).subscribe(
            x => {
                this.store$.dispatch(userActions.remove({id: x})),
                this.store$.dispatch(payloadActions.payload({userAddress: x, isLoggedIn: false, key: null}));
            }
        );
    }

    showLoginModal(show: boolean): void{
        if (this.LoginModalIsVisible !== show){
            this.LoginModalIsVisible = show;
        }
    }

    userLoggedIn(user: User): void{
        this.store$.dispatch(payloadActions.payload({userAddress: user.id, isLoggedIn: true, key: null}));
        this.store$.dispatch(userActions.add({user: {id: user.id,  loggedIn: true}}));
        this.loggedIn$ = this.store$.select(getIsUserLoggedIn);

    }


    constructor(private actions$: Actions, private store$: Store<any>, private sanitizer: DomSanitizer) { }

}
