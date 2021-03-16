import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { Observable, map} from 'src/app/lib/rxjs';
import { Actions } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Test } from 'src/app/model/entity';
import * as testActions from 'src/app/model/store/test/actions';
import { getState, getById } from 'src/app/model/store/test/selectors';
import { dispatch } from 'rxjs/internal/observable/pairs';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.less'],
})
export class DashboardComponent implements OnInit {

    public test$: Observable<Test>;
    public a: string;

    ngOnInit(): void {}

    constructor(private actions$: Actions, private store$: Store<any>) {}
}
