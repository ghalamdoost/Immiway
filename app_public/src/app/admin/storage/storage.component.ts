import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.css']
})
export class StorageComponent implements OnInit {
  
  selectedFile : File;
  documentList: Document[]=[];
  public userid: string;
  theTitle:any;

  constructor(private authenticationService: AuthenticationService,private _spinner:NgxSpinnerService, private _route:Router, private _snackBar: MatSnackBar,private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.userid = this.activatedRoute.snapshot.paramMap.get('userid');
    this.authenticationService.getImageList().subscribe((result:any)=>{
      result.forEach(x => {
        this.documentList.push(x);
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


  onFileUpload(event){
    this.selectedFile = event.target.files[0];
  }

  OnUploadImage() {
    //this._spinner.show();
    this.userid = this.activatedRoute.snapshot.paramMap.get('userid');
     this._spinner.show();
     this.authenticationService.imageUpload(this.selectedFile,this.userid).subscribe((result:any)=>{
       if(result!=null){
         this.selectedFile = null;
         //this._spinner.hide();
         this._snackBar.open('File Uploaded Successfuly', 'Close', {
           horizontalPosition: 'center',
           verticalPosition: 'top',
           duration: 2000,
           panelClass: ['success-snackbar']
         });
          this.documentList.length = 0;
         this.authenticationService.getImageList(this.userid).subscribe((result:any)=>{
           result.forEach(x => {
            
             this.documentList.push(x);

           });
           this._spinner.hide();
         }) 
        
       }
     }) 

  }

  downloadFile(url:string,name:any){
    var link = document.createElement('a');
    link.href = url
    var fileName = name;
    link.download = fileName;
    link.click();
  }

  delete(fileKey:string){
     this._spinner.show();
     this.authenticationService.removeImage(fileKey,this.userid).subscribe((result:any)=>{
       if(result = 'Document has been Deleted.'){
         this._snackBar.open('File Deleted Successfuly', 'Close', {
           horizontalPosition: 'center',
           verticalPosition: 'top',
           duration: 2000,
           panelClass: ['success-snackbar']
         });
         this.documentList.length = 0;
         this.authenticationService.getImageList().subscribe((result:any)=>{
           result.forEach(x => {
             this.documentList.push(x);
           });
         })
       }else{
         this._snackBar.open('Unable to Delete File', 'Try Again', {
           horizontalPosition: 'center',
           verticalPosition: 'top',
           duration: 2000,
           panelClass: ['error-snackbar']
         });
       }
       this._spinner.hide();
     })
  }

  Search(){
    if(this.theTitle == ""){
      this.ngOnInit();
    }else{
       this.theTitle = this.theTitle.filter(res =>{
          return res.title.toLowerCase().match(this.theTitle.toLowerCase());        
       })
    }
  }
}
