import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { routes } from './app.routes';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SideBarComponent } from './work-space/side-bar/side-bar.component';
import { DocumentListComponent } from './work-space/side-bar/document-list/document-list.component';
import { CodeListComponent } from './work-space/side-bar/code-list/code-list.component';
import { ContentComponent } from './work-space/content/content.component';
import { FooterComponent } from './footer/footer.component';
import { DocumentsComponent } from './work-space/content/documents/documents.component';
import { CodeItemComponent } from './work-space/side-bar/code-list/code-item/code-item.component';
import { DocumentItemComponent } from './work-space/side-bar/document-list/document-item/document-item.component';
import { DocumentModalComponent } from './header/document-modal/document-modal.component';
import { QuoteModalComponent } from './header/quote-modal/quote-modal.component';
import { MemoModalComponent } from './header/memo-modal/memo-modal.component';
import { CodeModalComponent } from './header/code-modal/code-modal.component';
import { DocumentService } from './shared/services/document.service';
import { DocumentsTabsComponent } from './work-space/content/documents/documents-tabs/documents-tabs.component';
import { DocumentContentComponent } from './work-space/content/documents/document-content/document-content.component';
import { WorkSpaceComponent } from './work-space/work-space.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './shared/auth.guard';
import { AuthService } from './shared/services/auth.service';
import { Router } from '@angular/router';
import { LoginComponent } from './home/login/login.component';
import { SignupComponent } from './home/signup/signup.component';
import { UserService } from './shared/services/user.service';
import { AuthHttp } from './shared/helpers/authHttp.helper';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SideBarComponent,
    DocumentListComponent,
    CodeListComponent,
    ContentComponent,
    FooterComponent,
    DocumentsComponent,
    CodeItemComponent,
    DocumentItemComponent,
    DocumentModalComponent,
    QuoteModalComponent,
    MemoModalComponent,
    CodeModalComponent,
    DocumentsTabsComponent,
    DocumentContentComponent,
    WorkSpaceComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(routes, {useHash: true})
  ],
  providers: [DocumentService,
    AuthGuard,
    AuthService,
    AuthHttp,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
