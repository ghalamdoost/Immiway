import { Component, OnInit } from '@angular/core';
import { ActivatedRoute , NavigationEnd} from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-page-content',
  templateUrl: './page-content.component.html',
  styleUrls: ['./page-content.component.css'],
})
export class PageContentComponent implements OnInit {

  pageName:string='';
  primaryTitle:string='';
  description;
  navigationSubscription;

  constructor(private authenticationService: AuthenticationService, private _route:Router, private _snackBar: MatSnackBar,private activatedRoute: ActivatedRoute,private sanitizer: DomSanitizer) { 
    this.navigationSubscription = this._route.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });
  }

  initialiseInvites() {
    // Set default values and re-fetch any data you need.
    this.getData();
  }

  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we  
    // don't then we will continue to run our initialiseInvites()   
    // method on every navigationEnd event.
    if (this.navigationSubscription) {  
       this.navigationSubscription.unsubscribe();
    }
  }


  ngOnInit(): void {
    this.getData();      
  }

  getData():void{
    this.pageName = this.activatedRoute.snapshot.paramMap.get('pagetitle');
    this.authenticationService.getPageByName(this.pageName).subscribe((result:any)=>{
      if(result._id!=null){
        this.primaryTitle=result.primaryTitle;
        this.description=this.sanitizer.bypassSecurityTrustHtml(result.description);
      }else{
        this.primaryTitle='';
        this.description='';
        this._snackBar.open("error", "400", {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }     
    }, error=>{
      this.primaryTitle='';
      this.description='';
      this._snackBar.open(error.statusText, error.status, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }) 
  }

}
