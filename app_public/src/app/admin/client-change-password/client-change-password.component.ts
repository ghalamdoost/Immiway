import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../services/authentication.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-client-change-password',
  templateUrl: './client-change-password.component.html',
  styleUrls: ['./client-change-password.component.css']
})
export class ClientChangePasswordComponent implements OnInit {

  changePasswordForm=new FormGroup({
    
    currentPassword: new FormControl('',Validators.required),
    newPassword: new FormControl('',Validators.required),    
  })
  loading = false;
  submitted = false;
  error = '';
  public userid: string;

  constructor(private formBuilder: FormBuilder, private _route:Router, private _snackBar: MatSnackBar, private authenticationService: AuthenticationService,private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.userid = this.activatedRoute.snapshot.paramMap.get('userid');
    this.changePasswordForm = this.formBuilder.group({
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

    this.authenticationService.changeUserPassword(null,this.f.newPassword.value,this.userid).pipe(first()).subscribe((result:any)=>{
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
