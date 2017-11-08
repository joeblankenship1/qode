import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
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
import { CodeService } from './shared/services/code.service';
import { ProjectService } from './shared/services/project.service';
import { DocumentsTabsComponent } from './work-space/content/documents/documents-tabs/documents-tabs.component';
import { DocumentContentComponent } from './work-space/content/documents/document-content/document-content.component';
import { WorkSpaceComponent } from './work-space/work-space.component';
import { ProjectsComponent } from './my-projects/projects/projects.component';
import { ProjectItemComponent } from './my-projects/projects/project-item/project-item.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { AuthService } from './shared/services/auth.service';
import { Router } from '@angular/router';
import { LoginComponent } from './home/login/login.component';
import { SignupComponent } from './home/signup/signup.component';
import { UserService } from './shared/services/user.service';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { ContextMenuModule, ContextMenuService } from 'ngx-contextmenu';
import { OptionsComponent } from './shared/helpers/options/options.component';
import { WindowSelection } from './shared/helpers/window-selection';
import { QuoteService } from './shared/services/quote.service';
import { WorkSpaceService } from './shared/services/work-space.service';


import {DataTableModule} from 'angular2-datatable';
import {InlineEditorModule} from 'ng2-inline-editor';
import { WorkSpaceResolver } from './shared/resolves/work-space.resolver';
import { DataFilterPipe } from './my-projects/projects/data-filter.pipe';
import { ProjectShareModalComponent } from './my-projects/project-share-modal/project-share-modal.component';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProjectDeleteModalComponent } from './my-projects/project-delete-modal/project-delete-modal.component';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    tokenName: 'access_token',
    tokenGetter: (() => localStorage.getItem('access_token')),
    globalHeaders: [{ 'Content-Type': 'application/json' }],
  }), http, options);
}

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
    DocumentsTabsComponent,
    DocumentContentComponent,
    WorkSpaceComponent,
    CodeModalComponent,
    ProjectsComponent,
    ProjectItemComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    OptionsComponent,
    DataFilterPipe,
    ProjectShareModalComponent,
    ProjectDeleteModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ModalModule.forRoot(),
    BootstrapModalModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes, { useHash: true }),
    DataTableModule,
    InlineEditorModule,
    ContextMenuModule,
    BrowserAnimationsModule,
    SimpleNotificationsModule.forRoot()
  ],
  providers: [DocumentService, CodeService,
    AuthGuard,
    AuthService,
    ContextMenuService,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    UserService,
    ProjectService,
    QuoteService,
    WindowSelection,
    WorkSpaceService,
    WorkSpaceResolver
  ],
  bootstrap: [AppComponent],
  entryComponents: [CodeModalComponent, ProjectShareModalComponent]
})
export class AppModule { }
