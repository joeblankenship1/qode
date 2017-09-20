export class Code {
  public name: string;
  public project: string
  //public description: string;

  constructor(data: any) {
    this.name = data.name;
    this.project = data.project;
   // this.description = "";
  }
}