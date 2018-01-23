import { Injectable } from '@angular/core';
import { AppSettings } from '../../app.settings';

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

  getSelectedNodes(selection, lineTag) {
    if (selection) {
      if (!selection.isCollapsed) {
        let rawList = this.getRangeSelectedNodes(selection.getRangeAt(0), lineTag)
          .filter(n => n.localName === lineTag && n.id !== '');
        rawList = rawList.filter((v, i) => {
          return rawList.indexOf(v) === i;
        });
        return this.createDocumentDisplay(rawList);
      }
    }
    return [];
  }

  getAppLineFromText(element, filterTag) {
    if (element.localName === filterTag) {
      return element;
    } else {
      return this.getAppLineFromText(element.parentElement, filterTag);
    }
  }

  createDocumentDisplay(list: any[]) {
    const result = [];
    const firstPage = Math.trunc(list[0].id / AppSettings.PAGE_SIZE);
    const lastPage = Math.trunc(list[list.length - 1].id / AppSettings.PAGE_SIZE);

    for ( let i = firstPage; i < lastPage + 1; i++) {
      result.push({
        page: i,
        startLine: i === firstPage ? parseInt(list[0].id, 0) :  i  * AppSettings.PAGE_SIZE,
        endLine: i === lastPage ? parseInt(list[list.length - 1].id, 0) : ( i + 1 ) * AppSettings.PAGE_SIZE - 1
      });
    }
   return result;

  }

  /*createDocumentDisplay(list: any[]) {
    const result = [];
    let page = -1;
    let startLine = 0;
    let endLine = 0;
    list.forEach( (line, i) => {
      if ( parseInt(line.parentElement.id, 0) !== page) {
        // page++;
        page = parseInt(line.parentElement.id, 0);
        startLine = parseInt(line.id, 0);
        endLine =  parseInt(line.id, 0);
      } else {
        endLine++;
      }
      if ( !list[i + 1] || parseInt(list[ i + 1].parentElement.id, 0) !== page) {
        result.push({
          page: page,
          startLine: startLine,
          endLine: line.outerText === '\n' ? endLine - 1 : endLine
        });
      }
    });
   return result;

  }*/

}
