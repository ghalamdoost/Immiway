import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/user';
import { AuthenticationService } from '../services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
// import { PassThrough } from 'stream';
// import { ChangePasswordComponent } from '../account/change-password/change-password.component';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit {
  user:User;
  passwordPattern = "((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])|(?=.*[\\d~!@#$%^&*\\(\\)_+\\{\\}\\[\\]\\?<>|_]).{6,50})";
  emailPattern="[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}";
  constructor(private authenticationService: AuthenticationService, private _route:Router, private _snackBar: MatSnackBar) { }
  get password() {
    return this.registerForm.get('password');
  } 
  get email() {
    return this.registerForm.get('email');
  } 
  ngOnInit(): void {
  }
  onSubmit(){
    this.user = this.registerForm.value;
     this.authenticationService.register(this.registerForm.value).subscribe((result:any)=>{
      this._snackBar.open(result,'', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: ['info-snackbar']
      });
      this._route.navigateByUrl('login');
    }, error => {
      this._snackBar.open(error.error, error.status, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }) 

  }


  


  registerForm = new FormGroup({
    email: new FormControl('',Validators.required),
    password: new FormControl('',Validators.required) ,
    age: new FormControl('',Validators.required),
    phone: new FormControl('',[
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10)
    ]),
    firstName: new FormControl('',Validators.required),
    lastName: new FormControl('',Validators.required),
    address: new FormControl('',Validators.required),
    postalcodeOrZippCode: new FormControl('',Validators.required),
    country: new FormControl('',Validators.required),
    city : new FormControl('',Validators.required),
    provinceOrState :  new FormControl('',Validators.required),
    unit: new FormControl('',Validators.required)
  })

}
