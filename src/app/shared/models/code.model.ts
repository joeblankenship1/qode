export class Code {
  private name: string;
  private project: string;
  private memo: string;
  private color: string;
  private _id: string;
  private _etag: string;

  constructor(data: any) {
    this._id = data._id == null ? '0' : data._id;
    this.name = data.name != null ? data.name : data.key.name;
    this.project = data.project ? data.project : data.key.project;
    this.memo = data.memo == null ? '' : data.memo;
    this.color = data.color == null ? 'black' : data.color;
    this._etag = data._etag == null ? '' : data._etag;
  }

  getMessageBody() {
    return {'key': { name: this.name,
                  project: this.project
                  }
            , 'memo': this.memo, 'color': this.color};
  }

  getProject() {
    return this.project;
  }

  setMemo(memo: string) {
    this.memo = memo;
  }

  getMemo() {
    return this.memo;
  }

  setColor(color: string) {
    this.color = color;
  }

  getColor() {
    return this.color;
  }

  setName(name: string) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  getEtag() {
    return this._etag;
  }

  setEtag(etag: string) {
    this._etag = etag;
  }

  setId(id: string) {
    this._id = id;
  }

  getId() {
    return this._id;
  }
}
