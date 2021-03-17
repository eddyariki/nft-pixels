import { ReadVarExpr } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/contract-interface/user';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.less']
})
export class LoginModalComponent implements OnInit {
  public password: string;
  public file: File;
  constructor() { }

  ngOnInit(): void {
  }

  handleFileInput(files: FileList){
    const file = files[0];
    this.file = file;
  }

  onKey(event:any){
    this.password = event.target.value;
  }

  login(event:any) {
    event.preventDefault();
    let fileReader = new FileReader();
    fileReader.readAsText(this.file);
    
    fileReader.onload=(e)=>{
      const JSONBuffer = JSON.parse(fileReader.result.toString());
      console.log(JSONBuffer);
      console.log(this.password)
      const user = User.Login(JSONBuffer, this.password);
      console.log(user);
    }
   
    


    // const user = User.Login(this.file, this.password);
    // console.log(user)
  }
}
