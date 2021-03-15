import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
// import { State } from '../../model/store/reducers';
// import { Actions, Store } from 'src/app/lib/ngrx';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.less'],
})
export class DashboardComponent implements OnInit {

    ngOnInit(): void {}

    constructor(private actions$: Actions, private store$: Store<any>) {}
}
