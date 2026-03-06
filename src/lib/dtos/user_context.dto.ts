export class UserContextDto {
  readonly id: string;
  readonly nickname: string;

  constructor(id: string, nickname: string) {
    this.id = id;
    this.nickname = nickname;
  }
}
