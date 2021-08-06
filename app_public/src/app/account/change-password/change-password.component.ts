import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm=new FormGroup({
    
    currentPassword: new FormControl('',Validators.required),
    newPassword: new FormControl('',Validators.required),    
  })
  loading = false;
  submitted = false;
  error = '';

  constructor(private formBuilder: FormBuilder, private _route:Router, private _snackBar: MatSnackBar, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      password: ['', Validators.required],
      newPassword: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.changePasswordForm.controls; }

  onSubmit(){

    this.submitted = true;
    
    // stop here if form is invalid
    if (this.changePasswordForm.invalid) {
      return;
    }

    this.loading = true;


    this.authenticationService.changeUserPassword(this.f.password.value, this.f.newPassword.value).pipe(first()).subscribe((result:any)=>{
      this._snackBar.open('Password has been updated.', '201', {
        horizontalPosition: 'center',
        verticalPosition: 'top',  
        duration: 3000,
        panelClass: ['success-snackbar']
      });
      this.ngOnInit();
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
