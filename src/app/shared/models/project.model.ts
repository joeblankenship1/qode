import { Document } from './document.model';

export class Project {
  public _id: string;
  public _etag: string;
  public name: string;
  public description: string;
  public collaborators: Array<{email: string, role: string}>;
  public owner: string;

  constructor(data: any) {
    this._id = data._id;
    this._etag = data._etag;
    this.name = data.name ? data.name : data.key.name;
    this.description = data.description;
    this.collaborators = data.collaborators ? data.collaborators : [];
    this.owner = data.owner ? data.owner : data.key.owner ;
  }

  setId(_id: string) {
    this._id = _id;
  }

  setEtag(_etag: string) {
    this._etag = _etag;
  }

  setOwner(owner: string) {
    this.owner = owner;
  }

  getMessageBody() {
    return {
      _id: this._id,
      key: {
        name: this.name,
        owner: this.owner
      },
      description: this.description,
      collaborators: this.collaborators
    };
  }
}
