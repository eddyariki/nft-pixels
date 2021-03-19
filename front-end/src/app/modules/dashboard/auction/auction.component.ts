import { Component, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.less']
})
export class AuctionComponent implements OnInit {

  ngOnInit(): void {}

  constructor(private actions$: Actions, private store$: Store<any>) {}

}
