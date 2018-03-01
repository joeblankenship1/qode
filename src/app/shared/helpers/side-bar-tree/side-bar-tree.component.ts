import { Component, OnInit, ViewChild, AfterViewInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { TreeComponent, ITreeState, IActionMapping, TREE_ACTIONS, KEYS } from 'angular-tree-component';
import { MenuOption } from '../../models/menu-option.model';
import { OptionsComponent } from '../options/options.component';
import { CodeSystemService } from '../../services/code-system.service';
import { UserService } from '../../services/user.service';
import { ContextMenuService } from 'ngx-contextmenu';

@Component({
  selector: 'app-side-bar-tree',
  templateUrl: './side-bar-tree.component.html',
  styleUrls: ['./side-bar-tree.component.css']
})
export class SideBarTreeComponent implements OnInit, AfterViewInit {

  @ViewChild(TreeComponent)
  tree: TreeComponent;
  @Input() usesColor: boolean;
  @Input() treeTitle: string;
  @Input() inputNodes: any;

  @Output() ctlclick = new EventEmitter<any>();
  @Output() contextmenu = new EventEmitter<any>();


  state: ITreeState;
  nodes = [
    {
      id: '0',
      name: '',
      children: [],
      isExpanded: false
    }
  ];

  actionMapping: IActionMapping = {
    mouse: {
      contextMenu: (tree, node, $event) => {
        $event.preventDefault();
        this.contextmenu.emit({tree: tree, data: node.data.data, event: $event});
      },
      dblClick: (tree, node, $event) => {
        TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
      },
      click: (tree, node, $event) => {
        this.onClick(tree, node, $event);
      }
    },
    keys: {
      [KEYS.ENTER]: (tree, node, $event) => {
        if (!node.isLeaf) {
          TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
        }
      },
      [KEYS.RIGHT]: TREE_ACTIONS.DRILL_DOWN,
      [KEYS.LEFT]: TREE_ACTIONS.DRILL_UP,
      [KEYS.DOWN]: TREE_ACTIONS.NEXT_NODE,
      [KEYS.UP]: TREE_ACTIONS.PREVIOUS_NODE,
      [KEYS.SPACE]: TREE_ACTIONS.TOGGLE_SELECTED
    }
  };

  options = {
    nodeHeight: 23,
    actionMapping: this.actionMapping,
    allowDrag: (node) => {
      return true;
    },
    allowDrop: (node) => {
      return true;
    },
    useVirtualScroll: true,
    animateExpand: true,
    scrollOnActivate: true,
    animateSpeed: 30,
    animateAcceleration: 1.2
  };


  constructor () {
  }

  ngOnInit() {
    this.nodes[0].name = this.treeTitle;
    this.nodes[0].children = this.inputNodes;
  }

  ngAfterViewInit() {
    this.nodes[0].children = this.inputNodes;
    const firstRoot = this.tree.treeModel.roots[0];
    firstRoot.expand();
  }



  update() {
    this.tree.treeModel.update();
  }

  /*********************** Custom TreeNode functions ***********************/

  getNodeColor(node) {
    return node ? node.data.getColor() : 'black';
  }

  getNodeQuoteCount(node) {
    return node ? node.data.getQuoteCount() : 0;
  }

  getChildrenQuoteCount(node) {
    let count = 0;
    node.children.map(n => {
      if (n.children.length === 0) {
        count += this.getNodeQuoteCount(n);
      } else {
        count += this.getNodeQuoteCount(n) + this.getChildrenQuoteCount(n);
      }
    });
    return count;
  }

  getNodeItemClass(node) {
    if (node.data) {
      return node.data.isActivated() ? 'list-item-selected' : 'list-item';
    }
  }


  /*********************** Custom mouse/key events ***********************/

  onClick(tree, node, $event) {
    if ($event.shiftKey) {
      TREE_ACTIONS.TOGGLE_SELECTED_MULTI(tree, node, $event);
    } else if ($event.ctrlKey) {
      this.ctlclick.emit({tree: tree, data: node.data.data, event: $event});
    } else { TREE_ACTIONS.TOGGLE_SELECTED(tree, node, $event); }
  }



}
