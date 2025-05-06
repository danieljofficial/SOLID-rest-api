import { IUser } from "../interfaces/IUser";

export class User implements IUser {
  constructor(
    public id: number,
    public name: string | null,
    public email: string,
    public createdAt: Date = new Date()
  ) {}
}
