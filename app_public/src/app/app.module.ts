import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppLoginComponent } from './app-login/app-login.component';
import {FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserRegisterComponent } from './user-register/user-register.component';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from './navigation/header/header.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatListModule } from '@angular/material/list';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { MatMenuModule } from "@angular/material/menu";
import { AboutusComponent } from './anonymous/aboutus/aboutus.component'
import { ContactusComponent } from './anonymous/contactus/contactus.component'
import {MatSnackBarModule} from '@angular/material/snack-bar'
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { InfoComponent } from './account/info/info.component';
import { ChangePasswordComponent } from './account/change-password/change-password.component';
import { DocumentsComponent } from './account/documents/documents.component';
import { MatInputModule } from '@angular/material/input';
import { UsersComponent } from './admin/users/users.component';
import { ClientInfoComponent } from './admin/client-info/client-info.component';
import { MatRadioModule } from '@angular/material/radio';
import { ClientDocumentsComponent } from './admin/client-documents/client-documents.component';
import { ClientChangePasswordComponent } from './admin/client-change-password/client-change-password.component';
import { MenuManagementComponent , MenuManagementDialogComponent} from './admin/nav-management/nav-management.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BreadcrumbComponent } from './navigation/breadcrumb/breadcrumb.component';
import { ContentManagementComponent } from './admin/content-management/content-management.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { PageContentComponent } from './anonymous/page-content/page-content.component';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
//import {Ng2OrderPipe} from 'ng2-order-pipe';
import {NgxPaginationModule} from 'ngx-pagination';
import { EditorModule } from "@tinymce/tinymce-angular";
import { FooterComponent } from './navigation/footer/footer.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HomeComponent } from './anonymous/home/home.component';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { StorageComponent } from './admin/storage/storage.component';
import {MatBadgeModule} from '@angular/material/badge';



@NgModule({
  declarations: [
    AppComponent,
    AppLoginComponent,
    UserRegisterComponent,
    HeaderComponent,
    SidenavListComponent,
    AboutusComponent,
    ContactusComponent,
    InfoComponent,
    ChangePasswordComponent,
    DocumentsComponent,
    UsersComponent,
    ClientInfoComponent,
    ClientDocumentsComponent,
    ClientChangePasswordComponent,
    MenuManagementComponent,
    MenuManagementDialogComponent,
    BreadcrumbComponent,
    ContentManagementComponent,
    PageContentComponent,
    FooterComponent,
    HomeComponent,
    StorageComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    MatListModule,
    MatMenuModule,
    MatSnackBarModule,
    MatCardModule,
    MatTableModule,
    MatInputModule,
    MatRadioModule,
    MatDialogModule,
    MatExpansionModule,
    Ng2SearchPipeModule,
    //Ng2OrderPipe,
    NgxPaginationModule,
    EditorModule,
    NgxSpinnerModule,
    NgxSpinnerModule,
    MatCarouselModule.forRoot(),
    MatBadgeModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
