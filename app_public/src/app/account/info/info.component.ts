import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user';
import { AuthenticationService } from '../../services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {
  
  user:User;
  loading = false;
  submitted = false;

  updateForm = new FormGroup({
    _id:new FormControl('', Validators.required),
    email: new FormControl({ value:'', disabled: true }, Validators.required),
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

  constructor(private authenticationService: AuthenticationService, private _route:Router, private _snackBar: MatSnackBar) { }



  ngOnInit(): void {
    this.authenticationService.getUserInfo().subscribe((result:any)=>{
      this.updateForm.patchValue({
        _id:result._id,
        firstName:result.firstName,
        lastName:result.lastName,
        age:result.age,
        phone:result.phone,
        email:result.email,
        address:result.address,
        unit:result.unit,
        postalcodeOrZippCode:result.postalcodeOrZippCode,
        country:result.country,
        city:result.city,
        provinceOrState:result.provinceOrState
      })
    }, error=>{
      this._snackBar.open(error.statusText, error.status, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    })
  }

  onSubmit(){

    this.submitted = true;
    
    // stop here if form is invalid
    if (this.updateForm.invalid) {
      return;
    }
    this.loading = true;


    this.authenticationService.update(this.updateForm.value).pipe(first()).subscribe((result:any)=>{
      this._snackBar.open('Info has been updated.', '201', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: ['success-snackbar']
      });
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
