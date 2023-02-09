import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { PATTERN } from 'src/app/constants/regex';
import { ChatService } from 'src/app/services/chatService/chat.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hide = true;

  @ViewChild('email') email!:ElementRef
  constructor(
    private formBuilder: FormBuilder,
    private _router: Router,
    private user: UserService,
    private chatService:ChatService,
    private _snackBar: MatSnackBar,
    private title:Title

  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.title.setTitle('chatApp');
    this.chatService.setupConnection();
   }

  //  ngAfterViewInit(): void {
    // console.log(this.chatService.socket.connected);
    // if(!this.chatService.socket.active){
    //   setTimeout(() => {
    //     console.log(this.chatService.socket);

        
    //     this.openSnackBar('Please Check Your Connection!', 'Close', );
    //   }, 2000);
    // }
    // this.email.nativeElement.subscribe((val:any)=>{
    //   console.log(val);
      
    // })
    // console.log(this.email);
    
    
  //  }
  createForm() {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern((PATTERN.email))]],
      name: [null, [Validators.required, Validators.minLength(3),Validators.maxLength(20),Validators.pattern(PATTERN.name)]],
      password: [null, [ Validators.required,
      Validators.pattern(PATTERN.password )],]
    });
  }
  login() {
    this.loginForm.controls['name'].patchValue(this.loginForm.controls['name'].value?.trim());
    this.loginForm.controls['email'].patchValue(this.loginForm.controls['email'].value?.trim());
    this.loginForm.controls['password'].patchValue(this.loginForm.controls['password'].value?.trim());
    console.log(this.loginForm.value,'data user ');
    
    if (this.loginForm.valid) {
      let data={
        name:this.loginForm.controls['name'].value,
        email:this.loginForm.controls['email'].value,
        password:this.loginForm.controls['password'].value,
      }
      console.log(data,'data user ');
      
      this.chatService.isUserPresent(data);
      this.isUserAlreadyPresent();
    }
  }
  isUserAlreadyPresent(){
    this.chatService.getNotification().subscribe((notification:any)=>{
      // console.log(notification.isPresent,'notification');
      
      if(notification.isPresent==false){
        this.user.setUserData(this.loginForm.value);
        
        this._router.navigate(['/dashboard']);
      }else{
        // console.log(notification.isPresent,'user Present');
        this.openSnackBar('User Already Present!', 'Close', );
        this.loginForm.reset();

      }
    })
  }
  openSnackBar(message:any,action:string,) {
    this._snackBar.open(message,action, {
      duration: 2000,
      panelClass: ['failure-theme'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
