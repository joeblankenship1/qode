import {
  Component, OnInit, Input, ViewChild, Output, EventEmitter, HostListener,
  ElementRef
} from '@angular/core';
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
import { CodeService } from '../../../../shared/services/code.service';
import { DocumentService } from '../../../../shared/services/document.service';
import { NotificationsService } from 'angular2-notifications';
import { UserService } from '../../../../shared/services/user.service';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { AppSettings } from '../../../../app.settings';

@Component({
  selector: 'app-document-content',
  providers: [ContextMenuService],
  templateUrl: './document-content.component.html',
  styleUrls: ['./document-content.component.css']
})
export class DocumentContentComponent implements OnInit {

  @Input() actualDocument: Document;
  @Output() selectedQuote = new EventEmitter<Quote>();

  actualDocumentContent: DocumentContent;
  aux: Line[] = [];
  allQuotes: Quote[] = [];
  colRange: number;
  colRangeArray: Array<any> = [];
  menuOptions: MenuOption[][] = [];
  options = new OptionsComponent();
  selectedRange;
  permissions: Array<string>;
  spinner = false;
  maxCodeNames = AppSettings.MAX_CODES_QUOTE;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  public paint = false;
  showLoader: boolean;

  constructor(private workSpaceService: WorkSpaceService, private modal: Modal,
    private contextMenuService: ContextMenuService,
    private codeService: CodeService,
    private documentService: DocumentService,
    private notificationsService: NotificationsService,
    private quoteService: QuoteService,
    private userService: UserService,
    private spinnerService: SpinnerService,
    private windowSelection: WindowSelection
  ) { }

  ngOnInit() {
    this.workSpaceService.getSelectedDocumentContent().subscribe(
      content => {
        this.actualDocumentContent = content;
        this.updatePagesAndQuotes();
      },
      error => console.log(error)
    );
    this.createMenuOptions();

    this.userService.getRolePermissions().subscribe(
      permissions => {
        this.permissions = permissions;
      },
      error => { console.error(error); }
    );

    this.spinnerService.getSpinner('document')
      .subscribe(
        state => {
          this.spinner = state;
        });
  }

  // ngAfterViewInit() {
  //   if (this.actualDocumentContent && !this.workSpaceService.isSearchActive()) {
  //     const a = this.actualDocumentContent.getScrollTop();
  //     document.querySelector('.content-container').scrollTop = a;
  //   }
  // }

  // ngOnChanges() {
  //   this.updatePagesAndQuotes();
  // }

  private onScroll(e) {
    if (this.actualDocumentContent) {
      this.actualDocumentContent.saveScrollTop(e.srcElement.scrollTop);
    }
  }

  private createNewQuote(quote: Quote) {
    this.quoteService.addQuote(quote).subscribe(
      resp => {
        quote = resp;
        // this.actualDocument.addQuote(quote);
        this.documentService.updateDocumentQuotes(this.actualDocument).subscribe(result => {
          // this.workSpaceService.updateDocumentContent();
          // window.getSelection().removeAllRanges();
          // window.getSelection().addRange(this.selectedRange);
          // this.spinnerService.setSpinner('coding', false);
        },
          error => {
            this.notificationsService.error('Error al guardar', error);
            this.spinnerService.setSpinner('coding', false);
            console.error(error);
          }
        );
      },
      error => {
        this.notificationsService.error('Error al guardar', error);
        this.spinnerService.setSpinner('coding', false);
        console.error(error);
      }
    );
    this.actualDocument.addQuote(quote);
    this.workSpaceService.updateDocumentContent();
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(this.selectedRange);
    this.spinnerService.setSpinner('coding', false);
  }

  updatePagesAndQuotes() {
    if (this.actualDocumentContent) {
      this.aux.splice(0);
      this.actualDocumentContent.getPages().forEach(p => {
        p.getLines().map(l => {
          this.aux.push(l);
        });
      });
      // sets the max number of columns needed
      this.colRange = 0;
      this.aux.forEach(l => {
        const range = l.getColRange();
        if (range > this.colRange) {
          this.colRange = range;
        }
      });
      // creates a dummy array for html columns management
      this.colRangeArray = new Array<any>(this.colRange);
      if (!this.workSpaceService.isSearchActive()) {
        const a = this.actualDocumentContent.getScrollTop();
        document.querySelector('.content-container').scrollTop = a;
      }
    } else {
      this.aux = [];
      this.colRange = 0;
      this.colRangeArray = [];
    }
  }

  private createMenuOptions() {
    this.menuOptions = [[
      new MenuOption('Codificar', (item) => {
        if (item) {
          item.setDocument(this.actualDocument);
          this.onOpenQuoteModal(item);
        }
      }),
      new MenuOption('Codificar con codigos activados', (item) => {
        this.onCodeWithActivatedCodes(item);
      }),
      new MenuOption('Copiar', (item) => {document.execCommand('copy'); })
    ]];
  }


  // Open context menu, the selected text will be passed as a parameter.
  // If there's no slected text, several options won't be enabled.
  public onContextMenu($event: MouseEvent, item: any): void {
    const newSelection = this.getSelectedText();
    if (newSelection) {
      this.workSpaceService.setNewSelection(newSelection);
      this.defineMenuOptions(newSelection);
      this.contextMenuService.show.next({
        contextMenu: this.options.optionsMenu,
        event: $event,
        item: newSelection
      });
    }
    $event.preventDefault();
    $event.stopPropagation();
  }

  // Extract from windows.selection the ids of the LineComponents which contain
  // the text that has been selected. Also create temporary quote with the selected text.
  private getSelectedText() {
    const selection = window.getSelection();
    const selectedNodes = this.windowSelection.getSelectedNodes(selection, 'tr');
    if (!selectedNodes.docDisplay || selectedNodes.docDisplay.length === 0) {
      return undefined;
    }
    this.selectedRange = selection.getRangeAt(0);
    if (this.selectedRange) {
      const endOffset = this.selectedRange.endOffset === 0 ?
        selectedNodes.endOffset : this.selectedRange.endOffset;
      return new Quote(selection.toString(), this.selectedRange.startOffset,
        endOffset, selectedNodes.docDisplay, this.workSpaceService.getProjectId());
    }
  }

  private defineMenuOptions(newSelection) {
    this.menuOptions.map(group => {
      group.map(op => newSelection ? op.enable() : op.disable());
    });
    if (this.permissions) {
      if (this.permissions.includes('coding')) {
        this.menuOptions[0][0].enable();
      } else {
        this.menuOptions[0][0].disable();
      }
      if (this.permissions.includes('coding_with_activated_codes')) {
        this.menuOptions[0][1].enable();
      } else {
        this.menuOptions[0][1].disable();
      }
    }
  }

  private onOpenQuoteModal(item: Quote) {
    if (item) {
      this.modal.open(QuoteModalComponent, overlayConfigFactory({
        quote: item,
        document: this.actualDocument, mode: 'new'
      }, BSModalContext))
        .then((resultPromise) => {
          resultPromise.result.then((result) => {
            if (result !== null) {
              if (result === -1) {
                this.workSpaceService.removeQuoteDocumentContent();
              } else {
                item = result;
                this.workSpaceService.updateDocumentContent();
                window.getSelection().removeAllRanges();
                if (this.selectedRange) {
                  window.getSelection().addRange(this.selectedRange);
                }
              }
            }
          });
        });
    }
  }

  private onCodeWithActivatedCodes(quote: Quote) {
    const codes = [];
    this.codeService.getActivatedCodes().map(c => {
      this.spinnerService.setSpinner('coding', true);
      codes.push(c);
    });
    quote.setCodes(codes);
    quote.setDocument(this.actualDocument);
    if (codes && codes.length > 0) {
      this.createNewQuote(quote);
    }
  }

  onMouseOverBracket(relatedQuote, column: number) {
    if (this.actualDocumentContent && relatedQuote) {
      this.actualDocumentContent.setLinesColor(relatedQuote, column, true);
      if (relatedQuote.quote.getCodes().length <= this.maxCodeNames) {
        const code = relatedQuote.quote.getCodes()[column - relatedQuote.column];
        if (code) {
          document.getElementById(relatedQuote.quote.getId() + '-' + code.getName()).style.textDecoration = 'underline';
        }
      } else {
        document.getElementById(relatedQuote.quote.getId()).style.textDecoration = 'underline';
      }
    }
  }

  onMouseOutBracket(relatedQuote, column: number) {
    if (this.actualDocumentContent && relatedQuote) {
      this.actualDocumentContent.setLinesColor(relatedQuote, column, false);
      if (relatedQuote.quote.getCodes().length <= this.maxCodeNames) {
        const code = relatedQuote.quote.getCodes()[column - relatedQuote.column];
        if (code) {
          document.getElementById(relatedQuote.quote.getId() + '-' + code.getName()).style.textDecoration = '';
        }
      } else {
        document.getElementById(relatedQuote.quote.getId()).style.textDecoration = '';
      }
    }
  }

  getNameDivId(quote, code) {
    return quote.getId() + '-' + code.getName();
  }

  getQuoteCodeNames(quote) {
    return quote.getCodes().map(c => {
      return c.getName();
    }).join('\n');
  }
}
