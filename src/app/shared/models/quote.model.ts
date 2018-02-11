import { Code } from './code.model';
import { Memo } from './memo.model';
export class Quote {

  private _id: string;
  private _etag: string;
  private text: string;
  private position: {start: number, end: number};
  private documentDisplay: [{page: number, startLine: number, endLine: number}];
  private codes: Code[];
  private memo: string;
  private projectId: string;
  private color: string;

  constructor(text: string, start: number, end: number, documentDisplay, projectId: string,
    id?: string, memo?: string, color?: string, etag?: string, codes?: Code[]) {
    this._id = id ? id : undefined;
    this._etag = etag;
    this.text = text;
    this.position = {start: start, end: end};
    this.documentDisplay = documentDisplay;
    this.memo = memo === undefined ? '' : memo;
    this.projectId = projectId;
    this.color = color ? color : 'rgb(0,0,0)';
    this.codes = codes ? codes : [];
  }

  public getId() {
    return this._id;
  }

  public getEtag() {
    return this._etag;
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

  public addCode(code: Code) {
    this.codes.push(code);
  }

  public removeCode(id: string): number {
    const index = this.codes.findIndex(c => c.getId() === id  );
    if (index !== -1) {
      this.codes.splice(index, 1);
    }
    return index;
  }

  public setCodes(codes: Code[]) {
    this.codes = codes;
  }

  public setId(id: string) {
    this._id = id;
  }

  public setEtag(etag: string) {
    this._etag = etag;
  }

  public setMemo(memo: string) {
    this.memo = memo;
  }

  public setColor(color: string) {
    this.color = color;
  }

  public isEqual(quote: Quote): boolean {
    return this._id === quote.getId();
  }

  public hasCode(code: Code) {
    return this.codes.indexOf(code) > -1;
  }

  public getMessageBody() {
    return {'text': this.text, 'position': this.position, 'color': this.color,
            'documentDisplay': this.documentDisplay, 'project': this.projectId,
            'codes': this.codes.map(c => c.getId()), 'memo': this.memo
    };
  }

}
