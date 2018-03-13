import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SpinnerService {

  private spinnerDocument = false;
  private spinnerDocument$ = new BehaviorSubject<boolean>(false);
  private spinnerCoding = false;
  private spinnerCoding$ = new BehaviorSubject<boolean>(false);
  private spinnerDocumentList = false;
  private spinnerDocumentList$ = new BehaviorSubject<boolean>(false);
  private spinnerProjects = false;
  private spinnerProjects$ = new BehaviorSubject<boolean>(false);
  private spinnerProjectsImportCodes = false;
  private spinnerProjectsImportCodes$ = new BehaviorSubject<boolean>(false);
  private spinnerCodeList = false;
  private spinnerCodeList$ = new BehaviorSubject<boolean>(false);

  constructor() { }

  getSpinner(spinner) {
    switch (spinner) {
      case 'document':
        return this.spinnerDocument$.asObservable();
      case 'coding':
        return this.spinnerCoding$.asObservable();
      case 'document_list':
        return this.spinnerDocumentList$.asObservable();
      case 'projects':
        return this.spinnerProjects$.asObservable();
      case 'projects_import_codes':
        return this.spinnerProjectsImportCodes$.asObservable();
      case 'code_list':
        return this.spinnerCodeList$.asObservable();
    }
  }

  setSpinner(spinner, state) {
    switch (spinner) {
      case 'document':
        this.spinnerDocument = state;
        this.spinnerDocument$.next(this.spinnerDocument);
        break;
      case 'coding':
        this.spinnerCoding = state;
        this.spinnerCoding$.next(this.spinnerCoding);
        break;
      case 'document_list':
        this.spinnerDocumentList = state;
        this.spinnerDocumentList$.next(this.spinnerDocumentList);
        break;
      case 'projects':
        this.spinnerProjects = state;
        this.spinnerProjects$.next(this.spinnerProjects);
        break;
      case 'projects_import_codes':
        this.spinnerProjectsImportCodes = state;
        this.spinnerProjectsImportCodes$.next(this.spinnerProjectsImportCodes);
        break;
      case 'code_list':
        this.spinnerCodeList = state;
        this.spinnerCodeList$.next(this.spinnerCodeList);
        break;
    }
  }
}
