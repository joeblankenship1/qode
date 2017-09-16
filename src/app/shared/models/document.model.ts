import { Memo } from './memo.model';
import { Quote } from './quote.mode';
import { Project } from './project.model';

export class Document {
  public name: string;
  public path: string;
  public atributes = [];
  public text: string;
  public project: Project;
  public memos: Memo[];
  public quotes: Quote[];
 

  constructor(data: any) {
    this.name = data.name;
    this.text = data.text;
    this.path = data.path;
  }
}