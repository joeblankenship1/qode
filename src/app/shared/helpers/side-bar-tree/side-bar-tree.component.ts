import { Component, OnInit, ViewChild, AfterViewInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { TreeComponent, ITreeState, IActionMapping, TREE_ACTIONS, KEYS, TreeModel, TreeNode } from 'angular-tree-component';
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
  @Output() dropelem = new EventEmitter<any>();


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
        this.contextmenu.emit({ tree: tree, data: node.data.data, event: $event });
      },
      dblClick: (tree, node, $event) => {
        TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
      },
      click: (tree, node, $event) => {
        this.onClick(tree, node, $event);
      },
      drop: (tree: TreeModel, node: TreeNode, $event: any, {from, to}) => {
        TREE_ACTIONS.MOVE_NODE(tree, node, $event, {from, to} );
        this.onDrop(tree, $event);
        // use from to get the dragged node.
        // use to.parent and to.index to get the drop location
        // use TREE_ACTIONS.MOVE_NODE to invoke the original action
      },
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
    nodeHeight: 20,
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


  constructor() {
  }

  ngOnInit() {
    this.nodes[0].name = this.treeTitle;
    this.nodes[0].children = this.inputNodes;
  }

  ngAfterViewInit() {
    this.nodes[0].children = this.inputNodes;
    const firstRoot = this.tree.treeModel.roots[0];
    firstRoot.expandAll();
  }


  update(nodes) {
    if (nodes) {
      this.nodes[0].children = nodes;
      this.tree.treeModel.update();
      const firstRoot = this.tree.treeModel.roots[0];
      firstRoot.expandAll();
    }
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
    if (node.children) {
      node.children.map(n => {
        if (n.children.length === 0) {
          count += this.getNodeQuoteCount(n);
        } else {
          count += this.getNodeQuoteCount(n) + this.getChildrenQuoteCount(n);
        }
      });
    }
    return count;

  }

  getNodeItemClass(node) {
    if (node.data) {
      return node.data.isActivated() ? 'list-item-selected' : 'list-item';
    }
  }


  setTreeState(tree) {
    localStorage.setItem('code-system', JSON.stringify(tree.nodes[0].children));
  }

  /*********************** Custom mouse/key events ***********************/

  onClick(tree, node, $event) {
    if ($event.shiftKey) {
      TREE_ACTIONS.TOGGLE_SELECTED_MULTI(tree, node, $event);
    } else if ($event.ctrlKey) {
      this.ctlclick.emit({ tree: tree, data: node.data.data, event: $event });
    } else { TREE_ACTIONS.TOGGLE_SELECTED(tree, node, $event); }
  }

  onDrop(tree, $event) {
    this.setTreeState(tree);
    this.dropelem.emit($event);
  }


}
