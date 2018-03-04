import { Component, OnInit } from '@angular/core';
import { WorkSpaceService } from '../../../shared/services/work-space.service';
import { DocumentService } from '../../../shared/services/document.service';
import { NotificationsService } from 'angular2-notifications';
import { Quote } from '../../../shared/models/quote.model';
import { WindowSelection } from '../../../shared/helpers/window-selection';

@Component({
  selector: 'app-search-in-open-docs',
  templateUrl: './search-in-open-docs.component.html',
  styleUrls: ['./search-in-open-docs.component.css']
})
export class SearchInOpenDocsComponent implements OnInit {

  searchtext = '';
  documentContent;
  searchActive = false;
  searchResult = new Array();
  virtualQuoteRes = new Array();
  docIndex = 0;
  resultIndex = 0;
  oldRange;
  strOcurrence = new Array();
  ocurrencIndex = 0;
  selectedDoc;

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

  valuechange() {
    this.searchResult = new Array();
    this.virtualQuoteRes = new Array();
    this.resultIndex = 0;
    this.searchActive = false;
  }

  onFormSubmit(f) {
    this.buscarTexto(f.searchtext);
  }

  onClose() {
    this.workspaceService.setPopup(false);
  }


  // -----------------------------------
  // ------ FORMA CON WINDOW FIND ------
  // -----------------------------------

  // makeEditableAndHighlight(colour) {
  //   const sel = window.getSelection();
  //   let range = null;
  //   if (sel.rangeCount && sel.getRangeAt) {
  //     range = sel.getRangeAt(0);
  //     document.designMode = 'on';
  //     sel.removeAllRanges();
  //     sel.addRange(range);
  //   }
  //   if (!document.execCommand('HiliteColor', false, colour)) {
  //     document.execCommand('BackColor', false, colour);
  //   }
  //   document.designMode = 'off';
  // }

  // highlight(colour) {
  //   let range = null;
  //   const sel = null;
  //   if (window.getSelection) {
  //     // IE9 and non-IE
  //     try {
  //       if (!document.execCommand('BackColor', false, colour)) {
  //         this.makeEditableAndHighlight(colour);
  //       }
  //     } catch (ex) {
  //       this.makeEditableAndHighlight(colour);
  //     }
  //   } else if ((<any>document).selection && (<any>document).selection.createRange) {
  //     // IE <= 8 case
  //     range = (<any>document).selection.createRange();
  //     range.execCommand('BackColor', false, colour);
  //   }
  // }

  // buscarTexto(str) {
  //   const parent = document.getElementsByTagName('app-document-content')[0];
  //   if (this.searchActive) {
  //     this.showNext(str);
  //   } else {
  //     // Count the ocurrence of string in each document content
  //     this.strOcurrence = new Array();
  //     this.documentContent.forEach((docContent, indxDoc) => {
  //       this.strOcurrence.push({ doc: docContent.document, ocurrence: docContent.document.text.split(str).length - 1 });
  //     });
  //     //  Alguna ocurrencia en documento abierto tiene que ser mayor de cero, sino notifico.
  //     if (this.strOcurrence.findIndex(d => d.doc.opened && d.ocurrence > 0) === -1) {
  //       this.notificationsService.info('Error', 'No hay resultados para la búsqueda');
  //       return;
  //     }
  //     // Guardo el indice el documento que estoy parada para inicializar.
  //     this.docIndex = this.strOcurrence.findIndex(d => d.doc.name === this.selectedDoc.name);
  //     this.ocurrencIndex = 0;
  //     console.log('doc index: ' + this.docIndex + 'ocu inde: ' + this.ocurrencIndex);
  //     console.log(this.strOcurrence);
  //     const sel = window.getSelection();
  //     sel.collapse(document.body, 0);
  //     this.searchActive = true;
  //     this.showNext(str);
  //   }
  // }

  // // window.find(aString, aCaseSensitive, aBackwards, aWrapAround, aWholeWord, aSearchInFrames, aShowDialog);
  // showNext(str) {
  //   if (this.ocurrencIndex === this.strOcurrence[this.docIndex].ocurrence) {
  //     this.getNextDocIndex();
  //     this.ocurrencIndex = 0;
  //   } else {
  //     this.ocurrencIndex++;
  //   }
  //   console.log('doc index: ' + this.docIndex + 'ocu inde: ' + this.ocurrencIndex);
  //   while ((<any>window).find(str, true, true, true) && !this.isInDocumentContent()) {
  //     console.log(this.isInDocumentContent());
  //   }
  //   // to do -> scroll to get selection
  // }

  // showPrevious(str) {
  //   if (this.ocurrencIndex === 0) {
  //     this.getPrevDocIndex();
  //     this.ocurrencIndex = this.strOcurrence[this.docIndex].ocurrence;
  //   } else {
  //     this.ocurrencIndex--;
  //   }
  //   console.log('doc index: ' + this.docIndex + 'ocu inde: ' + this.ocurrencIndex);
  //   while ((<any>window).find(str, true, false, true) && !this.isInDocumentContent()) {
  //     console.log(this.isInDocumentContent());
  //   }
  // }

  // getNextDocIndex() {
  //   let docWithOccurence = false;
  //   while (!docWithOccurence) {
  //     if (this.docIndex === this.strOcurrence.length - 1) {
  //       this.docIndex = 0;
  //       docWithOccurence = this.strOcurrence[this.docIndex].doc.opened && this.strOcurrence[this.docIndex].ocurrence > 0;
  //     } else {
  //       this.docIndex++;
  //       docWithOccurence = this.strOcurrence[this.docIndex].doc.opened && this.strOcurrence[this.docIndex].ocurrence > 0;
  //     }
  //   }
  //   this.workspaceService.selectDocument(this.strOcurrence[this.docIndex].doc);
  // }

  // getPrevDocIndex() {
  //   let docWithOccurence = false;
  //   while (!docWithOccurence) {
  //     if (this.docIndex === 0) {
  //       this.docIndex = this.strOcurrence.length - 1;
  //       docWithOccurence = this.strOcurrence[this.docIndex].doc.opened && this.strOcurrence[this.docIndex].ocurrence > 0;
  //     } else {
  //       this.docIndex--;
  //       docWithOccurence = this.strOcurrence[this.docIndex].doc.opened && this.strOcurrence[this.docIndex].ocurrence > 0;
  //     }
  //   }
  //   this.workspaceService.selectDocument(this.strOcurrence[this.docIndex].doc);
  // }

  // isInDocumentContent() {
  //   const parent = document.getElementsByTagName('app-document-content')[0];
  //   return window.getSelection().containsNode(parent, true);
  // }


  // --------------------------------------------------
  // ----- FORMA CON BUSQUEDA MANUAL SOBRE TABLA ------
  // --------------------------------------------------

  // onFormSubmit(f) {
  //   if (this.searchActive) {
  //     this.showNext();
  //   } else {
  //     this.searchActive = true;
  //     this.docIndex = 0;
  //     this.resultIndex = 0;
  //     // for each document
  //     this.documentContent.forEach((docContent, indxDoc) => {
  //       const virtualQuoteDoc = new Array();
  //       // for each page in doc
  //       docContent.pages.forEach((pages, indxPage) => {
  //         pages.lines.forEach((line, indxLine, linesArray) => { // CADA LINEA BUSCA EL PRINCIPIO EN ADELANTE
  //           let indxLineAux = indxLine;
  //           let startLine, finishLine, startLineOffset, finishLineOffset;
  //           startLine = indxLine;
  //           if (line.text.match(f.searchtext)) {
  //             // Find all in the same line
  //             console.log('encontre toda la linea');
  //             startLineOffset = linesArray[indxLineAux].text.indexOf(f.searchtext);
  //             finishLineOffset = startLineOffset + f.searchtext.length;
  //             virtualQuoteDoc.push(new Quote(f.searchtext, startLineOffset, finishLineOffset,
  //               [{ page: indxPage, startLine: startLine, endLine: startLine }], this.workspaceService.getProjectId()));
  //           } else {
  //             let searchtextA = f.searchtext.split(' ');
  //             searchtextA = searchtextA.filter(e => e !== '');
  //             // Si matchea la primer palabra empiezo a buscar
  //             if (linesArray[indxLineAux].text.match(searchtextA[0]) && searchtextA[1] !== null) {
  //               startLineOffset = linesArray[indxLineAux].text.indexOf(searchtextA[0]);
  //               let wordMatched = searchtextA[0];
  //               let i = 1;
  //               let finish = false;
  //               while (linesArray[indxLineAux].text.match(wordMatched) !== null && !finish) {
  //                 // tendria que controlar cuando avanzo de linea que empiecen con eso
  //                 if (searchtextA[i] === null) { // si el siguiente esta vacio
  //                   console.log('FIN MATCH');
  //                   finish = true;
  //                   //  termine la busqueda, deberia guardar y return;
  //                 } else {
  //                   // si estoy en el final
  //                   if (linesArray[indxLineAux].text.endsWith(wordMatched)) {
  //                     // buscar en linea siguiente
  //                     indxLineAux++;
  //                     console.log('LINEA:' + wordMatched);
  //                     console.log('SIGUIENTE LINEA');
  //                     while (searchtextA[i] === '' || searchtextA[i] === null) {
  //                       i++;
  //                     }
  //                     if (searchtextA[i] !== null) {
  //                       wordMatched = searchtextA[i];
  //                     } else {
  //                       finish = true;
  //                       finishLine = indxLineAux;
  //                       finishLineOffset = wordMatched.length;
  //                       console.log('finish por termine strng');
  //                       virtualQuoteDoc.push(new Quote(f.searchtext, startLineOffset, finishLineOffset,
  //                         [{ page: indxPage, startLine: startLine, endLine: finishLine }], this.workspaceService.getProjectId()));
  //                     }
  //                   } else {
  //                     if (searchtextA[i]) {
  //                       wordMatched += ' ' + searchtextA[i];
  //                     } else {
  //                       finish = true;
  //                       finishLine = indxLineAux;
  //                       finishLineOffset = wordMatched.length;
  //                       console.log('finish por termine strng');
  //                       virtualQuoteDoc.push(new Quote(f.searchtext, startLineOffset, finishLineOffset,
  //                         [{ page: indxPage, startLine: startLine, endLine: finishLine }], this.workspaceService.getProjectId()));
  //                     }
  //                   }
  //                   i++;
  //                 }
  //                 // quedan cosas en el array
  //                 // console.log(' MATCH ' + wordMatched);
  //               }
  //             }
  //             // const docResult = { document: docContent.document, indxDoc: indxDoc, indxPage: indxPage, indxLine: indxLine };
  //             // searchDoc.push(docResult);
  //           }
  //         });
  //       });
  //       if (virtualQuoteDoc.length !== 0) {
  //         this.virtualQuoteRes.push(virtualQuoteDoc);
  //       }
  //     });
  //     // if (this.searchResult.length !== 0) {
  //     //   this.showResult(this.searchResult[this.docIndex][this.resultIndex]);
  //     // } else {
  //     //   this.notificationsService.info('Error', 'No hay resultados para la búsqueda');
  //     // }
  //     console.log(this.virtualQuoteRes);
  //   }
  // }

  // showResult(result) {
  //   if (result !== undefined && result !== -1) {
  //     this.workspaceService.selectDocument(result.document);
  //     const element = document.getElementById(result.indxLine);
  //     element.scrollIntoView();
  //   }
  // }

  // showPrevious() {
  //   if (this.resultIndex === 0) {
  //     this.getPreviousDocIndex();
  //     this.resultIndex = this.searchResult[this.docIndex].length - 1;
  //   } else {
  //     this.resultIndex--;
  //   }
  //   console.log('(' + this.docIndex + ',' + this.resultIndex + ')');
  //   this.showResult(this.searchResult[this.docIndex][this.resultIndex]);
  // }

  // showNext() {
  //   if (this.resultIndex === this.searchResult[this.docIndex].length - 1) {
  //     this.getNextDocIndex();
  //     this.resultIndex = 0;
  //   } else {
  //     this.resultIndex++;
  //   }
  //   console.log('(' + this.docIndex + ',' + this.resultIndex + ')');
  //   this.showResult(this.searchResult[this.docIndex][this.resultIndex]);
  // }

  // getNextDocIndex() {
  //   if (this.docIndex === this.searchResult.length - 1) {
  //     this.docIndex = 0;
  //   } else {
  //     this.docIndex++;
  //   }
  // }

  // getPreviousDocIndex() {
  //   if (this.docIndex === 0) {
  //     this.docIndex = this.searchResult.length - 1;
  //   } else {
  //     this.docIndex--;
  //   }
  // }

  // --------------------------------------------------
  // ----- FORMA CON BUSQUEDA MANUAL SOBRE TABLA ------
  // --------------------------------------------------



}
