import { Component, OnInit, Inject } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { Content } from 'src/app/models/content';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../models/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-content-management',
  templateUrl: './content-management.component.html',
  styleUrls: ['./content-management.component.css']
})
export class ContentManagementComponent implements OnInit {
  list: Content[]=[];
  seclist: Content[]=[];
  thirdlist:Content[]=[];
  temp: Content;
  user: User;
  step = 0;
  listControl = new FormControl();
  sub:boolean=false;
  secondSub:boolean=false;
  lastSelectedId:string;
  isFinalSelect:boolean=false;
  lastSelectedTitle:string='-';
  retrievedId:string='';

  pageForm = new FormGroup({
    _id:new FormControl(''),
    primaryTitle: new FormControl('', Validators.required),   
    description: new FormControl('',Validators.required),
    parentId: new FormControl(0),
    priority: new FormControl(0),
    isNav: new FormControl(false),
    subList: new FormControl([]),
  })
  
  constructor(private _route:Router, private authenticationService: AuthenticationService, private _snackBar: MatSnackBar) { 
    this.authenticationService.user.subscribe(x => this.user = x);
  }

  ngOnInit(): void {
    this.authenticationService.getNav().subscribe((result:Content[])=>{
      result.forEach(x => {
        this.list.push(x);
      });
      this.sortByPriority(this.list);
    }, error=>{
      this._snackBar.open(error.error, error.status, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    })
  }


  firstCheck=(number, id)=>{
    this.secondSub=false;
    this.isFinalSelect=false;
    number>0 ? this.sub=true : this.sub=false;
    this.temp=this.list.filter(x=>x._id==id)[0];
    this.seclist=[]
    if(this.temp.subList){
      this.temp.subList.length==0 ? this.isFinalSelect=true : this.isFinalSelect=false;
      this.lastSelectedId=id;
      this.lastSelectedTitle=this.temp.primaryTitle;
      this.temp.subList.forEach(x=>{
        this.seclist.push(x);
      })
    }
    
  }

  secondCheck=(number,id)=>{
    this.isFinalSelect=false;
    number>0 ? this.secondSub=true : this.secondSub=false;    
    this.temp=this.seclist.filter(x=>x._id==id)[0];
    this.thirdlist=[]
    if(this.temp.subList){
      this.temp.subList.length==0 ? this.isFinalSelect=true : this.isFinalSelect=false;
      this.lastSelectedId=id;
      this.lastSelectedTitle=this.temp.primaryTitle;
      this.temp.subList.forEach(x=>{
        this.thirdlist.push(x);
      })
    }
  }

  thirdCheck=(number,id)=>{
    this.isFinalSelect=false;
    this.temp=this.thirdlist.filter(x=>x._id==id)[0];
    this.temp.subList && this.temp.subList.length==0 ? this.isFinalSelect=true : this.isFinalSelect=false;
    this.lastSelectedId=id;
    this.lastSelectedTitle=this.temp.primaryTitle;
  }


  sortByPriority=(list)=>{
    list.sort((a, b) => (a.priority > b.priority ? 1 : -1))
    list.forEach(item => {
      if(item.subList.length>0){
        this.sortByPriority(item.subList);
      }
    });
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    if(this.isFinalSelect){
      this.step++;
      this.authenticationService.getContent(this.lastSelectedId).subscribe((result:any)=>{
        if(result._id!=null){
          this.retrievedId=result._id;
          this.pageForm.patchValue({
            _id:result._id,
            primaryTitle:result.primaryTitle,
            description:result.description,
            parentId:result.parentId,
            priority:result.priority,
            isNav:result.isNav,
            subList:result.subList
          })
          this._snackBar.open("Edit Mode", "200", {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        }else if(result){
          this.pageForm.patchValue({
            primaryTitle:'',
            description:''
          });
          this._snackBar.open(result, "200", {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        }else{
          this.pageForm.patchValue({
            parentId:this.lastSelectedId,
            isNav:false,
            subList:[],
            priority:0
          })
          this._snackBar.open("Now Create the related page", "200", {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        }     
      }, error=>{
        this._snackBar.open(error.statusText, error.status, {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      })    
    }else{
      this._snackBar.open("select the last option", '403', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  onSubmit(){
    if (this.pageForm.invalid) {
      return;
    }
    if(this.pageForm.controls._id.value!=''){
      this.authenticationService.updatePage(this.pageForm.controls._id.value,this.pageForm.controls.primaryTitle.value,this.pageForm.controls.description.value,this.lastSelectedId).pipe(first()).subscribe((result:any)=>{
        this._snackBar.open("ok", '201', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }, error=>{
        this._snackBar.open(error.error, error.status, {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      })
    }else{
      this.authenticationService.newPage(this.pageForm.controls.primaryTitle.value,this.pageForm.controls.description.value,this.lastSelectedId).pipe(first()).subscribe((result:any)=>{
        this._snackBar.open("ok", '201', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: ['success-snackbar']
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
  }

  delete=()=>{
    this.authenticationService.removeContent(this.retrievedId).subscribe((result:any)=>{
      
      // this.list=this.list.filter(x=>x._id!==id);
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
