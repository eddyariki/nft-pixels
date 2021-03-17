import { ReadVarExpr } from '@angular/compiler';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
  constructor() { }

  ngOnInit(): void {
  }
  cancel() {
    this.cancelEmitter.emit(true);
  }
  handleFileInput(files: FileList) {
    const file = files[0];
    this.file = file;
  }

  onKey(event: any) {
    this.password = event.target.value;
    if(event.keyCode!==13){
      if(this.wrongPassword){
        this.wrongPassword = true;
      }
    }
    
  }

  login(event: any) {
    event.preventDefault();
    let fileReader = new FileReader();
    fileReader.readAsText(this.file);
    fileReader.onload = (e) => {
      const JSONBuffer = JSON.parse(fileReader.result.toString());
      const user = User.Login(JSONBuffer, this.password);
      if (!user.isLoggedIn) {
        console.log("wrong password")
        this.password = "";
        this.wrongPassword = true;
      } else {
        this.password = "";
        this.wrongPassword = false;
        this.loginEmitter.emit(user);
      }
    }
  }

}
