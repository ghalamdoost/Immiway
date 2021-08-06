import { Component, OnInit, Inject } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { Content } from 'src/app/models/content';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-nav-management',
  templateUrl: './nav-management.component.html',
  styleUrls: ['./nav-management.component.css']
})
export class MenuManagementComponent implements OnInit {
  list:Content[]=[];
  dialogResult:any;
  parentId:string=null;
  newurl:string;
  ss:any;
  orgId:string=null;
  title:any;

  constructor(private _route:Router, private authenticationService: AuthenticationService, private _snackBar: MatSnackBar, public dialog: MatDialog, private _activatedRoute:ActivatedRoute) { }

  ngOnInit(fromparent?:string): void {
    
    this.list=[]
    this.parentId=fromparent?fromparent:(this._route.url.split('/')[this._route.url.split('/').length-1]!="menu"?this._route.url.split('/')[this._route.url.split('/').length-1]:null);

      this.authenticationService.getMenuList(this.parentId).subscribe((result:Content[])=>{

        result.forEach(x => {
          this.list.push(x);
        });
        this.list.sort((a, b) => (a.priority > b.priority ? 1 : -1))
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
    if(this.title==""){
      this.ngOnInit()
    }else{
      this.list = this.list.filter(res =>{
        return res.primaryTitle.toLocaleLowerCase().match(this.title.toLocaleLowerCase());
      })
    }
  }


  goToEditMode=(nav)=>{
    const dialogRef = this.dialog.open(MenuManagementDialogComponent, {     
      data: {editMode:true,data:nav}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.dialogResult = result;
      this.reload();
    });
  }

  goToAdd=()=>{
    const dialogRef = this.dialog.open(MenuManagementDialogComponent, {
      data:{editMode:false, data:this.parentId}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.dialogResult = result;
      this.reload();      
    });
  }

  reload(){
    this.list=[];
    this.ngOnInit();
  }

  load=(parentid,orgid?)=>{
    this._route.navigate([`/admin/content/menu/${parentid!=null?parentid:''}`]);
    this.orgId=orgid;
    this.list=[];
    this.ngOnInit(parentid);
  }

  delete=(id)=>{
    this.authenticationService.removeContent(id).subscribe((result:any)=>{
      
      this.list=this.list.filter(x=>x._id!==id);
      this._snackBar.open(result,'200', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }, error =>{
      this._snackBar.open(error.error, error.status, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    })
  }

}


@Component({
  selector: 'app-nav-management-dialog',
  templateUrl: './nav-management-dialog.component.html',
  styleUrls: ['./nav-management.component.css']
})
export class MenuManagementDialogComponent implements OnInit{
  obj:any;
  // newContent:Content
  form: FormGroup;
  editMode=true;
  id:string=null;
  parentid:string=null;


  constructor(
    public dialogRef: MatDialogRef<MenuManagementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private authenticationService: AuthenticationService, private _snackBar: MatSnackBar, private formBuilder: FormBuilder, private _route:Router) {this.editMode=data.editMode, this.obj=data.data;}


    ngOnInit(): void{
      this.form = this.formBuilder.group({
        id:[this.obj && this.obj._id ? this.obj._id : null],
        parentid:[this.obj && this.obj._id ? this.obj.parentId : null],
        primaryTitle: [this.obj && this.obj.primaryTitle ? this.obj.primaryTitle : '', Validators.required],
        priority: [this.obj && this.obj.priority ? this.obj.priority : 0, Validators.required],
        imgURL: [this.obj && this.obj.imgURL ? this.obj.imgURL : ''],
        description: [this.obj && this.obj.description ? this.obj.description : ''],
        showOnHomePage: [this.obj && this.obj.showOnHomePage ? this.obj.showOnHomePage : false]
      });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit():void{
      // stop here if form is invalid
      if (this.form.invalid) {
        return;
      }

      if(this.editMode){
        this.id=this.f.id.value;
        this.parentid=this._route.url.split('/')[this._route.url.split('/').length-1];
        this.parentid=this.f.parentid.value;
      }else{
        this.id=null;
        this.parentid=this.obj
      }

      this.authenticationService.addOrUpdateMenu(this.editMode, this.f.primaryTitle.value, this.f.priority.value, this.f.showOnHomePage.value ,this.id, this.parentid, this.f.imgURL.value, this.f.description.value).subscribe((result:any)=>{
        this._snackBar.open("ok", '201', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }, error=>{
        this._snackBar.open(error.statusText, error.status, {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      })
    }

}