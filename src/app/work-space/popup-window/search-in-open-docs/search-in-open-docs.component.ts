import { Component, OnInit } from '@angular/core';
import { WorkSpaceService } from '../../../shared/services/work-space.service';
import { DocumentService } from '../../../shared/services/document.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-search-in-open-docs',
  templateUrl: './search-in-open-docs.component.html',
  styleUrls: ['./search-in-open-docs.component.css']
})
export class SearchInOpenDocsComponent implements OnInit {

  searchtext = '';
  documentContentAnt;
  documentContent;
  searchActive = false;
  searchResult = new Array();
  docIndex = 0;
  resultIndex = 0;

  constructor(private workspaceService: WorkSpaceService,
    private documentService: DocumentService,
    private notificationsService: NotificationsService
  ) { }

  ngOnInit() {
    this.workspaceService.getDocumentContents().subscribe(docs => {
      // docs.forEach(element => {
      // }); // REVISAR SOLO LOS ABIERTOS
      if (this.searchActive && this.documentContent.length === docs.length) {
        //  revisar si la cantidad de documentos abiertos es la misma
        // console.log(this.documentContent);
        console.log('actualice contentss');
        console.log(docs);
        //  buscar que documento cambio y actualizar la busqueda para ese documento
      }
      this.documentContent = docs;
      this.documentContentAnt = docs;
    });
  }

  valuechange() {
    this.searchResult = new Array();
    this.docIndex = 0;
    this.resultIndex = 0;
    this.searchActive = false;
  }

  onFormSubmit(f) {
    if (this.searchActive) {
      this.showNext();
    } else { 
      this.searchActive = true;
      this.docIndex = 0;
      this.resultIndex = 0;
      // for each document
      this.documentContent.forEach((docContent, indxDoc) => {
        const searchDoc = new Array();
        // for each page in doc
        docContent.pages.forEach((pages, indxPage) => {
          pages.lines.forEach((line, indxLine) => { // CADA LINEA BUSCA EL PRINCIPIO EN ADELANTE
            if (line.text.match(f.searchtext)) {
              // console.log(docContent.document.name, indxDoc, pages.id, indxPage, line.text, indxLine);
              const docResult = { document: docContent.document, indxDoc: indxDoc, indxPage: indxPage, indxLine: indxLine };
              searchDoc.push(docResult);
            }
          });
        });
        if (searchDoc.length !== 0) {
          this.searchResult.push(searchDoc);
        }
      });
      if (this.searchResult.length !== 0) {
        this.showResult(this.searchResult[this.docIndex][this.resultIndex]);
      } else {
        this.notificationsService.info('Error', 'No hay resultados para la búsqueda');
      }
    }
  }

  showResult(result) {
    if (result !== undefined && result !== -1) {
      this.workspaceService.selectDocument(result.document);
      const element = document.getElementById(result.indxLine);
      element.scrollIntoView();
    }
  }

  showPrevious() {
    if (this.resultIndex === 0) {
      this.getPreviousDocIndex();
      this.resultIndex = this.searchResult[this.docIndex].length - 1;
    } else {
      this.resultIndex--;
    }
    console.log('(' + this.docIndex + ',' + this.resultIndex + ')');
    this.showResult(this.searchResult[this.docIndex][this.resultIndex]);
  }

  showNext() {
    if (this.resultIndex === this.searchResult[this.docIndex].length - 1) {
      this.getNextDocIndex();
      this.resultIndex = 0;
    } else {
      this.resultIndex++;
    }
    console.log('(' + this.docIndex + ',' + this.resultIndex + ')');
    this.showResult(this.searchResult[this.docIndex][this.resultIndex]);
  }

  getNextDocIndex() {
    if (this.docIndex === this.searchResult.length - 1) {
      this.docIndex = 0;
    } else {
      this.docIndex++;
    }
  }

  getPreviousDocIndex() {
    if (this.docIndex === 0) {
      this.docIndex = this.searchResult.length - 1;
    } else {
      this.docIndex--;
    }
  }

  onClose() {
    this.workspaceService.setPopup(false);
  }
}
