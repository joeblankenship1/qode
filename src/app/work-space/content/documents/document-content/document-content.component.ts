import { Component, OnInit, Input, ViewChild, OnChanges } from '@angular/core';
import { Document } from '../../../../shared/models/document.model';
import { ContextMenuService, ContextMenuComponent } from 'ngx-contextmenu';
import { ContentComponent } from '../../content.component';
import { OptionsComponent } from '../../../../shared/helpers/options/options.component';
import { MenuOption } from '../../../../shared/models/menu-option.model';
import { Quote } from '../../../../shared/models/quote.model';
import { Line } from '../../../../shared/models/line.model';
import { QuoteService } from '../../../../shared/services/quote.service';
import { DocumentContent } from '../../../../shared/models/document-content.model';
import { WorkSpaceService } from '../../../../shared/services/work-space.service';
import { QuoteDisplay } from '../../../../shared/models/quote-display';



@Component({
  selector: 'app-document-content',
  templateUrl: './document-content.component.html',
  styleUrls: ['./document-content.component.css']
})
export class DocumentContentComponent implements OnInit, OnChanges {

  @Input() actualDocument: Document;

  actualDocumentContent: DocumentContent;
  pages = [];
  allQuotes: Quote[] = [];
  colRange: number;

  constructor(private workSpaceService: WorkSpaceService,
        private quoteService: QuoteService) {}

  ngOnInit() {
    this.workSpaceService.getSelectedDocumentContent().subscribe(
      content => {
        this.actualDocumentContent = content;
        this.quoteService.getQuoteList().subscribe(
          quotes => this.allQuotes = quotes
        );
      },
      error => console.log(error)
    );
  }

  ngOnChanges() {
    if (this.actualDocumentContent) {
      this.pages = this.actualDocumentContent.getPages();
      this.colRange = this.allQuotes.length;
    } else {
      this.pages = [];
    }
  }

}
