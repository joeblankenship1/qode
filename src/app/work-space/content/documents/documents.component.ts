import { Component, OnInit, OnDestroy } from '@angular/core';
import { DocumentService } from '../../../shared/services/document.service';
import { Document } from '../../../shared/models/document.model';
import { WorkSpaceService } from '../../../shared/services/work-space.service';
import { OptionsComponent } from '../../../shared/helpers/options/options.component';
import { MenuOption } from '../../../shared/models/menu-option.model';
import { ContextMenuService, ContextMenuComponent } from 'ngx-contextmenu';
import { WindowSelection } from '../../../shared/helpers/window-selection';
import { Quote } from '../../../shared/models/quote.model';
import { QuoteDisplay } from '../../../shared/models/quote-display';
import { QuoteService } from '../../../shared/services/quote.service';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit, OnDestroy {

  public openedDocuments: Document[] = [];
  public selectedDocument: Document;
  projectId: string;
  options = new OptionsComponent();
  menuOptions: MenuOption[][] = [];
  selectedLines = [];

  constructor(private workspaceService: WorkSpaceService,
    private contextMenuService: ContextMenuService, private windowSelection: WindowSelection,
    private quoteService: QuoteService) { }

  ngOnInit() {
    this.workspaceService.getOpenedDocuments()
      .subscribe(
      openedDocuments => {
        this.openedDocuments = openedDocuments;
        this.selectedDocument = openedDocuments[0];
      }
      );

      this.workspaceService.getSelectedDocument()
      .subscribe(
      selectedDocument => {
        this.selectedDocument = selectedDocument;
      }
      );

      this.projectId = this.workspaceService.getProjectId();

      this.createMenuOptions();
  }

  onDocumentSelected(document: Document) {
    this.selectedDocument = document;
    this.workspaceService.selectDocument(document);
  }

  // Open context menu, the selected text will be passed as a parameter.
  // If there's no slected text, several options won't be enabled.
  public onContextMenu($event: MouseEvent, item: any): void {
    const newSelection = this.getSelectedText();
    this.workspaceService.setNewSelection(newSelection);
    this.defineMenuOptions(newSelection);
    this.contextMenuService.show.next({
      contextMenu: this.options.optionsMenu,
      event: $event,
      item: newSelection
    });
    $event.preventDefault();
    $event.stopPropagation();
  }

  ngOnDestroy() {
  }

  private createMenuOptions() {
    this.menuOptions = [[
      new MenuOption('Asociar codigo', (item) => {
        if (item) {
        this.workspaceService.updateDocumentContent(item);
        }
      }),
      new MenuOption('Codificar con nuevo codigo', (item) => { console.log('fuuun'); })
    ]];
  }

  private defineMenuOptions(newSelection) {
    if (newSelection) {
      this.menuOptions.map(group => {
        group.map(op => newSelection ? op.enabled = true : op.enabled = false);
      });
    }
  }

   // Extract from windows.selection the ids of the LineComponents which contain
  // the text that has been selected. Also create temporary quote with the selected text.
  private getSelectedText() {
    const selection = window.getSelection();
    const docDisplay = this.windowSelection.getSelectedNodes(selection, 'tr');
    return new Quote(selection.toString(), selection.baseOffset,
    selection.extentOffset - 1, docDisplay, this.projectId);
  }

  // Update the quotes related two each page and lines afected from selection.
  // This function must be called after a new quote is saved.
  // private updatePages(newQuote: Quote) {
  //   this.actualDocumentContent.updatePages(newQuote);
  // }

}
