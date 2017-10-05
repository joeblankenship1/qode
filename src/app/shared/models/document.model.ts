import { Memo } from './memo.model';
import { Quote } from './quote.model';
import { Project } from './project.model';
import { Line } from './line.model';

export class Document {
  private _id: string;
  public name: string;
  public path: string;
  public atributes = {};
  public text: string;
  public memos: Memo[];
  public quotes: Quote[];
  private opened: boolean;
  private projectId: string;


  constructor(data: any, projectId: string) {
    this._id = data._id;
    this.name = data.name;
    this.text = data.text;
    this.path = data.path;
    this.opened = data.opened ? data.opened : false;
    this.projectId = projectId;
    this.quotes = [];
    this.memos = [];
  }


  getId() {
    return this._id;
  }

  public getQuotes() {
    return this.quotes;
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
