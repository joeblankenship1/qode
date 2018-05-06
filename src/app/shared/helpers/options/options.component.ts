import { Component, OnInit, ViewChild, Input, OnChanges } from '@angular/core';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { MenuOption } from '../../models/menu-option.model';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {

  @ViewChild(ContextMenuComponent) public optionsMenu: ContextMenuComponent;
  @Input() optionGroups: MenuOption[][];
  private defaultOptions: MenuOption[];

  constructor() {
  }

  ngOnInit() {
    this.defaultOptions = this.getDefaultOptions();
    // this.optionGroups.push(this.defaultOptions);
  }

  private getDefaultOptions() {
    return [new MenuOption('Copiar', (item) => {document.execCommand('copy'); })];
  }

}
