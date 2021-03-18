import { Component, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {  map } from 'rxjs/operators';
import * as userActions from 'src/app/model/store/user/actions';
import * as testActions from 'src/app/model/store/test/actions';
import { actions as payloadActions } from 'src/app/modules/payload/payload.actions';
import { getUser } from 'src/app/modules/payload/payload.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  // テスト用。後で消す。
  public userAddress: string;
  public user$: Observable<any>;


  ngOnInit(): void {
    this.store$.dispatch(userActions.add({user: { id: 'test'}}));
    this.store$.dispatch(testActions.add({test: {id: 'hey', name: 'hey'}}));
    this.user$ = this.store$.select(getUser);
  }

  constructor(private actions$: Actions, private store$: Store<any>) {}

}
