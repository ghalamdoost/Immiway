import { Component, OnInit  } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { MatSnackBar, MAT_SNACK_BAR_DEFAULT_OPTIONS_FACTORY } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Document } from '../../models/document';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';




@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {
  fileUrl;
  loading = false;
  submitted = false;
  selectedFile : File = null;
  documentList: Document[]=[];
  theTitle:any;

  constructor(private authenticationService: AuthenticationService,private _spinner:NgxSpinnerService,private sanitizer: DomSanitizer, private _route:Router, private _snackBar: MatSnackBar) { }
  ngOnInit(): void {
    this._spinner.show();
    this.authenticationService.getDocumentList().subscribe((result:any)=>{
      result.forEach(x => {
        this.documentList.push(x);
      });
      this._spinner.hide();
    }, error=>{
      this._spinner.hide();
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
  
  OnUploadFile() {
    this._spinner.show();
    this.authenticationService.upload(this.selectedFile).subscribe((result:any)=>{
      
      if(result != null){
        this.selectedFile = null;
        this._snackBar.open('File Uploaded', '200', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.documentList.length = 0;
        this.authenticationService.getDocumentList().subscribe((result:any)=>{
          result.forEach(x => {
            this.documentList.push(x);
          });
          this._spinner.hide();
        })
        
      }
      else{
        this._snackBar.open('Upload Failed', '400', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    }, error=>{
      if(error.error == 'Invalid dataType'){
        this._spinner.hide();
        this._snackBar.open(error.error, 'Try Again', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      this.selectedFile = null;
      }
      
    })

  }
  
  
  delete(fileKey:string){
    this._spinner.show();
    this.authenticationService.removeDocument(fileKey).subscribe((result:any)=>{
      if(result = 'Document has been Deleted.'){
        this._snackBar.open('File Deleted', '200', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.documentList.length = 0;
        this.authenticationService.getDocumentList().subscribe((result:any)=>{
          result.forEach(x => {
            this.documentList.push(x);
          });
        })
      }else{
        this._snackBar.open('Unable to Delete File', 'Try Again', {
          duration: 2000,
          panelClass: ['red-snackbar']
        });
      }
      this._spinner.hide();
    })
  }


  downloadFile(fileKey:string,dataType:any,dataTitle:any){
    this._spinner.show();
    this.authenticationService.downloadDocument(fileKey).subscribe((result:any )=> {
      var link = document.createElement('a');
      link.href = "data:"+dataType+";base64,"+result.data
      var fileName = dataTitle;
      link.download = fileName;
      link.click();
      this._spinner.hide();
    })
  }

  Search(){
    if(this.theTitle == ""){
      this.ngOnInit();
    }else{
       this.documentList = this.documentList.filter(res =>{
         debugger;
        if(res.title.toLowerCase().match(this.theTitle.toLowerCase())!=null){
          return res.title.toLowerCase().match(this.theTitle.toLowerCase());
        }                  
       })
    }
  }
} 
