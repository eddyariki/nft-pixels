import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    EventEmitter,
    Output,
    Input
} from '@angular/core';
import { Observable, map} from 'src/app/lib/rxjs';
import { Actions, Store} from 'src/app/lib/ngrx';
import { LoginOrLogout } from './log';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.less'],
})
export class HeaderComponent implements OnInit {
    @Output() login = new EventEmitter<string>();


    // tslint:disable-next-line: variable-name
    public _loggedIn: boolean;
    @Input() set loggedIn(value: boolean) {
        this._loggedIn = value;
    }

    public logInOrNot: LoginOrLogout = 'login';

    ngOnInit(): void {
        if ( this.loggedIn === true ) {
            this.logInOrNot = 'logout';
        }
    }

    onLogin(): void {
        this.login.emit(this.logInOrNot);
    }

    constructor(private actions$: Actions, private store$: Store<any>) {}

}
