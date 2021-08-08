import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { Role } from '../models/role';

@Component({
  selector: 'app-app-login',
  templateUrl: './app-login.component.html',
  styleUrls: ['./app-login.component.css']
})
export class AppLoginComponent implements OnInit {
  loginForm: FormGroup;
  user:User;
  loading = false;
  submitted = false;
  error = '';
  
  constructor(private formBuilder: FormBuilder, private _route:Router, private _snackBar: MatSnackBar, private authenticationService: AuthenticationService) { 
    // redirect to account/admin if already logged in
    if (this.authenticationService.userValue) { 
      this.authenticationService.user.subscribe(x=>{
        this._route.navigateByUrl('/');
      })      
    }
  }


  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit(){
    this.submitted = true;
    
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.authenticationService.login(this.f.email.value, this.f.password.value)
    .pipe(first())
    .subscribe((result:any) =>{
      if(result.role==Role.Admin.valueOf){
        this._route.navigateByUrl('admin');
      }else{
        this._route.navigateByUrl('/');      
      }      
    }, error => {
      this._snackBar.open(error.error, error.status, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: ['error-snackbar']
        
      });
    })
  }

}
