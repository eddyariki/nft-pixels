import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Transaction } from '@elrondnetwork/erdjs/out';

export interface TransactionInfo{
  callFunction: string;
  value?: number;
  gasLimit?: number;
}

@Component({
  selector: 'app-transaction-modal',
  templateUrl: './transaction-modal.component.html',
  styleUrls: ['./transaction-modal.component.less']
})
export class TransactionModalComponent implements OnInit {
  @Input() transactionInfo: TransactionInfo;
  @Output() confirmEmitter = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  confirm(){
    this.confirmEmitter.emit(true);
  }

  cancel(){
    this.confirmEmitter.emit(false);
  }

}
