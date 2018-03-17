import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WorkSpaceService } from '../../../shared/services/work-space.service';
import { DocumentService } from '../../../shared/services/document.service';
import { NotificationsService } from 'angular2-notifications';
import { Quote } from '../../../shared/models/quote.model';
import { WindowSelection } from '../../../shared/helpers/window-selection';
import { LineDefinition } from '../../../shared/helpers/line-definition';
import { Line } from '../../../shared/models/line.model';
import { AppSettings } from '../../../app.settings';
@Component({
  selector: 'app-search-in-open-docs',
  templateUrl: './search-in-open-docs.component.html',
  styleUrls: ['./search-in-open-docs.component.css']
})
export class SearchInOpenDocsComponent implements OnInit {

  documentContent;
  searchActive = false;
  total = 0;
  position = 0;
  docIndex = 0;
  strOcurrence = new Array();
  ocurrenceIndex = 0;
  selectedDoc;
  lines_prev;
  lines = new Array();
  str = '';
  @ViewChild('inputsearch') inputEl: ElementRef;


  constructor(private workspaceService: WorkSpaceService,
    private documentService: DocumentService,
    private notificationsService: NotificationsService,
    private windowSelection: WindowSelection
  ) { }

  ngOnInit() {
    this.inputEl.nativeElement.focus();
    this.workspaceService.getDocumentContents().subscribe(docs => {
      this.documentContent = docs;
    });

    this.workspaceService.getSelectedDocument().subscribe(doc => {
      this.selectedDoc = doc;
    });
  }

  valuechange(e) {
    this.searchActive = false;
    this.str = '';
  }

  onFormSubmit(f) {
    this.unhighlight();
    this.str = f.searchtext;
    this.buscarTexto();
  }

  onClose() {
    this.unhighlight();
    this.searchActive = false;
    this.workspaceService.setPopup(false);
  }

  getIndicesOf(searchStr, text, caseSensitive) {
    const original = text;
    text = text.replace(/\s\s+/g, ' ');
    const searchStrLen = searchStr.length;
    if (searchStrLen === 0) { return []; }
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
      } else { indices.push(index); }
      startIndex = index + searchStrLen;
    }
    return indices;
  }

  buscarTexto() {
    // If search is active, show next result, else, do search
    if (this.searchActive) {
      this.showNext();
    } else {
      this.str = this.str.replace(/\s\s+/g, ' ');
      this.total = 0;
      // Count the ocurrence of string in each document content
      this.strOcurrence = new Array();
      this.documentContent.forEach((docContent, indxDoc) => {
        const ocurrenceIndexes = this.getIndicesOf(this.str, docContent.document.text, true);
        this.strOcurrence.push({ doc: docContent.document, ocurrenceIndexes: ocurrenceIndexes });
      });
      //  Case of empty result
      if (this.strOcurrence.findIndex(d => d.doc.opened && d.ocurrenceIndexes.length > 0) === -1) {
        this.notificationsService.info('Error', 'No hay resultados para la búsqueda');
        return;
      }
      this.searchActive = true;
      this.ocurrenceIndex = 0;
      // Finds index of the actual doc, to show results in order
      this.docIndex = this.strOcurrence.findIndex(d => d.doc.getId() === this.selectedDoc.getId());
      if (this.strOcurrence[this.docIndex].ocurrenceIndexes.length === 0) {
        this.getNextDocIndex();
      }
      this.strOcurrence.forEach(d => this.total += d.ocurrenceIndexes.length);
      this.position = 1;
      this.showQuote();
    }
  }

  showQuote() {
    this.unhighlight();
    const doc = this.documentContent[this.docIndex];
    let startLine, startLineOffset, startPage;
    [startPage, startLine, startLineOffset] =
      this.getStartPosition(doc, this.strOcurrence[this.docIndex].ocurrenceIndexes[this.ocurrenceIndex]);

    const sc = document.querySelector('tr.linea' + startLine);
    if (sc) { sc.scrollIntoView(); }

    let p = startPage;
    let l = startLine;
    let lindx = l % AppSettings.PAGE_SIZE;

    let strTailLenght = this.str.length;
    while (strTailLenght > 0) {
      l = doc.pages[p].lines[lindx];
      const finishLineOffset = strTailLenght < (l.text.length - startLineOffset) ? strTailLenght + startLineOffset : l.text.length;
      const isFirstLine = true;
      const isLastLine = strTailLenght < (l.text.length - startLineOffset);
      l.setTextColor(startLineOffset, finishLineOffset, isFirstLine, isLastLine, 1);
      this.lines.push({
        line: l, startLineOffset: startLineOffset, finishLineOffset: finishLineOffset,
        isFirstLine: isFirstLine, isLastLine: isLastLine
      });
      strTailLenght = strTailLenght - (l.text.length - startLineOffset);
      if (l.text.length !== 0) {
        strTailLenght = strTailLenght - 1;
      }
      startLineOffset = 0;

      if (lindx === (AppSettings.PAGE_SIZE - 1)) {
        p++;
        lindx = 0;
      } else {
        lindx++;
      }
    }
    this.lines_prev = this.lines;
  }

  showNext() {
    this.position = (this.position === this.total) ? 1 : this.position + 1;
    if (this.ocurrenceIndex === this.strOcurrence[this.docIndex].ocurrenceIndexes.length - 1) {
      this.getNextDocIndex();
      this.ocurrenceIndex = 0;
    } else { this.ocurrenceIndex++; }
    this.showQuote();
  }

  getNextDocIndex() {
    this.docIndex = (this.docIndex === this.strOcurrence.length - 1) ? 0 : this.docIndex + 1;
    while (this.strOcurrence[this.docIndex].ocurrenceIndexes.length === 0) {
      this.docIndex = (this.docIndex === this.strOcurrence.length - 1) ? 0 : this.docIndex + 1;
    }
    if (this.strOcurrence[this.docIndex].doc.getId() !== this.selectedDoc.getId()) {
      this.workspaceService.selectDocument(this.strOcurrence[this.docIndex].doc);
    }
  }

  showPrevious() {
    this.position = (this.position === 1) ? this.total : this.position - 1;
    if (this.ocurrenceIndex === 0) {
      this.getPreviousDocIndex();
      this.ocurrenceIndex = this.strOcurrence[this.docIndex].ocurrenceIndexes.length - 1;
    } else { this.ocurrenceIndex--; }
    this.showQuote();
  }

  getPreviousDocIndex() {
    this.docIndex = (this.docIndex === 0) ? this.strOcurrence.length - 1 : this.docIndex - 1;
    while (this.strOcurrence[this.docIndex].ocurrenceIndexes.length === 0) {
      this.docIndex = (this.docIndex === 0) ? this.strOcurrence.length - 1 : this.docIndex - 1;
    }
    if (this.strOcurrence[this.docIndex].doc.getId() !== this.selectedDoc.getId()) {
      this.workspaceService.selectDocument(this.strOcurrence[this.docIndex].doc);
    }
  }

  unhighlight() {
    // Unhighlight previous search
    if (this.lines_prev) {
      this.lines_prev.forEach(o => {
        o.line.setTextColor(o.startLineOffset, o.finishLineOffset, o.isFirstLine, o.isLastLine, 0);
      });
    }
  }

  getStartPosition(doc, indexOf) {
    let offset = 0;
    let lineId = 0;
    const pages = doc.pages;
    for (let i = 0; i < pages.length; i++) {
      const lines = pages[i].lines;
      for (let j = 0; j < lines.length; j++) {
        if (indexOf >= offset && indexOf <= offset + lines[j].text.length) {
          return [i, lineId, indexOf - offset];
        }
        offset += lines[j].text.length + 1; // One for end of line
        lineId = (lineId + 1);
      }
    }
    return [-1, -1, -1];
  }

}
