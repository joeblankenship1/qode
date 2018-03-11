import { Component, OnInit } from '@angular/core';
import { WorkSpaceService } from '../../../shared/services/work-space.service';
import { DocumentService } from '../../../shared/services/document.service';
import { NotificationsService } from 'angular2-notifications';
import { Quote } from '../../../shared/models/quote.model';
import { WindowSelection } from '../../../shared/helpers/window-selection';
import { LineDefinition } from '../../../shared/helpers/line-definition';
import { Line } from '../../../shared/models/line.model';
@Component({
  selector: 'app-search-in-open-docs',
  templateUrl: './search-in-open-docs.component.html',
  styleUrls: ['./search-in-open-docs.component.css']
})
export class SearchInOpenDocsComponent implements OnInit {

  documentContent;
  searchActive = false;
  docIndex = 0;
  strOcurrence = new Array();
  ocurrenceIndex = 0;
  selectedDoc;
  q_ant;

  constructor(private workspaceService: WorkSpaceService,
    private documentService: DocumentService,
    private notificationsService: NotificationsService,
    private windowSelection: WindowSelection
  ) { }

  ngOnInit() {
    this.workspaceService.getDocumentContents().subscribe(docs => {
      this.documentContent = docs;
      this.searchActive = false;
    });

    this.workspaceService.getSelectedDocument().subscribe(doc => {
      this.selectedDoc = doc;
    });
  }

  valuechange(e) {
    this.searchActive = false;
  }

  onFormSubmit(f) {
    this.buscarTexto(f.searchtext);
  }

  onClose() {
    this.workspaceService.setPopup(false);
  }

  getIndicesOf(searchStr, text, caseSensitive) {
    const original = text;
    text = text.replace(/\s\s+/g, ' ');
    const searchStrLen = searchStr.length;
    if (searchStrLen === 0) {
      return [];
    }
    let startIndex = 0, index;
    const indices = [];
    if (!caseSensitive) {
      text = text.toLowerCase();
      searchStr = searchStr.toLowerCase();
    }
    while ((index = text.indexOf(searchStr, startIndex)) > -1) {
      const aux = original.substring(0, index + 2).match(/\s\s+/g);
      if (aux) {
        indices.push(index + aux.length);
      } else {
        indices.push(index);
      }
      startIndex = index + searchStrLen;
    }
    return indices;
  }

  buscarTexto(str) {
    str = str.replace(/\s\s+/g, ' ');
    if (this.searchActive) {
      this.showNext(str);
    } else {
      // Count the ocurrence of string in each document content
      this.strOcurrence = new Array();
      this.documentContent.forEach((docContent, indxDoc) => {
        const ocurrenceIndexes = this.getIndicesOf(str, docContent.document.text, true); // todos los indices de ocurrencia en ese documento
        this.strOcurrence.push({ doc: docContent.document, ocurrenceIndexes: ocurrenceIndexes });
      });
      //  Alguna ocurrencia en documento abierto tiene que ser mayor de cero, sino notifico.
      if (this.strOcurrence.findIndex(d => d.doc.opened && d.ocurrenceIndexes.length > 0) === -1) {
        this.notificationsService.info('Error', 'No hay resultados para la búsqueda');
        return;
      }
      // Guardo el indice el documento que estoy parada para inicializar.
      this.docIndex = this.strOcurrence.findIndex(d => d.doc.name === this.selectedDoc.name);
      // Verifico si este documento tiene ocurrencia, sino busco el siguiente con ocurrencia;
      // to do, buscar en orden a partir del doc seleccionado
      if (this.strOcurrence[this.docIndex].ocurrenceIndexes.length === 0) {
        this.docIndex = this.strOcurrence.findIndex(d => d.doc.opened && d.ocurrence > 0);
      }
      this.ocurrenceIndex = 0;
      this.searchActive = true;
      console.log(this.strOcurrence);
      this.showQuote(str);
    }
  }

  showQuote(str) {
    const doc = this.documentContent[this.docIndex];
    let startLine, startLineOffset;
    [startLine, startLineOffset] = this.getStartPosition(doc, this.strOcurrence[this.docIndex].ocurrenceIndexes[this.ocurrenceIndex]);
    const element = document.getElementById(startLine.toString());
    element.scrollIntoView();

    const startPage = this.getPageWithLine(doc, startLine);
    const indxLineAux = this.getIndxLine(doc, startPage, startLine);

    let p = startPage;
    let l = startLine;
    let lindx = l % 40;

    let strTailLenght = str.length;
    let i = 0;
    let firstrow = true;
    let finishLine;
    let finishLineOffset = strTailLenght;

    const pagesAux = [];
    while (strTailLenght > 0 && i < 100) {
      l = doc.pages[p].lines[lindx];
      if (firstrow) {
        finishLineOffset = startLineOffset + strTailLenght;
        strTailLenght = strTailLenght - (l.text.length - startLineOffset);
        firstrow = false;
      } else {
        finishLineOffset = strTailLenght;
        strTailLenght = strTailLenght - l.text.length;
      }
      if (strTailLenght > 0) {
        if (39 === lindx) {
          pagesAux.push({ page: p, startLine: startLine, endLine: lindx });
          p++;
          startLine = 0;
          lindx = 0;
        } else {
          lindx++;
        }
        i++;
      }
    }

    // finishLineOffset = strTailLenght;
    finishLine = lindx;

    pagesAux.push({ page: p, startLine: startLine * 40 * p, endLine: lindx * 40 * p});
    const q = new Quote(str, startLineOffset, finishLineOffset, pagesAux, this.workspaceService.getProjectId());
    console.log(q);

    // if (this.q_ant) {
    //   doc.setLinesColor({ quote: this.q_ant, column: 1, borderTop: true, borderBottom: true }, 0, false);
    // }
    // this.q_ant = q;

    doc.setLinesColor({ quote: q, column: 1, borderTop: true, borderBottom: true }, 1, true);
  }

  showNext(str) {
    if (this.ocurrenceIndex >= this.strOcurrence[this.docIndex].ocurrenceIndexes.length - 1) {
      this.getNextDocIndex();
      this.ocurrenceIndex = 0;
    } else {
      this.ocurrenceIndex++;
    }
    console.log('(' + this.docIndex + ',' + this.ocurrenceIndex + ')');
    this.showQuote(str);
  }

  getNextDocIndex() {
    if (this.docIndex === this.strOcurrence.length - 1) {
      this.docIndex = 0;
    } else {
      this.docIndex++;
    }
    this.workspaceService.selectDocument(this.strOcurrence[this.docIndex].doc);
  }

  getPageWithLine(doc, line) {
    for (let i = 0; i < doc.pages.length; i++) {
      if (doc.pages[i].lines.find(l => l.id === line)) {
        return i;
      }
    }
    return -1;
  }

  getIndxLine(doc, page, line) {
    return (doc.pages[page].lines.find(l => l.id === line));
  }

  getStartPosition(doc, indexOf) {
    console.log('index a buscar ' + indexOf);
    let offset = 0;
    let lineId = 0;
    const pages = doc.pages;
    for (let i = 0; i < pages.length; i++) {
      const lines = pages[i].lines;
      for (let j = 0; j < lines.length; j++) {
        if (indexOf >= offset && indexOf <= offset + lines[j].text.length) {
          // console.log(lineId + ' ' + lines[j].text + ' ' + offset);
          return [lineId, indexOf - offset];
        }
        // console.log(lineId + ' ' + lines[j].text + ' ' + offset);
        offset += lines[j].text.length + 1; // El uno es por el salto de linea
        lineId = (lineId + 1);
      }
    }
    return [-1, -1];
  }

}
