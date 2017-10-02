import { Injectable } from '@angular/core';

@Injectable()
export class WindowSelection {

  constructor() { }

  nextNode(node) {
    if (node.hasChildNodes()) {
      return node.firstChild;
    } else {
      while (node && !node.nextSibling) {
        node = node.parentNode;
      }
      if (!node) {
        return null;
      }
      return node.nextSibling;
    }
  }

  getRangeSelectedNodes(range, filterTag) {
    let node = range.startContainer;
    const endNode = range.endContainer;

    // Special case for a range that is contained within a single node
    if (node === endNode) {
      return [this.getAppLineFromText(range.commonAncestorContainer.parentElement, filterTag)];
    }

    // Iterate nodes until we hit the end container
    const rangeNodes = [];
    while (node && node !== endNode) {
      rangeNodes.push(node = this.nextNode(node));
    }

    // Add partially selected nodes at the start of the range
    node = range.startContainer;
    while (node && node !== range.commonAncestorContainer) {
      rangeNodes.unshift(node);
      node = node.parentNode;
    }

    return rangeNodes;
  }

  getSelectedNodes(selection, filterTag ) {
    if (selection) {
      if (!selection.isCollapsed) {
        return this.getRangeSelectedNodes(selection.getRangeAt(0), filterTag)
        .filter(n => n.localName === filterTag);
      }
    }
    return [];
  }

  getAppLineFromText(element, filterTag) {
    if (element.localName === filterTag) {
      return element;
    }else {
      return this.getAppLineFromText(element.parentElement, filterTag);
    }
  }

}
