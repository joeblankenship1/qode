export class User {
  public name: string;
  public sub: string;
  public nickname: string;
  public picture: string;

  constructor(data: any) {
    this.name = data.name;
    this.sub = data.sub;
    this.nickname = data.nickname;
    this.picture = data.picture;
  }
}
