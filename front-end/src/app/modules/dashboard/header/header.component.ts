import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    EventEmitter,
    Output,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { Observable, map} from 'src/app/lib/rxjs';
import { Actions, Store} from 'src/app/lib/ngrx';
import { LoginOrLogout } from './log';
import { getUser, getIsUserLoggedIn, getUserAddress } from '../../payload';
import { User } from 'src/app/model/entity';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.less'],
})
export class HeaderComponent implements OnInit, OnChanges {
    @Output() login = new EventEmitter<string>();
    @Output() logout = new EventEmitter<void>();
    @Input() user: User;

    public loggedin$: Observable<boolean> =  this.store$.select(getIsUserLoggedIn);

    // tslint:disable-next-line: variable-name
    public _loggedIn: boolean;
    @Input() set loggedIn(value: boolean) {
        this._loggedIn = value;
    }

    public logInOrNot: LoginOrLogout = 'login';

    ngOnInit(): void {
        // this.loggedin$.subscribe(v => {
        //     this._loggedIn = v;
        // });
    }

    ngOnChanges(changes: SimpleChanges): void {}

    onLogin(): void {
        if (this._loggedIn === true) {
            this.logout.emit();
        }
        this.login.emit(this.logInOrNot);
    }

    onLogout(): void {
        this.logout.emit();
    }

    constructor(private actions$: Actions, private store$: Store<any>) {}

}
