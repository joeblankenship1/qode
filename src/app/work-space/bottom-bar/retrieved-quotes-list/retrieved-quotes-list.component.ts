import { Component, OnInit } from '@angular/core';
import { QuotesRetrievalService } from '../../../shared/services/quotes-retrieval.service';
import { Quote } from '../../../shared/models/quote.model';
import { WorkSpaceService } from '../../../shared/services/work-space.service';
import { DocumentContent } from '../../../shared/models/document-content.model';

@Component({
  selector: 'app-retrieved-quotes-list',
  templateUrl: './retrieved-quotes-list.component.html',
  styleUrls: ['./retrieved-quotes-list.component.css']
})
export class RetrievedQuotesComponent implements OnInit {

  public retrievedQuotes: Quote[];
  public docContent: DocumentContent;
  public watchedQuote: Quote;
  public watchedContent: DocumentContent;
  public quoteColumn: number;

  constructor(private quotesRetrievalService: QuotesRetrievalService,
              private workspaceService: WorkSpaceService) { }

  ngOnInit() {
    this.quotesRetrievalService.getRetrievedQuotes()
    .subscribe( quotes => {
      this.retrievedQuotes = quotes;
      if (this.watchedQuote && !quotes.includes(this.watchedQuote)) {
        this.unhighlightQuote();
      }
    });
    this.workspaceService.getSelectedDocumentContent().subscribe( selectedDocContent => {
      this.docContent = selectedDocContent;
      if (this.docContent) {
        if (this.watchedQuote && (this.docContent.getDocumentId() === this.watchedQuote.getDocument().getId())) {
          this.highlightQuote();
        }
      } else {
        this.unhighlightQuote();
      }
    });
  }

  highlightQuote() {
    this.quoteColumn = this.docContent.getQuotesDisplay().find( qd => qd.getQuote() === this.watchedQuote).getColumn();
    this.docContent.setLinesColor({quote: this.watchedQuote, column: this.quoteColumn, borderTop: false, borderBottom: false},
      this.quoteColumn, true);
    document.querySelector('tr.linea' + this.watchedQuote.getDocumentDisplay()[0].startLine).scrollIntoView();
    this.watchedContent = this.docContent;
  }

  unhighlightQuote() {
    if (this.watchedQuote) {
      this.watchedContent.setLinesColor({quote: this.watchedQuote, column: this.quoteColumn,
        borderTop: false, borderBottom: false}, this.quoteColumn, false);
      this.watchedQuote = undefined;
      this.watchedContent = undefined;
      this.quoteColumn = 0;
    }
  }

  onWatchQuote( quote: Quote) {
    this.unhighlightQuote();
    this.watchedQuote = quote;
    if (this.docContent.getDocumentId() !== quote.getDocument().getId()) {
      this.workspaceService.selectDocument(quote.getDocument());
    }else {
      this.highlightQuote();
    }
  }

}
