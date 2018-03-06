import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ITreeOptions, TreeNode, TreeModel, TreeComponent, TREE_ACTIONS, KEYS, ITreeState, IActionMapping } from 'angular-tree-component';
import { CodeService } from '../../../shared/services/code.service';
import { WorkSpaceService } from '../../../shared/services/work-space.service';
import { Code } from '../../../shared/models/code.model';
import { CodeSystemService } from '../../../shared/services/code-system.service';
import { MenuOption } from '../../../shared/models/menu-option.model';
import { OptionsComponent } from '../../../shared/helpers/options/options.component';
import { ContextMenuService } from 'ngx-contextmenu';
import { UserService } from '../../../shared/services/user.service';
import { QuoteService } from '../../../shared/services/quote.service';
import { QuotesRetrievalService } from '../../../shared/services/quotes-retrieval.service';
import { CodeModalComponent } from '../../../header/code-modal/code-modal.component';
import { overlayConfigFactory } from 'angular2-modal';
import { BSModalContext, Modal } from 'angular2-modal/plugins/bootstrap';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { NotificationsService } from 'angular2-notifications';
import { SideBarTreeComponent } from '../../../shared/helpers/side-bar-tree/side-bar-tree.component';
import { ProjectService } from '../../../shared/services/project.service';

@Component({
  selector: 'app-code-system',
  templateUrl: './code-system.component.html',
  styleUrls: ['./code-system.component.css']
})
export class CodeSystemComponent implements OnInit {

  @ViewChild(SideBarTreeComponent)
  sideBarTree: SideBarTreeComponent;
  codes: Code[];
  permissions: Array<string>;
  spinner = false;
  noSelection = true;
  selectAllClass = '';
  menuOptions: MenuOption[][] = [];
  contextMenuOptions = new OptionsComponent();
  newCodeName = '';
  projectId: string;
  nodes: any;

  constructor(private codeSystemService: CodeSystemService,
    private modal: Modal, private quoteService: QuoteService,
    private workspaceService: WorkSpaceService,
    private contextMenuService: ContextMenuService,
    private codeService: CodeService,
    private userService: UserService,
    private quoteRetrievalService: QuotesRetrievalService,
    private spinnerService: SpinnerService,
    private notificationsService: NotificationsService) {
  }

  ngOnInit() {
    this.codeService.getCodes().subscribe(codes => {
      this.codes = codes;
      this.codeSystemService.getCodeSystem().subscribe(cs => {
        if (cs) {
          this.nodes = cs;
          this.sideBarTree.update(this.nodes);
        }
      });
    });
    this.spinnerService.getSpinner('code_list')
      .subscribe(
        state => {
          this.spinner = state;
        });
    this.createMenuOptions();
  }

  /*********************** Context Menu Definition ***********************/

  createMenuOptions() {
    this.menuOptions = [
      [new MenuOption('Editar', (item) => { this.onOpenCode(item); })],
      [new MenuOption('Activar', (item) => { this.onActivateCode(item); }),
      new MenuOption('Desactivar', (item) => { this.onDeactivateCode(item); })],
      [new MenuOption('Eliminar', (item) => { this.onDeleteCode(item); })]];
  }

  defineMenuOptions(code) {
    if (code) {
      if (code.isActivated()) {
        this.menuOptions[1][0].setVisible(false);
        this.menuOptions[1][1].setVisible(true);
      } else {
        this.menuOptions[1][0].setVisible(true);
        this.menuOptions[1][1].setVisible(false);
      }
      if (this.permissions) {
        if (this.permissions.includes('activate_code')) {
          this.menuOptions[1][0].enable();
          this.menuOptions[1][1].enable();
        } else {
          this.menuOptions[1][0].disable();
          this.menuOptions[1][1].disable();
        }
      }
    }
  }

  /********************** Events **************************/

  onAddCode() {
    if (this.newCodeName == null || this.newCodeName === '') {
      return;
    }
    const code = new Code({
      'name': this.newCodeName, 'description': '',
      'project': this.workspaceService.getProjectId()
    });
    this.codeService.addCode(code)
      .subscribe(
        resp => {
          this.codeSystemService.addNodeCodeSystem(code);
        },
        error => {
          this.notificationsService.error('Error al guardar', error);
          console.error(error);
        });
    this.newCodeName = '';
  }

  onContextMenu({ tree, data, event }): void {
    if (data) {
      this.defineMenuOptions(data);
      this.contextMenuService.show.next({
        contextMenu: this.contextMenuOptions.optionsMenu,
        event: event,
        item: data
      });
    }
  }

  onCtlClick({ tree, data, $event }) {
    data.isActivated()
      ? this.onDeactivateCode(data)
      : this.onActivateCode(data);
  }

  onOpenCode(code) {
    this.modal.open(CodeModalComponent, overlayConfigFactory({ code: code, mode: 'new' }, BSModalContext))
      .then((resultPromise) => {
        resultPromise.result.then((result) => {
          if (result === -1) {
            if (this.quoteService.removeCodeFromQuotes(code.getId())) {
              this.workspaceService.updateDocumentContent();
            }
          }
        });
      });
  }

  onActivateCode(code) {
    code.activate();
    this.codeService.setActivatedCode(code);
    this.quoteRetrievalService.addCode(code);
  }

  onDeactivateCode(code) {
    code.deactivate();
    this.codeService.removeActivatedCode(code);
    this.quoteRetrievalService.removeCode(code);
  }

  onSelectAll() {
    this.codes.map(c => {
      this.noSelection ? c.activate() : c.deactivate();
      this.noSelection ? this.codeService.setActivatedCode(c)
        : this.codeService.removeActivatedCode(c);
      this.noSelection ? this.quoteRetrievalService.addCode(c)
        : this.quoteRetrievalService.removeCode(c);
    });
    this.noSelection = !this.noSelection;
    this.noSelection ? this.selectAllClass = '' : this.selectAllClass = 'action-selected';
  }

  onDeleteCode(code) {
    const dialogRef = this.modal.confirm().size('lg').isBlocking(true).showClose(true).keyboard(27)
      .okBtn('Confirmar').okBtnClass('btn btn-info').cancelBtnClass('btn btn-danger')
      .title('Eliminar código').body(' ¿Seguro que desea eliminar el código y todos sus subcódigos? ').open();
    dialogRef
      .then(r => {
        r.result
          .then(result => {
            this.codeService.deleteCode(code).subscribe( resp => {
              this.codeSystemService.removeNodeCodeSystem(code.getId());
            });
          })
          .catch(error =>
            console.log(error)
          );
      });
  }

  onDrop($event) {
    this.onChangeCodeSystem();
  }

  onChangeCodeSystem() {
    const codeSystem = JSON.parse(localStorage.getItem('code-system'));
    if (codeSystem) {
      this.codeSystemService.updateCodeSystem(codeSystem);
    }
  }

}
