import { Code } from './code.model';
import { Memo } from './memo.model';
export class Quote {

  private _id: string;
  private text: string;
  private position: {start: number, end: number};
  private documentDisplay: [{page: number, startLine: number, endLine: number}];
  private codes: Code[];
  private memo: Memo;
  private projectId: string;
  private color: string;

  constructor(text: string, start: number, end: number, documentDisplay, projectId: string,
    id?: string, memo?: Memo, color?: string) {
    this._id = id ? id : undefined;
    this.text = text;
    this.position = {start: start, end: end};
    this.documentDisplay = documentDisplay;
    this.codes = [];
    this.memo = memo;
    this.projectId = projectId;
    this.color = color ? color : 'black';
  }

  public getId() {
    return this._id;
  }

  public getText() {
    return this.text;
  }

  public getDocumentDisplay() {
    return this.documentDisplay;
  }

  public getPosition() {
    return this.position;
  }

  public getCodes() {
    return this.codes;
  }

  public getMemo() {
    return this.memo;
  }

  public getColor() {
    return this.color;
  }

  public setId(id: string) {
    this._id = id;
  }

  public setMemo(memo: Memo) {
    this.memo = memo;
  }

  public setColor(color: string) {
    this.color = color;
  }

  public isEqual(quote: Quote): boolean {
    return this._id === quote.getId();
  }
}
