import { ReadVarExpr } from '@angular/compiler';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UseExistingWebDriver } from 'protractor/built/driverProviders';
import { User } from 'src/app/contract-interface/user';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.less']
})
export class LoginModalComponent implements OnInit {
  @Output() cancelEmitter = new EventEmitter<boolean>();
  @Output() loginEmitter = new EventEmitter<User>();
  public password: string;
  public file: File;
  public wrongPassword: boolean;
  public loginSucceeded: boolean;
  public user: User;
  constructor() { }

  ngOnInit(): void {
  }
  cancel(): void {
    this.cancelEmitter.emit(true);
  }

  handleFileInput(files: FileList): void {
    const file = files[0];
    this.file = file;
  }

  close(){
    this.loginEmitter.emit(this.user);
  }

  onKey(event: any): void {
    if (event.keyCode === 13) {
    } else {
      this.password = event.target.value;
      this.wrongPassword = false;
    }
  }

  login(event: any): void{
    event.preventDefault();

    if (event.keyCode === 13){
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsText(this.file);
    fileReader.onload = (e) => {
      const JSONBuffer = JSON.parse(fileReader.result.toString());
      const user = User.Login(JSONBuffer, this.password);
      if (!user.isLoggedIn) {
        console.log('wrong password');
        this.password = '';
        this.wrongPassword = true;
      } else {
        this.password = '';
        this.wrongPassword = false;
        this.user = user;
        this.loginSucceeded = true;

        
      }
    };
  }

}
