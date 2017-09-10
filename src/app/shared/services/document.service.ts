import { Injectable } from '@angular/core';
import { Http , Response} from '@angular/http';
import { Document } from '../models/document.model';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/Rx'
 
@Injectable()
export class DocumentService {

  
  //openedDocuments: Observable<Document[]>;
  private openedDocuments = new BehaviorSubject<Document[]>([]);
  

  constructor(private http: Http) {

   }

  getDocuments(): Observable<any> {
    return this.http.get('http://localhost:5000/document')
      .map( (data: Response) => {
        const extracted = data.json();
        const documentArray: Document[] = [];
        let document;
        if( extracted._items)
          for(let element of extracted._items ){
            document = new Document(element);
            documentArray.push(document);
          }
        return documentArray
      });
  }

  setOpenedDocuments(docArray: Document[]){
    console.log(docArray);
    this.openedDocuments.next(docArray);
  }

  getOpenedDocuments(){
    return this.openedDocuments.asObservable();
  }



}
