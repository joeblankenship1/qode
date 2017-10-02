import { Document } from './document.model';

export class Project {
  public _id: string;
  public _etag: string;
  public name: string;
  public description: string;
  public documents: Document[];
  public owner: string;

  constructor(data: any) {
    this._id = data._id;
    this._etag = data._etag;
    this.name = data.name;
    this.description = data.description;
    this.documents = data.document;
    this.owner = data.owner;
  }

  getMessageBody() {
    return { _id: this._id, name: this.name, description: this.description };
  }
}
