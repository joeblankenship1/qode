import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SpinnerService {

  private spinnerDocument = false;
  private spinnerDocument$ = new BehaviorSubject<boolean>(false);
  private spinnerDocumentList = false;
  private spinnerDocumentList$ = new BehaviorSubject<boolean>(false);
  private spinnerProjects = false;
  private spinnerProjects$ = new BehaviorSubject<boolean>(false);

  constructor() { }

  getSpinner(spinner) {
    console.log('get ' + spinner);
    // if (spinner === 'document') {
    //   return this.spinnerDocument$.asObservable();
    // } else {
    //   return this.spinnerDocumentList$.asObservable();
    // }

    switch (spinner) {
      case 'document':
        return this.spinnerDocument$.asObservable();
      case 'document_list':
        return this.spinnerDocumentList$.asObservable();
      case 'projects':
        return this.spinnerProjects$.asObservable();
    }
  }

  setSpinner(spinner, state) {
    console.log('set ' + spinner + ' ' + state);
    // if (spinner === 'document') {
    //   this.spinnerDocument = state;
    //   this.spinnerDocument$.next(this.spinnerDocument);
    // } else {
    //   this.spinnerDocumentList = state;
    //   this.spinnerDocumentList$.next(this.spinnerDocumentList);
    // }

    switch (spinner) {
      case 'document':
        this.spinnerDocument = state;
        this.spinnerDocument$.next(this.spinnerDocument);
        break;
      case 'document_list':
        this.spinnerDocumentList = state;
        this.spinnerDocumentList$.next(this.spinnerDocumentList);
        break;
      case 'projects':
        this.spinnerProjects = state;
        this.spinnerProjects$.next(this.spinnerProjects);
        break;
    }
  }
}
