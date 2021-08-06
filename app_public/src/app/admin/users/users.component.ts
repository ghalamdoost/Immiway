import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  userList: User[]=[];
  loading = false;
  theName:any;
  constructor(private authenticationService: AuthenticationService, private _route:Router, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.userList=[]
    this.authenticationService.getUserList().subscribe((result:any)=>{
      result.forEach(x => {
        this.userList.push(x);
      });
    }, error=>{
      this._snackBar.open(error.error, error.status, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    })
  }
  Search(){
    if(this.theName == ""){
      this.ngOnInit();
    }else{
       this.userList = this.userList.filter(res =>{
        if(res.firstName.toLowerCase().match(this.theName.toLowerCase())!=null){
          return res.firstName.toLowerCase().match(this.theName.toLowerCase());
        }else{
          return res.lastName.toLowerCase().match(this.theName.toLowerCase());
        }
       })
    }
  }
}
