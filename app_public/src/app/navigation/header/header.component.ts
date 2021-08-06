import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user';
import { Role } from '../../models/role';
import { Content } from 'src/app/models/content';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  nav: Content[]=[];
  sub: Content[]=[];
  secondSub: Content[]=[];
  user: User; 
  notif:number=0;

  @Output() public sidenavToggle = new EventEmitter();

  constructor(private _route:Router, private authenticationService: AuthenticationService, private _snackBar: MatSnackBar) { 
    this.authenticationService.user.subscribe(x => this.user = x); 
  }

  ngOnInit(): void {
    this.authenticationService.getNav().subscribe((result:Content[])=>{
      result.forEach(x => {
        this.nav.push(x);
      });
      this.sortByPriority(this.nav);
    }, error=>{
      this._snackBar.open(error.error, error.status, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    })
  }

  sortByPriority=(list)=>{
    list.sort((a, b) => (a.priority > b.priority ? 1 : -1))
    list.forEach(item => {
      if(item.subList.length>0){
        this.sortByPriority(item.subList);
      }
    });
  }

  navItems=(id:string)=>{
    this.sub=[];
    var temp=this.nav.find(x=>x._id==id)
    temp.subList.forEach(element => {
      this.sub.push(element)
    });
  }

  navSubItems=(id:string)=>{
    this.secondSub=[];
    var temp=this.sub.find(x=>x._id==id)
    temp.subList.forEach(d=>{
      this.secondSub.push(d)
    })
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }
  
  get isAdmin() {
    return this.user && this.user.role === Role.Admin;
  }

  get isLogin(){
    return this.user?true:false;
  }

  logout() {
    this.notif=0;
    this.authenticationService.logout();
  }

  openInfo() {
    
  }

  openPasswordChange() {
  }

}
