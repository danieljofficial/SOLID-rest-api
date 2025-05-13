export interface IAuthUser {
  id: number;
  name: string | null;
  email: string;
  password: string;
  createdAt?: Date;
}
