import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user';
import { Role } from '../../models/role';
import { Content } from 'src/app/models/content';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
  
  nav: Content[]=[];
  sub: Content[]=[];
  secondSub: Content[]=[];
  user: User;
  
  @Output() sidenavClose = new EventEmitter();
  
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
  
  get isAdmin() {
    return this.user && this.user.role === Role.Admin;
  }

  get isLogin(){
    return this.user?true:false;
  }

  logout=()=> {
      this.authenticationService.logout();
      this.onSidenavClose();
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }


  goToInfo=()=>{
    this._route.navigateByUrl('account/info');
    this.onSidenavClose();
  }

  goToChangepassword=()=>{
    this._route.navigateByUrl('account/changepassword');
    this.onSidenavClose();
  }

  goToDocumentList=()=>{
    this._route.navigateByUrl('account/documentlist');
    this.onSidenavClose();
  }

  goToClientlist=()=>{
    this._route.navigateByUrl('admin/clientlist');
    this.onSidenavClose();
  }

  goToMenuManagement=()=>{
    this._route.navigateByUrl('admin/content/menu');
    this.onSidenavClose();
  }

  goToContentManagement=()=>{
    this._route.navigateByUrl('admin/content/assign');
    this.onSidenavClose();
  }
  
  goToPublicStorage=()=>{
    this._route.navigateByUrl('admin/storage');
    this.onSidenavClose();
  }
}
