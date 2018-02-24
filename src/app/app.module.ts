import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { routes } from './app.routes';
import { Routes, RouterModule } from '@angular/router';
import { Ng2CompleterModule } from 'ng2-completer';
import {ColorPickerModule} from 'angular4-color-picker';
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
import { SpinnerService } from './shared/services/spinner.service';

import {DataTableModule} from 'angular2-datatable';
import { WorkSpaceResolver } from './shared/resolves/work-space.resolver';
import { DataFilterPipe } from './my-projects/projects/data-filter.pipe';
import { ProjectShareModalComponent } from './my-projects/project-share-modal/project-share-modal.component';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { TreeModule } from 'angular-tree-component';
import { AngularDraggableModule } from 'angular2-draggable';
import { ChartsModule } from 'ng2-charts';
import { ProjectInfoComponent } from './my-projects/projects/project-info/project-info.component';
import { QuotesRetrievalService } from './shared/services/quotes-retrieval.service';
import { RetrievedQuotesComponent } from './work-space/bottom-bar/retrieved-quotes-list/retrieved-quotes-list.component';
import { RetrievedQuoteItemComponent } from './work-space/bottom-bar/retrieved-quotes-list/retrieved-quote-item/retrieved-quote-item.component';
import { BottomBarComponent } from './work-space/bottom-bar/bottom-bar.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ResetPasswordComponent } from './home/reset-password/reset-password.component';
import { EqualValidatorDirective } from './shared/directives/equal-validator.directive';
import { ChartPopupComponent } from './work-space/popup-window/chart-popup/chart-popup.component';
import { PopupWindowComponent } from './work-space/popup-window/popup-window.component';
import { SimpleQueryEditorComponent } from './work-space/popup-window/simple-query-editor/simple-query-editor.component';
import { ComplexQueryEditorComponent } from './work-space/popup-window/complex-query-editor/complex-query-editor.component';
import { PopupLoaderService } from './shared/services/popup-loader.service';
import { SpinnerComponentModule } from 'ng2-component-spinner';
import {HotkeyModule} from 'angular2-hotkeys';
import { SearchInOpenDocsComponent } from './work-space/popup-window/search-in-open-docs/search-in-open-docs.component';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    tokenName: 'access_token',
    tokenGetter: (() => localStorage.getItem('access_token')),
    // globalHeaders: [{ 'Content-Type': 'application/json' }],
    globalHeaders: [],
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
    QuoteModalComponent,
    ProjectsComponent,
    ProjectItemComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    OptionsComponent,
    DataFilterPipe,
    ProjectShareModalComponent,
    ProjectInfoComponent,
    RetrievedQuotesComponent,
    RetrievedQuoteItemComponent,
    BottomBarComponent,
    ResetPasswordComponent,
    EqualValidatorDirective,
    ChartPopupComponent,
    PopupWindowComponent,
    SimpleQueryEditorComponent,
    ComplexQueryEditorComponent,
    SearchInOpenDocsComponent
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
    ContextMenuModule,
    BrowserAnimationsModule,
    SimpleNotificationsModule.forRoot(),
    TreeModule,
    Ng2CompleterModule,
    ColorPickerModule,
    AngularDraggableModule,
    ChartsModule,
    NgxPermissionsModule.forRoot(),
    SpinnerComponentModule,
    HotkeyModule.forRoot()
  ],
  providers: [DocumentService, CodeService,
    AuthGuard,
    AuthService,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    UserService,
    ProjectService,
    PopupLoaderService,
    QuoteService,
    QuotesRetrievalService,
    WindowSelection,
    WorkSpaceService,
    WorkSpaceResolver,
    SpinnerService,
    [DatePipe]
  ],
  bootstrap: [AppComponent],
  entryComponents: [CodeModalComponent,
    ProjectShareModalComponent,
    QuoteModalComponent,
    DocumentModalComponent,
    SimpleQueryEditorComponent,
    ComplexQueryEditorComponent,
    ChartPopupComponent,
    SearchInOpenDocsComponent
  ]
})
export class AppModule { }
