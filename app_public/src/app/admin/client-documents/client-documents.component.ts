import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Document } from '../../models/document';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-client-documents',
  templateUrl: './client-documents.component.html',
  styleUrls: ['./client-documents.component.css']
})
export class ClientDocumentsComponent implements OnInit {

  documentList: Document[]=[];
  selectedFile : File;
  fileName='';
  uploadFormData = new FormData();
  public userid: string;

  constructor(private authenticationService: AuthenticationService,private _spinner:NgxSpinnerService, private _route:Router, private _snackBar: MatSnackBar,private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.userid = this.activatedRoute.snapshot.paramMap.get('userid');

    this.authenticationService.getDocumentList(this.userid).subscribe((result:any)=>{
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
  
  OnUploadFile() {
    this.userid = this.activatedRoute.snapshot.paramMap.get('userid');
    this._spinner.show();
    this.authenticationService.upload(this.selectedFile,this.userid).subscribe((result:any)=>{
      if(result!=null){
        this.selectedFile = null;
        this._snackBar.open('File Uploaded Successfuly', 'Close', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 2000,
          panelClass: ['success-snackbar']
        });
        this.documentList.length = 0;
        this.authenticationService.getDocumentList(this.userid).subscribe((result:any)=>{
          result.forEach(x => {
            
            this.documentList.push(x);

          });
          this._spinner.hide();
        })
        
      }
    })

  }

  delete(fileKey:string){
    this._spinner.show();
    this.authenticationService.removeDocument(fileKey,this.userid).subscribe((result:any)=>{
      if(result = 'Document has been Deleted.'){
        this._snackBar.open('File Deleted Successfuly', 'Close', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 2000,
          panelClass: ['success-snackbar']
        });
        this.documentList.length = 0;
        this.authenticationService.getDocumentList(this.userid).subscribe((result:any)=>{
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

  downloadFile(fileKey:string,dataType:any,dataTitle:any){
    this._spinner.show();
    this.authenticationService.downloadDocument(fileKey,this.userid).subscribe((result:any )=> {
      var link = document.createElement('a');
      link.href = "data:"+dataType+";base64,"+result.data
      var fileName = dataTitle;
      link.download = fileName;
      link.click();
      this._spinner.hide();
    })
  }

}
