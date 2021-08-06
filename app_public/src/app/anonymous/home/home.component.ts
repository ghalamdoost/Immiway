import { Component, OnInit } from '@angular/core';
import { MatCarousel, MatCarouselComponent } from '@ngmodule/material-carousel';

import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user';
import { Role } from '../../models/role';
import { Content } from 'src/app/models/content';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  nav: Content[]=[];
  user: User;
  sub: Content[]=[];
  secondSub: Content[]=[];
  
  constructor(private _route:Router, private authenticationService: AuthenticationService, private _snackBar: MatSnackBar) {
    this.authenticationService.user.subscribe(x => this.user = x);
   }

  ngOnInit(): void {
    this.authenticationService.getHomeNav().subscribe((result:Content[])=>{
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
  
  // Slider Images
  slides = [
    {'image': 'https://firebasestorage.googleapis.com/v0/b/immiway-a00a5.appspot.com/o/hermes-rivera-ahHn48-zKWo-unsplash.jpg?alt=media&token=94b989e3-7396-44f6-9915-ff72b3297ab2'}, 
    {'image': 'https://firebasestorage.googleapis.com/v0/b/immiway-a00a5.appspot.com/o/alex-shutin-uhn-U0sSxFQ-unsplash.jpg?alt=media&token=36fead44-bc07-48c0-a5f9-13ded086a5dd'},    
    {'image': 'https://minayousefi.com/images/general/slider02.jpg'},    

  ];



  
}
