import { Memo } from './memo.model';
import { Quote } from './quote.model';
import { Project } from './project.model';
import { Line } from './line.model';

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


  constructor(data: any, projectId: string) {
    this._id = data._id || undefined;
    this._etag = data._etag || undefined;
    this.name = data.name;
    this.text = data.text;
    this.path = data.path || '';
    this.opened = data.opened || false;
    this.project = projectId;
    this.quotes = [];
    this.memos = [];
  }


  getId() {
    return this._id;
  }

  public getQuotes() {
    return this.quotes;
  }

  public setId(id: string) {
    this._id = id;
  }

  public setEtag(etag: string) {
    this._etag = etag;
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
}
