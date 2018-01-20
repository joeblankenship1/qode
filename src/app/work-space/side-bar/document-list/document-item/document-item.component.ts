import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Document } from '../../../../shared/models/document.model';
import { DocumentService } from '../../../../shared/services/document.service';
import { WorkSpaceService } from '../../../../shared/services/work-space.service';
import { ContextMenuService } from 'ngx-contextmenu';
import { MenuOption } from '../../../../shared/models/menu-option.model';
import { OptionsComponent } from '../../../../shared/helpers/options/options.component';

@Component({
  selector: 'app-document-item',
  templateUrl: './document-item.component.html',
  styleUrls: ['./document-item.component.css']
})
export class DocumentItemComponent implements OnInit, OnDestroy {
  @Input() document: Document;
  menuOptions: MenuOption[][] = [];
  options = new OptionsComponent();

  constructor(private  workspaceService: WorkSpaceService,
  private documentService: DocumentService, private contextMenuService: ContextMenuService) { }


  ngOnInit() {
    this.createMenuOptions();
  }

  onOpenDocument() {
    this.document.setOpened(true);
    this.documentService.updateDocument(this.document, {'opened': true})
    .subscribe(doc => {this.workspaceService.selectDocument(doc); });
  }

  private createMenuOptions() {
    this.menuOptions = [[
      new MenuOption('Activar', (item) => { item.activate(); }),
      new MenuOption('Desactivar', (item) => { item.deactivate();  })
    ]];
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

  ngOnDestroy() {

  }

}
