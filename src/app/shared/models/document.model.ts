import { Memo } from './memo.model';
import { Quote } from './quote.model';
import { Project } from './project.model';
import { Line } from './line.model';

export class Document {
  public name: string;
  public path: string;
  public atributes = {};
  public text: string;
  public project: string;
  public memos: Memo[];
  public quotes: Quote[];
  public lines: Line[];


  constructor(data: any) {
    this.name = data.name;
    this.text = data.text;
    this.path = data.path;
    this.project = data.project;
  }

  public getLines() {
    return this.lines;
  }

  public setLines(lines: Line[]) {
    this.lines = lines;
  }
}
