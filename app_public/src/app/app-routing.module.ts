import { NgModule, OnInit } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppLoginComponent } from './app-login/app-login.component';
import { AuthGuard } from './_helpers/auth.guard';
import { UserRegisterComponent } from './user-register/user-register.component';
import { AboutusComponent } from './anonymous/aboutus/aboutus.component';
import { ContactusComponent } from './anonymous/contactus/contactus.component';
import { InfoComponent } from './account/info/info.component';
import { ChangePasswordComponent } from './account/change-password/change-password.component';
import { DocumentsComponent } from './account/documents/documents.component';
import { UsersComponent } from './admin/users/users.component';
import { ClientInfoComponent } from './admin/client-info/client-info.component';
import { ClientDocumentsComponent } from './admin/client-documents/client-documents.component';
import { ClientChangePasswordComponent } from './admin/client-change-password/client-change-password.component';
import { MenuManagementComponent } from './admin/nav-management/nav-management.component';
import { ContentManagementComponent } from './admin/content-management/content-management.component';
import { PageContentComponent } from './anonymous/page-content/page-content.component';
import { HomeComponent } from './anonymous/home/home.component';
import { StorageComponent } from './admin/storage/storage.component';

const routes: Routes = [  
  
  {path:'register',component:UserRegisterComponent, data:{breadcrumb:'Register'}},
  {path:'login',component:AppLoginComponent, data:{breadcrumb:'Login'}},
  {path:'admin', data:{breadcrumb:'Admin'}, children:[
    {path:'clientlist',component:UsersComponent,canActivate:[AuthGuard], data:{breadcrumb:'User List'}},
    {path:'clientinfo',canActivate:[AuthGuard], data:{breadcrumb:'User List'}, children:[
      {path:':userid',canActivate:[AuthGuard], children:[
        {path:'',component:ClientInfoComponent,canActivate:[AuthGuard],data:{breadcrumb:'User Info'}},
        {path:'documents',component:ClientDocumentsComponent,canActivate:[AuthGuard], data:{breadcrumb:'User Document List'}},
        {path:'changepassword',component:ClientChangePasswordComponent,canActivate:[AuthGuard], data:{breadcrumb:'User Change Password'}},
      ]},             
    ]},
    {path:'content',canActivate:[AuthGuard], children:[
      {path:'assign', data:{breadcrumb:'Content Management'},canActivate:[AuthGuard], children:[
        {path:'',component:ContentManagementComponent,canActivate:[AuthGuard],}
      ]},
      {path:'menu',data:{breadcrumb:'Menu Management'}, children:[
        {path:'',component:MenuManagementComponent,canActivate:[AuthGuard], },
        {path:':menuid',component:MenuManagementComponent,canActivate:[AuthGuard], children:[
          {path:'',component:MenuManagementComponent,canActivate:[AuthGuard], data:{breadcrumb:'Menu Item'}},
        ]},
      ]}
      
    ]},
    {path:'storage', canActivate:[AuthGuard], data:{breadcrumb:'Public Storage'}, children:[
      {path:'',component:StorageComponent,canActivate:[AuthGuard], }
    ]}
  ]},
  {path:'account',canActivate:[AuthGuard], data:{breadcrumb:'Account'}, children:[
    {path:'documentlist',component:DocumentsComponent,canActivate:[AuthGuard], data:{breadcrumb:'Document List'}},
    {path:'info',component:InfoComponent,canActivate:[AuthGuard], data:{breadcrumb:'Info'}},
    {path:'changepassword',component:ChangePasswordComponent,canActivate:[AuthGuard], data:{breadcrumb:'Change Password'}},
  ]},
  
  
  {path:'aboutus',component:AboutusComponent, data:{breadcrumb:'Aboutus'}},
  {path:'contactus',component:ContactusComponent, data:{breadcrumb:'Contactus'}},
  

  {path:':pagetitle', component:PageContentComponent,data:{breacrumb:''},runGuardsAndResolvers: 'always',},
  // otherwise redirect to home
  { path: '**', component:HomeComponent, redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule implements OnInit { 

  ngOnInit(){}

  

}
