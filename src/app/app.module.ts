import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

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
import { SignupComponent } from './header/auth/signup/signup.component';
import { SigninComponent } from './header/auth/signin/signin.component';
import { DocumentModalComponent } from './header/document-modal/document-modal.component';
import { QuoteModalComponent } from './header/quote-modal/quote-modal.component';
import { MemoModalComponent } from './header/memo-modal/memo-modal.component';
import { CodeModalComponent } from './header/code-modal/code-modal.component';
import { DocumentService } from './shared/services/document.service';
import { ModalService } from './shared/services/modal.service';
import { DocumentsTabsComponent } from './work-space/content/documents/documents-tabs/documents-tabs.component';
import { DocumentContentComponent } from './work-space/content/documents/document-content/document-content.component';
import { WorkSpaceComponent } from './work-space/work-space.component';
import { CodeService } from './shared/services/code.service';

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
    SignupComponent,
    SigninComponent,
    DocumentModalComponent,
    QuoteModalComponent,
    MemoModalComponent,
    DocumentsTabsComponent,
    DocumentContentComponent,
    WorkSpaceComponent,
    CodeModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ModalModule.forRoot(),
    BootstrapModalModule
  ],
  providers: [DocumentService,ModalService,CodeService],
  bootstrap: [AppComponent],
  entryComponents: [CodeModalComponent]
})
export class AppModule { }
