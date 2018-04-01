import { Memo } from './memo.model';
import { Quote } from './quote.model';
import { Project } from './project.model';
import { Line } from './line.model';
import { DocumentService } from '../services/document.service';

export class Document {
  private _id: string;
  private _etag: string;
  public name: string;
  public path: string;
  public atributes = {};
  public text: string;
  public memo: string;
  public quotes: Quote[];
  private opened: boolean;
  private project: string;
  private activated: boolean;


  constructor(data: any, projectId: string, quotes?: Quote[]) {
    this._id = data._id || undefined;
    this._etag = data._etag || undefined;
    this.name = data.name ? data.name : data.key.name;
    this.text = data.text;
    this.path = data.path || '';
    this.opened = data.opened || false;
    this.project = projectId;
    this.quotes = quotes ? quotes : [];
    this.activated = false;
    this.memo = data.memo == null ? '' : data.memo;
  }

  getId() {
    return this._id;
  }

  getProjectId() {
    return this.project;
  }

  getEtag() {
    return this._etag;
  }

  getName() {
    return this.name;
  }

  getMemo() {
    return this.memo;
  }

  setEtag(etag: string) {
    this._etag = etag;
  }

  getAtributes() {
    return this.atributes;
  }

  setAtributes(atributes) {
    this.atributes = atributes;
  }

  public getQuotes() {
    return this.quotes;
  }

  public addQuote(quote: Quote) {
    this.quotes.push(quote);
   // this.documentService.addDocument
  }

  public removeQuote(quote: Quote) {
    const index = this.quotes.findIndex(q => q.getId() === quote.getId() );
    if (index !== -1) {
      this.quotes.splice(index, 1);
    }
  }

  public setId(id: string) {
    this._id = id;
  }

  public setQuotes(quotes: Quote[]) {
    this.quotes = quotes;
  }

  public setMemo(memo: string) {
    this.memo = memo;
  }

  public setOpened(state: boolean) {
    this.opened = state;
  }

  public isOpened() {
    return this.opened;
  }

  public getMessageBody() {
    return {
      key: { name: this.name,
        project: this.project
      },
      text: this.text,
      opened: this.opened,
      quotes: this.quotes.map( q => q.getId()),
      memo: this.memo,
      atributes: this.atributes,
      path: this.path,
      _id: this._id
    };
  }

  public isActivated() {
    return this.activated;
  }

  public activate() {
    this.activated = true;
  }

  public deactivate() {
    this.activated = false;
  }

  public hasQuote(quote: Quote) {
    return this.quotes.indexOf(quote) > -1;
  }

  public getQuoteCount() {
    return this.quotes.length;
  }

}
