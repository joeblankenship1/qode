import { Document } from './document.model';

export class Project {
  public _id: string;
  public _etag: string;
  public name: string;
  public description: string;
  public collaborators: Array<{email: string, role: string}>;
  public owner: string;
  public _created_by: string;
  public _created: Date;
  public _modified_by: string;
  public _modified: Date;

  constructor(data: any) {
    this._id = data._id;
    this._etag = data._etag;
    this.name = data.name ? data.name : data.key.name;
    this.description = data.description;
    this.collaborators = data.collaborators ? data.collaborators : [];
    this.owner = data.owner ? data.owner : data.key.owner ;
    this._created_by = data._created_by;
    this._created = data._created;
    this._modified = data._modified;
    this._modified_by = data._modified_by;
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

  setCreated(_created: Date) {
    this._created = _created;
  }

  setCreatedBy(_created_by: string) {
    this._created_by = _created_by;
  }

  setModifiedBy(_modified_by: string) {
    this._modified_by = _modified_by;
  }

  setModified(_modified: Date) {
    this._modified = _modified;
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
