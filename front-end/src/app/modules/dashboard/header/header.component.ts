import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    EventEmitter,
    Output
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

    public logInOrNot: LoginOrLogout = 'login';

    ngOnInit(): void {
    }

    onLogin(): void {
        this.login.emit(this.logInOrNot);
    }

    constructor(private actions$: Actions, private store$: Store<any>) {}

}
