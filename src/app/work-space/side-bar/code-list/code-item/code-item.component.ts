import { Component, OnInit, Input, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { Code } from '../../../../shared/models/code.model';
import { CodeModalComponent, CodeModalData } from '../../../../header/code-modal/code-modal.component';
import { QuoteService } from '../../../../shared/services/quote.service';
import { WorkSpaceService } from '../../../../shared/services/work-space.service';
import { MenuOption } from '../../../../shared/models/menu-option.model';
import { OptionsComponent } from '../../../../shared/helpers/options/options.component';
import { ContextMenuService } from 'ngx-contextmenu';
import { CodeService } from '../../../../shared/services/code.service';
import { QuotesRetrievalService } from '../../../../shared/services/quotes-retrieval.service';
import { UserService } from '../../../../shared/services/user.service';

@Component({
  selector: 'app-code-item',
  templateUrl: './code-item.component.html',
  styleUrls: ['./code-item.component.css'],
  providers: [Modal, ContextMenuService]
})
export class CodeItemComponent implements OnInit {

  @Input() code: Code;
  menuOptions: MenuOption[][] = [];
  options = new OptionsComponent();
  permissions: Array<string>;

  constructor(private modal: Modal, private quoteService: QuoteService,
    private workspaceService: WorkSpaceService,
    private contextMenuService: ContextMenuService,
    private codeService: CodeService,
    private userService: UserService,
    private quoteRetrievalService: QuotesRetrievalService) {
  }

  ngOnInit() {
    this.userService.getRolePermissions().subscribe(
      permissions => {
        this.permissions = permissions;
      },
      error => { console.error(error); }
    );
    this.createMenuOptions();
  }

  public onOpenCode() {
    this.modal.open(CodeModalComponent, overlayConfigFactory({ code: this.code, mode: 'new' }, BSModalContext))
      .then((resultPromise) => {
        resultPromise.result.then((result) => {
          if (result === -1) {
            if (this.quoteService.removeCodeFromQuotes(this.code.getId())) {
              this.workspaceService.updateDocumentContent();
            }
          }
        });
      });
  }

  private createMenuOptions() {
    this.menuOptions = [[
      new MenuOption('Activar', (item) => { this.onActivateCode(); }),
      new MenuOption('Desactivar', (item) => { this.onDeactivateCode(); })
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
      item: this.code
    });
    $event.preventDefault();
    $event.stopPropagation();
  }

  private defineMenuOptions() {
    if (this.code.isActivated()) {
      this.menuOptions[0][0].setVisible(false);
      this.menuOptions[0][1].setVisible(true);
    } else {
      this.menuOptions[0][0].setVisible(true);
      this.menuOptions[0][1].setVisible(false);
    }
    if (this.permissions) {
      if (this.permissions.includes('activate_code')) {
        this.menuOptions[0][0].enable();
        this.menuOptions[0][1].enable();
      } else {
        this.menuOptions[0][0].disable();
        this.menuOptions[0][1].disable();
      }
    }
  }

  public getItemClass() {
    return this.code.isActivated() ? 'list-item-selected' : 'list-item';
  }

  public onActivateCode() {
    this.code.activate();
    this.codeService.setActivatedCode(this.code);
    this.quoteRetrievalService.addCode(this.code);
  }

  public onDeactivateCode() {
    this.code.deactivate();
    this.codeService.removeActivatedCode(this.code);
    this.quoteRetrievalService.removeCode(this.code);
  }

}
