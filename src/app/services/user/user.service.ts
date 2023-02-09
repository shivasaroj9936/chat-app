import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(

  ) {}
  userDetails = {
    name: '',
    email: '',
    password: '',
    userId:'',
    socketId:'',
    commonId:''
  };
  setUserData(data:any){
    this.userDetails.name=data.name;
    this.userDetails.email=data.email;
    this.userDetails.password=data.password;
  }
  get getUserData(){
    return this.userDetails;
  }
  resetUserData(){
    this.userDetails.name='';
    this.userDetails.email='';
    this.userDetails.password='';
  }

}
