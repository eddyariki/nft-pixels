import { Component, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-change-color',
  templateUrl: './change-color.component.html',
  styleUrls: ['./change-color.component.less']
})
export class ChangeColorComponent implements OnInit {

  ngOnInit(): void {}

  constructor(private actions$: Actions, private store$: Store<any>) {}

}
