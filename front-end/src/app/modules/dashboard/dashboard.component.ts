import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { Observable, map} from 'src/app/lib/rxjs';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import CanvasContract from 'src/app/contract-interface/canvas-contract';

import { LoginOrLogout, LoginOrLogoutEnum, LoginOrLogoutEnum_En } from './header/log';
import { Actions } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Test } from 'src/app/model/entity';
import * as testActions from 'src/app/model/store/test/actions';
import { getState, getById } from 'src/app/model/store/test/selectors';
import { dispatch } from 'rxjs/internal/observable/pairs';
import { getUser } from '../payload';
import { User } from 'src/app/contract-interface/user';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.less'],
})
export class DashboardComponent implements OnInit {
    public image: SafeUrl;
    public loggedIn: boolean;
    public LoginModalIsVisible: boolean;
    async ngOnInit(): Promise<void> {
        // const canvasContract = new CanvasContract();
        // const rgbArray = await canvasContract.getCanvas(1);
        // this.image = this.sanitizer.bypassSecurityTrustUrl(rgbArray.dataURL);
    }

    onLogin(loggedInOrNot: string): void {
        if(loggedInOrNot === 'login'){
            this.LoginModalIsVisible = true;
        }else if(loggedInOrNot === 'logout'){
            //logout function (clear cache/localstorage)
        }
        
    }

    showLoginModal(show:boolean){
        if(this.LoginModalIsVisible!==show){
            this.LoginModalIsVisible = show;
        }
    }

    userLoggedIn(user:User){
        console.log(user);
    }


    constructor(private actions$: Actions, private store$: Store<any>, private sanitizer: DomSanitizer) {}

}
