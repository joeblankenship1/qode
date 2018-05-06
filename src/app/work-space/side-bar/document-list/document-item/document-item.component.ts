import { Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';
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
import { UserService } from '../../../../shared/services/user.service';
import { NotificationsService } from 'angular2-notifications';

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
  permissions: Array<string>;

  constructor(private workspaceService: WorkSpaceService,
    private documentService: DocumentService,
    private contextMenuService: ContextMenuService,
    private userService: UserService, private notificationService: NotificationsService,
    private quotesRetrievalService: QuotesRetrievalService, private modal: Modal) { }


  selected: Document;

  ngOnInit() {
    this.userService.getRolePermissions().subscribe(
      permissions => {
        this.permissions = permissions;
        this.createMenuOptions();
      },
      error => { console.error(error); }
    );
    this.workspaceService.getSelectedDocument()
      .subscribe(
        selectedDocument => {
          this.selected = selectedDocument;
        });
  }


  private createMenuOptions() {
    this.menuOptions = [
      [new MenuOption('Abrir', (item) => { this.onOpenDocument(); }),
      new MenuOption('Editar', (item) => { this.onEditDocument(); })],
      [new MenuOption('Activar', (item) => { this.onActivateDocument(); }),
      new MenuOption('Desactivar', (item) => { this.onDeactivateDocument(); })],
      [new MenuOption('Eliminar', (item) => { this.onDeleteDocument(); })]];
    this.defineMenuOptions();
  }

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
      this.menuOptions[1][0].setVisible(false);
      this.menuOptions[1][1].setVisible(true);
    } else {
      this.menuOptions[1][0].setVisible(true);
      this.menuOptions[1][1].setVisible(false);
    }
    if (this.permissions) {
      if (this.permissions.includes('activate_document')) {
        this.menuOptions[1][0].enable();
        this.menuOptions[1][1].enable();
      } else {
        this.menuOptions[1][0].disable();
        this.menuOptions[1][1].disable();
      }
      if (this.permissions.includes('edit_document')) {
        this.menuOptions[0][1].enable();
      } else {
        this.menuOptions[0][1].disable();
      }
      if (this.permissions.includes('delete_document')) {
        this.menuOptions[2][0].enable();
      } else {
        this.menuOptions[2][0].disable();
      }
    }
  }


  public onOpenDocument() {
    this.document.setOpened(true);
    if (this.userService.getRole() !== 'Lector') {
      this.documentService.updateDocument(this.document, { 'opened': true })
        .subscribe(doc => { this.workspaceService.selectDocument(doc); });
    } else {
      this.documentService.updateOpened(this.document, true);
    }
  }

  onEditDocument() {
    this.modal.open(DocumentModalComponent, overlayConfigFactory({ doc: this.document, mode: 'new' }, BSModalContext))
      .then((resultPromise) => {
        resultPromise.result.then((result) => { });
      });
  }

  public onActivateDocument() {
    this.document.activate();
    this.documentService.setActivatedDocument(this.document);
    this.quotesRetrievalService.addDocument(this.document);
  }

  public onDeactivateDocument() {
    this.document.deactivate();
    this.documentService.removeActivatedDocument(this.document);
    this.quotesRetrievalService.removeDocument(this.document);
  }

  public onClickListLine($event) {
    if ($event.ctrlKey || $event.metaKey) {
      if (this.document.isActivated()) {
        this.onDeactivateDocument();
      } else {
        this.onActivateDocument();
      }
    }
  }

  public getItemClass() {
    return this.document.isActivated() ? 'list-item-selected' : 'list-item';
  }

  public getDocumentTitle() {
    return this.document.getMemo().length > 0 ?
     this.document.getName() + '\n\n' + this.document.getMemo() :
     this.document.getName();
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
          .catch(error => {
            console.log(error);
          }
          );
      });
  }

  ngOnDestroy() {

  }

}
