import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { Document } from '../models/document';
import { Content } from '../models/content';
import { Role } from '../models/role';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }


    getNav=()=>{
      return this.http.get<Content[]>(`${environment.exp_url}/content/nav`)
        .pipe(map(content=>{
          return content;
        }))
    }

    getHomeNav=()=>{
      return this.http.get<Content[]>(`${environment.exp_url}/content/homenav`)
        .pipe(map(content=>{
          return content;
        }))
    }

    getMenuList=(parentid?:string)=>{
      return this.http.get<Content[]>(`${environment.exp_url}/content/listbyparentid/${parentid}`)
        .pipe(map(content=>{
          return content;
        }))
    }

    removeContent=(id:string)=>{
      return this.http.delete<any>(`${environment.exp_url}/content/remove/${id}`)
            .pipe();
    }

    // addToMenu=(obj:Content)=>{
    //   return this.http.post<Content>(`${environment.exp_url}/content/new`, obj)
    //         .pipe();
    // }
    getContent=(parentid:string)=>{
      return this.http.get<Content>(`${environment.exp_url}/content/pagebyparentid/${parentid}`)
      .pipe(map(content=>{
        return content;
      }))
    }

    getPageByName=(pageTitle:string)=>{
      return this.http.get<Content>(`${environment.exp_url}/content/pagebyname/${pageTitle}`)
      .pipe(map(content=>{
        return content;
      }))
    }
    newPage=(primaryTitle:string, description:string, parentId:string)=>{
      return this.http.post<any>(`${environment.exp_url}/content/new`,{primaryTitle, description, parentId, priority:0, isNav:false, showOnHomePage:false})
          .pipe(map(content => {
              return content;
          }));
    }
    updatePage=(id:string, primaryTitle:string, description:string, parentId:string)=>{
      return this.http.put<any>(`${environment.exp_url}/content/update`,{contentid:id ,primaryTitle, priority:0, parentId, description, isNav:false, showOnHomePage:false})
          .pipe(map(content=>{
            return content;
          }))
    }

    addOrUpdateMenu=(editMode, primaryTitle: string, priority:number, showOnHomePage:boolean, contentid?:string, parentId?:string, imgURL?:string, description?:string)=>{
      if(editMode){
        return this.http.put<any>(`${environment.exp_url}/content/update`,{contentid ,primaryTitle, priority, showOnHomePage, parentId, imgURL, description})
          .pipe(map(content=>{
            return content;
          }))
      }else{
        return this.http.post<any>(`${environment.exp_url}/content/new`, { primaryTitle, priority, showOnHomePage, parentId, isNav:true, imgURL, description})
          .pipe(map(content => {
              return content;
          }));
      }      
    }

    login=(email: string, password: string) =>{
        return this.http.post<any>(`${environment.exp_url}/user/login`, { email, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    logout=()=> {
        // remove user from local storage to log user out
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/login']);
    }

    register=(formData:any)=>{
      return this.http.post<any>(`${environment.exp_url}/user/register`, formData)
            .pipe();
    }

    update=(formData:any,userid?:string)=>{
      if(this.userSubject.value.role===Role.Admin && userid!=null){
        return this.http.put<any>(`${environment.exp_url}/user/admin/clientinfo/updateinfo`,{formData,userid})
        .pipe(map(user=>{
          return user;
        }))
      }
      return this.http.put<any>(`${environment.exp_url}/user/account/updateinfo`,formData)
      .pipe(map(user=>{
        return user;
      }))
    }

    getUserInfo=(userid?:string)=>{
      if(this.userSubject.value.role===Role.Admin && userid!=null){
        return this.http.get<User>(`${environment.exp_url}/user/admin/clientinfo/${userid}`)
        .pipe(map(user=>{
          return user;
        }))
      }
        return this.http.get<User>(`${environment.exp_url}/user/account/info`)
        .pipe(map(user=>{
          return user;
        }))
    }

    changeUserPassword=(password?: string, newPassword?: string, userid?: string)=>{
      if(this.userSubject.value.role===Role.Admin && userid!=null){
        return this.http.put<any>(`${environment.exp_url}/user/admin/clientinfo/changepassword`,{ userid, newPassword })
        .pipe(map(result=>{
          return result;
        }))        
      }
      return this.http.put<any>(`${environment.exp_url}/user/account/changepassword`,{ password, newPassword })
      .pipe(map(result=>{
        return result;
      }))
    }

    getDocumentList=(userid?:string)=>{
      if(this.userSubject.value.role===Role.Admin && userid!=null){
        return this.http.get<Document[]>(`${environment.exp_url}/user/admin/clientinfo/${userid}/documentList`)
        .pipe(map(document=>{
          return document;
        }))
      }
      return this.http.get<Document[]>(`${environment.exp_url}/user/account/documentList`)
      .pipe(map(document=>{
        return document;
      }))
    }

    removeDocument=(docid:string, userid?:string)=>{
      if(this.userSubject.value.role===Role.Admin && userid!=null){
        return this.http.delete<any>(`${environment.exp_url}/user/admin/clientinfo/${userid}/document/${docid}/remove`)
        .pipe();
      }else{
        return this.http.delete<any>(`${environment.exp_url}/user/account/document/${docid}/remove`)
            .pipe();
      }      
    }

    upload(file: File,userid?:string): Observable<HttpEvent<any>> {
      const formData: FormData = new FormData();
      var header = new HttpHeaders();
      header.append('Content-Type', 'multipart/form-data')
      formData.append('file', file);
      let req=null;
      if(this.userSubject.value.role===Role.Admin && userid!=null){
        
        return this.http.post<any>(`${environment.exp_url}/user/admin/clientinfo/document/new/${userid}`,formData,{
            reportProgress: false,
            responseType: 'json',
            headers:header
          })
        .pipe(map(result=>{
          return result;
        })) 
      }else{
        return this.http.post<any>(`${environment.exp_url}/user/account/document/new`,formData,{
            reportProgress: false,
            responseType: 'json',
            headers:header
          })
        .pipe(map(result=>{
          return result;
        }))
      }
    }
    imageUpload(file: File,userid?:string): Observable<HttpEvent<any>> {
      debugger;
      const formData: FormData = new FormData();
      var header = new HttpHeaders();
      header.append('Content-Type', 'multipart/form-data')
      formData.append('file', file);
      let req=null;
      if(this.userSubject.value.role===Role.Admin && userid!=null){
        
        return this.http.post<any>(`${environment.exp_url}/storage/admin/new/`,formData,{
            reportProgress: false,
            responseType: 'json',
            headers:header
          })
        .pipe(map(result=>{
          return result;
        })) 
      }else{
        return this.http.post<any>(`${environment.exp_url}/storage/admin/new/`,formData,{
            reportProgress: false,
            responseType: 'json',
            headers:header
          })
        .pipe(map(result=>{
          return result;
        }))
      }
    }
    getImageList=(userid?:string)=>{
      if(this.userSubject.value.role===Role.Admin && userid!=null){
        return this.http.get<Document[]>(`${environment.exp_url}/storage/admin/list`)
        .pipe(map(document=>{
          return document;
        }))
      }
      return this.http.get<Document[]>(`${environment.exp_url}/storage/admin/list`)
      .pipe(map(document=>{
        return document;
      }))
    }
    removeImage=(docid:string, userid?:string)=>{
      if(this.userSubject.value.role===Role.Admin && userid!=null){
        return this.http.delete<any>(`${environment.exp_url}/storage/admin/${docid}/remove`)
        .pipe();
      }else{
        return this.http.delete<any>(`${environment.exp_url}/storage/admin/${docid}/remove`)
            .pipe();
      }      
    }
    downloadImage=(key:String,userid?:string)=>{
      if(this.userSubject.value.role===Role.Admin && userid!=null){
        return this.http.get(`${environment.exp_url}/storage/admin/${key}`);
      }else{
        return this.http.get(`${environment.exp_url}/storage/admin/${key}`);
      }        
    }
    newDocument=(doc:any)=>{
      const header = new HttpHeaders()
                    .set('content-type','application/x-www-form-urlencoded');

      return this.http.post<any>(`${environment.exp_url}/user/account/document/new`, doc,{'headers':header})
            .pipe();
    }

    downloadDocument=(key:String,userid?:string)=>{
      if(this.userSubject.value.role===Role.Admin && userid!=null){
        return this.http.get(`${environment.exp_url}/user/admin/clientinfo/${userid}/documentInfo/${key}`);
      }else{
        return this.http.get(`${environment.exp_url}/user/account/document/get/${key}`);
      }        
    }

    getUserList=()=>{
      return this.http.get<User[]>(`${environment.exp_url}/user/admin/clientlist`)
      .pipe(map(user=>{
        return user;
      }))
    }

    setrole=(role,userid)=>{
      return this.http.put<any>(`${environment.exp_url}/user/admin/clientinfo/setrole`,{role,userid})
      .pipe(map(result=>{
        return result;
      }))
    }

    getNewNotificationsCount = () => {
      if(this.userSubject.value && this.userSubject.value.role===Role.Admin){
        return this.http.get<number>(`${environment.exp_url}/notification/allnewcount`)
        .pipe(map(result=>{
          return result;
        }))
      }else{
        return of(null).pipe(map(()=>{
          return 0
        }))
      }
    }
}