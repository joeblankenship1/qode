import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../../shared/services/document.service';
import { Document } from '../../../shared/models/document.model';
import { WorkSpaceService } from '../../../shared/services/work-space.service';
import { OptionsComponent } from '../../../shared/helpers/options/options.component';
import { MenuOption } from '../../../shared/models/menu-option.model';
import { ContextMenuService, ContextMenuComponent } from 'ngx-contextmenu';
import { WindowSelection } from '../../../shared/helpers/window-selection';
import { Quote } from '../../../shared/models/quote.model';
import { QuoteDisplay } from '../../../shared/models/quote-display';
<<<<<<< HEAD
import { QuoteService } from '../../../shared/services/quote.service';
=======
>>>>>>> 6db65d361e6564134b4911cd57f1a80f01626d57


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {

  public openedDocuments: Document[] = [];
  public selectedDocument: Document;
<<<<<<< HEAD

=======
  
>>>>>>> 6db65d361e6564134b4911cd57f1a80f01626d57
  projectId: string;
  options = new OptionsComponent();
  menuOptions: MenuOption[][] = [];
  selectedLines = [];

  constructor(private workspaceService: WorkSpaceService,
<<<<<<< HEAD
    private contextMenuService: ContextMenuService, private windowSelection: WindowSelection,
    private quoteService: QuoteService) { }
=======
    private contextMenuService: ContextMenuService, private windowSelection: WindowSelection) { }
>>>>>>> 6db65d361e6564134b4911cd57f1a80f01626d57

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
<<<<<<< HEAD
=======
    const selectedText = '';
>>>>>>> 6db65d361e6564134b4911cd57f1a80f01626d57
    this.contextMenuService.show.next({
      contextMenu: this.options.optionsMenu,
      event: $event,
      item: newSelection
    });
    $event.preventDefault();
    $event.stopPropagation();
  }

  private createMenuOptions() {
    this.menuOptions = [[
      new MenuOption('Asociar codigo', (item) => {
        if (item) {
<<<<<<< HEAD
        this.workspaceService.updateDocumentContent(item);
        }
      }),
      new MenuOption('Codificar con nuevo codigo', (item) => { console.log('fuuun'); })
=======
          console.log(item);
        } else {
          console.log('sin item');
        }
      }),
      new MenuOption('Codificar con nuevo codigo', () => { console.log('fuuun'); })
>>>>>>> 6db65d361e6564134b4911cd57f1a80f01626d57
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
<<<<<<< HEAD
    const docDisplay = this.windowSelection.getSelectedNodes(selection, 'tr');
    return new Quote(selection.toString(), selection.baseOffset,
    selection.extentOffset - 1, docDisplay, this.projectId);
=======
    const docDisplay = [];
    this.windowSelection.getSelectedNodes(selection, 'tr')
    .map(n => this.selectedLines[n.id] = true);
    const quote = new Quote(selection.toString(), selection.baseOffset,
    selection.extentOffset - 1, docDisplay, this.projectId);
    return new QuoteDisplay(quote);
>>>>>>> 6db65d361e6564134b4911cd57f1a80f01626d57
  }

  // Update the quotes related two each page and lines afected from selection.
  // This function must be called after a new quote is saved.
  // private updatePages(newQuote: Quote) {
  //   this.actualDocumentContent.updatePages(newQuote);
  // }

}
