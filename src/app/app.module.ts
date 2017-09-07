import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { DocumentListComponent } from './side-bar/document-list/document-list.component';
import { CodeListComponent } from './side-bar/code-list/code-list.component';
import { ContentComponent } from './content/content.component';
import { FooterComponent } from './footer/footer.component';
import { DocumentsComponent } from './content/documents/documents.component';
import { CodeItemComponent } from './side-bar/code-list/code-item/code-item.component';
import { DocumentItemComponent } from './side-bar/document-list/document-item/document-item.component';
import { SignupComponent } from './header/auth/signup/signup.component';
import { SigninComponent } from './header/auth/signin/signin.component';
import { DocumentModalComponent } from './header/document-modal/document-modal.component';
import { QuoteModalComponent } from './header/quote-modal/quote-modal.component';
import { MemoModalComponent } from './header/memo-modal/memo-modal.component';
import { CodeModalComponent } from './header/code-modal/code-modal.component';

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
    CodeModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
