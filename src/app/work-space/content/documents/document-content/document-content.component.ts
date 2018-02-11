import { Component, OnInit, Input, ViewChild, OnChanges, Output, EventEmitter, HostListener } from '@angular/core';
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

@Component({
  selector: 'app-document-content',
  providers: [ContextMenuService],
  templateUrl: './document-content.component.html',
  styleUrls: ['./document-content.component.css']
})
export class DocumentContentComponent implements OnInit, OnChanges {

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
    private windowSelection: WindowSelection) { }

  ngOnInit() {
    this.workSpaceService.getSelectedDocumentContent().subscribe(
      content => {
        this.actualDocumentContent = content;
        if (content) {
          this.aux.splice(0);
          content.getPages().forEach(p => {
            p.getLines().map(l => {
              this.aux.push(l);
            });
          });
        }
        // this.quoteService.getQuoteList().subscribe(
        //   quotes => {
        //     this.allQuotes = quotes;
        //   }
        // );
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

  ngOnChanges() {
    this.updatePagesAndQuotes();
  }

  // private onScroll(e) {
  //   console.log(e.srcElement.scrollTop);
  //   // document.getElementById('99').scrollIntoView()
  // }

  private createNewQuote(quote: Quote) {
    this.quoteService.addQuote(quote).subscribe(
      resp => {
        quote = resp;
        this.actualDocument.addQuote(quote);
        this.documentService.updateDocumentQuotes(this.actualDocument).subscribe(result => {
          this.workSpaceService.updateDocumentContent();
          window.getSelection().removeAllRanges();
          window.getSelection().addRange(this.selectedRange);
          this.spinnerService.setSpinner('coding', false);
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
  }

  updatePagesAndQuotes() {
    if (this.actualDocumentContent) {
      this.aux.splice(0);
      this.actualDocumentContent.getPages().forEach(p => {
        p.getLines().map(l => {
          this.aux.push(l);
        });
      });
      // sets the total number of opened quotes's associated codes
      this.colRange = this.actualDocumentContent.getQuotesDisplay().map(
        qd => qd.getQuote().getCodes().length === 0 ? 1 : qd.getQuote().getCodes().length)
        .reduce((a, b) => a + b, 0);
      // creates a dummy array for html columns management
      this.colRangeArray = new Array<any>(this.colRange);
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
          this.onOpenQuoteModal(item);
        }
      }),
      new MenuOption('Codificar con codigos activados', (item) => {
        this.onCodeWithActivatedCodes(item);
      })
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
    const docDisplay = this.windowSelection.getSelectedNodes(selection, 'tr');
    if (docDisplay.length === 0) {
      return undefined;
    }
    this.selectedRange = selection.getRangeAt(0);
    if (this.selectedRange && (this.selectedRange.startOffset !== this.selectedRange.endOffset)) {
      return new Quote(selection.toString(), selection.baseOffset,
        selection.extentOffset, docDisplay, this.workSpaceService.getProjectId());
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
                window.getSelection().addRange(this.selectedRange);
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
    if (codes && codes.length > 0) {
      this.createNewQuote(quote);
    }
  }
}
