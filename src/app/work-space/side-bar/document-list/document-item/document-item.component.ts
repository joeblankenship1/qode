import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Document } from '../../../../shared/models/document.model';
import { DocumentService } from '../../../../shared/services/document.service';
import { WorkSpaceService } from '../../../../shared/services/work-space.service';
import { OptionsComponent } from '../../../../shared/helpers/options/options.component';
import { QuotesRetrievalService } from '../../../../shared/services/quotes-retrieval.service';
import { DocumentModalComponent } from '../../../../header/document-modal/document-modal.component';
import { overlayConfigFactory } from 'angular2-modal';
import { BSModalContext, Modal } from 'angular2-modal/plugins/bootstrap';
import { MenuOption } from '../../../../shared/models/menu-option.model';
import { ContextMenuService } from 'ngx-contextmenu';

@Component({
  selector: 'app-document-item',
  providers: [ContextMenuService],
  templateUrl: './document-item.component.html',
  styleUrls: ['./document-item.component.css'],
})
export class DocumentItemComponent implements OnInit, OnDestroy {
  @Input() document: Document;
  menuOptions: MenuOption[][] = [];
  options = new OptionsComponent();

  constructor(private workspaceService: WorkSpaceService,
    private documentService: DocumentService, private contextMenuService: ContextMenuService,
    private quotesRetrievalService: QuotesRetrievalService, private modal: Modal) { }


  selected: Document;

  ngOnInit() {
    this.createMenuOptions();
    this.workspaceService.getSelectedDocument()
      .subscribe(
      selectedDocument => {
        this.selected = selectedDocument;
      });
    this.createMenuOptions();
  }

  onOpenDocument() {
    this.document.setOpened(true);
    this.documentService.updateDocument(this.document, { 'opened': true })
      .subscribe(doc => { this.workspaceService.selectDocument(doc); });
  }

  private createMenuOptions() {
    this.menuOptions = [[
      new MenuOption('Activar', (item) => { this.onActivateDocument(); }),
      new MenuOption('Desactivar', (item) => { this.onDeactivateDocument(); })
    ],
    [new MenuOption('Editar', (item) => { this.onEditDocument(); }),
     new MenuOption('Eliminar', (item) => { this.onDeleteDocument(); })]];
    this.defineMenuOptions();
  }

  // Open context menu, the selected text will be passed as a parameter.
  // If there's no slected text, several options won't be enabled.
  public onContextMenu($event: MouseEvent, item: any): void {
    this.defineMenuOptions();
    this.contextMenuService.show.next({
      contextMenu: this.options.optionsMenu,
      event: $event,
      item: this.document
    });
    $event.preventDefault();
    $event.stopPropagation();
  }

  private defineMenuOptions() {
    if (this.document.isActivated()) {
      this.menuOptions[0][0].setVisible(false);
      this.menuOptions[0][1].setVisible(true);
    } else {
      this.menuOptions[0][0].setVisible(true);
      this.menuOptions[0][1].setVisible(false);
    }
  }

  public onActivateDocument() {
    this.document.activate();
    this.documentService.setActivatedDocument(this.document);
    this.quotesRetrievalService.updateFromActivation();
  }

  public onDeactivateDocument() {
    this.document.deactivate();
    this.documentService.removeActivatedDocument(this.document);
    this.quotesRetrievalService.updateFromActivation();
  }

  public getItemClass() {
    return this.document.isActivated() ? 'list-item-selected' : 'list-item';
  }

  onDeleteDocument() {
    const dialogRef = this.modal.confirm().size('lg').isBlocking(true).showClose(true).keyboard(27)
      .okBtn('Confirmar').okBtnClass('btn btn-info').cancelBtnClass('btn btn-danger')
      .title('Eliminar documento').body(' ¿Seguro que desea eliminar el documento y todas las citas asociadas? ').open();
    dialogRef
      .then(r => {
        r.result
          .then(result => {
            this.documentService.deleteDocument(this.document)
              .subscribe(doc => {
                this.workspaceService.closeDocument(this.document);
              });
          })
          .catch(error =>
            console.log(error)
          );
      });
  }

  onEditDocument() {
    this.modal.open(DocumentModalComponent, overlayConfigFactory({ doc: this.document, mode: 'new' }, BSModalContext ))
    .then((resultPromise) => {
      resultPromise.result.then((result) => { });
    });
  }



  ngOnDestroy() {

  }

}
