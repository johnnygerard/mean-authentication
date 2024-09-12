export class User {
  readonly createdAt = new Date();

  constructor(
    public username: string,
    public password: string,
  ) {}
}
