import { Component, OnInit, Input, ViewChild, OnChanges, Output, EventEmitter } from '@angular/core';
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
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { QuoteModalComponent } from '../../../../header/quote-modal/quote-modal.component';
import { overlayConfigFactory } from 'angular2-modal';
import { WindowSelection } from '../../../../shared/helpers/window-selection';



@Component({
  selector: 'app-document-content',
  templateUrl: './document-content.component.html',
  styleUrls: ['./document-content.component.css']
})
export class DocumentContentComponent implements OnInit, OnChanges {

  @Input() actualDocument: Document;
  @Output() selectedQuote = new EventEmitter<Quote>();

  actualDocumentContent: DocumentContent;
  pages = [];
  allQuotes: Quote[] = [];
  colRange: number;
  menuOptions: MenuOption[][] = [];
  options = new OptionsComponent();

  constructor(private workSpaceService: WorkSpaceService, private modal: Modal,
        private contextMenuService: ContextMenuService,
        private quoteService: QuoteService, private windowSelection: WindowSelection) {}

  ngOnInit() {
    this.workSpaceService.getSelectedDocumentContent().subscribe(
      content => {
        this.actualDocumentContent = content;
        this.quoteService.getQuoteList().subscribe(
          quotes => {
            this.allQuotes = quotes;
          }
        );
        this.updatePagesAndQuotes();
      },
      error => console.log(error)
    );
    this.createMenuOptions();
  }

  ngOnChanges() {
    this.updatePagesAndQuotes();
  }

  updatePagesAndQuotes() {
    if (this.actualDocumentContent) {
      this.pages = this.actualDocumentContent.getPages();
      this.colRange = this.actualDocumentContent.getQuotesDisplay().length;
    }
  }


  private createMenuOptions() {
    this.menuOptions = [[
      new MenuOption('Asociar codigo', (item) => {
        if (item) {
          this.onOpenQuoteModal(item);
        }
      }),
      new MenuOption('Codificar con nuevo codigo', (item) => { console.log('fuuun'); })
    ]];
  }

  private onOpenQuoteModal(item: Quote) {
    this.modal.open(QuoteModalComponent, overlayConfigFactory({ quote: item,
    document: this.actualDocument, mode: 'new' }, BSModalContext ))
    .then((resultPromise) => {
      resultPromise.result.then((result) => {
        if (result !== null) {
          if (result === -1) {
            this.workSpaceService.removeQuoteDocumentContent(item);
          }else {
            item = result;
            this.workSpaceService.updateDocumentContent(result);
          }
        }
      });
    });
  }

    // Open context menu, the selected text will be passed as a parameter.
  // If there's no slected text, several options won't be enabled.
  public onContextMenu($event: MouseEvent, item: any): void {
    const newSelection = this.getSelectedText();
    this.workSpaceService.setNewSelection(newSelection);
    this.defineMenuOptions(newSelection);
    this.contextMenuService.show.next({
      contextMenu: this.options.optionsMenu,
      event: $event,
      item: newSelection
    });
    $event.preventDefault();
    $event.stopPropagation();
  }

  // Extract from windows.selection the ids of the LineComponents which contain
  // the text that has been selected. Also create temporary quote with the selected text.
  private getSelectedText() {
    const selection = window.getSelection();
    const docDisplay = this.windowSelection.getSelectedNodes(selection, 'tr');
    return new Quote(selection.toString(), selection.baseOffset,
    selection.extentOffset - 1, docDisplay, this.workSpaceService.getProjectId());
  }

  private defineMenuOptions(newSelection) {
    if (newSelection) {
      this.menuOptions.map(group => {
        group.map(op => newSelection ? op.enabled = true : op.enabled = false);
      });
    }
  }

    // Update the quotes related two each page and lines afected from selection.
  // This function must be called after a new quote is saved.
  // private updatePages(newQuote: Quote) {
  //   this.actualDocumentContent.updatePages(newQuote);
  // }

}
