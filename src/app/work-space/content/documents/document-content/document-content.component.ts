import { Component, OnInit, Input, ViewChild, OnChanges } from '@angular/core';
import { Document } from '../../../../shared/models/document.model';
import { ContextMenuService, ContextMenuComponent } from 'ngx-contextmenu';
import { ContentComponent } from '../../content.component';
import { OptionsComponent } from '../../../../shared/helpers/options/options.component';
import { MenuOption } from '../../../../shared/models/menu-option.model';
import { Quote } from '../../../../shared/models/quote.model';
import { LineComponent } from './page/line/line.component';
import { Line } from '../../../../shared/models/line.model';
import { WindowSelection } from '../../../../shared/helpers/window-selection';
import { QuoteService } from '../../../../shared/services/quote.service';
import { DocumentContent } from '../../../../shared/models/document-content.model';
import { WorkSpaceService } from '../../../../shared/services/work-space.service';
import { Project } from '../../../../shared/models/project.model';
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
  options = new OptionsComponent();
  menuOptions: MenuOption[][] = [];
  selecting = false;
  selectedLines = [];
  allQuotes: Quote[] = [];
  colRange: number;

  constructor(private contextMenuService: ContextMenuService, private windowSelection: WindowSelection,
  private workSpaceService: WorkSpaceService, private quoteService: QuoteService) {
  }

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
    this.createMenuOptions();

  }

  ngOnChanges() {
    if (this.actualDocumentContent) {
      this.pages = this.actualDocumentContent.getPages();
      this.colRange = this.allQuotes.length;
    }
  }

  // Open context menu, the selected text will be passed as a parameter.
  // If there's no slected text, several options won't be enabled.
  public onContextMenu($event: MouseEvent, item: any): void {
    const selectedText = this.getSelectedText();
    this.defineMenuOptions(selectedText);
    this.contextMenuService.show.next({
      contextMenu: this.options.optionsMenu,
      event: $event,
      item: selectedText
    });
    $event.preventDefault();
    $event.stopPropagation();
  }

  private createMenuOptions() {
    this.menuOptions = [[
      new MenuOption('Asociar codigo', (item) => {
        if (item) {
          console.log(item);
        } else {
          console.log('sin item');
        }
      }),
      new MenuOption('Codificar con nuevo codigo', () => { console.log('fuuun'); })
    ]];
  }

  private defineMenuOptions(selectedText) {
    if (selectedText) {
      this.menuOptions.map(group => {
        group.map(op => selectedText ? op.enabled = true : op.enabled = false);
      });
    }
  }

  // Extract from windows.selection the ids of the LineComponents which contain
  // the text that has been selected. Also create temporary quote with the selected text.
  private getSelectedText() {
    const selection = window.getSelection();
    this.windowSelection.getSelectedNodes(selection, 'app-line')
    .map(n => this.selectedLines[n.id] = true);
    return new Quote(selection.toString(), selection.baseOffset, selection.extentOffset - 1, [{}], '' );
  }

  // Update the quotes related two each page and lines afected from selection.
  // This function must be called after a new quote is saved.
  private updatePages(newQuote: Quote) {
    this.actualDocumentContent.updatePages(newQuote);
  }

}
