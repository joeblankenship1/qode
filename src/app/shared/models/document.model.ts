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
  public memos: Memo[];
  public quotes: Quote[];
  private opened: boolean;
  private project: string;


  constructor(data: any, projectId: string, quotes?: Quote[]) {
    this._id = data._id || undefined;
    this._etag = data._etag || undefined;
    this.name = data.name ? data.name : data.key.name;
    this.text = data.text;
    this.path = data.path || '';
    this.opened = data.opened || false;
    this.project = projectId;
    this.quotes = quotes ? quotes : [];
    this.memos = [];
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

  setEtag(etag: string) {
    this._etag = etag;
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

  public setMemos(memos: Memo[]) {
    this.memos = memos;
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
      quotes: this.quotes,
      memos: this.memos
    };
  }
}
