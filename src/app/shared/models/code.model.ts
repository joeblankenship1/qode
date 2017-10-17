export class Code {
  public name: string;
  public project: string;
  public memo: string;
  public _id: string;
  public _etag: string;

  constructor(data: any) {
    this._id = data._id == null ? '0' : data._id;
    this.name = data.name;
    this.project = data.project;
    this.memo = data.memo == null ? '' : data.memo;
    this._etag = data._etag == null ? '' : data._etag;
  }

  getMessageBody() {
    return {'name' : this.name, 'memo' : this.memo, 'project': this.project};
  }
}
