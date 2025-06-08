import { IAuthUser } from "./IAuthUser";

export interface IAuthService {
  register(
    name: string,
    email: string,
    password: string
  ): Promise<{ user: Omit<IAuthUser, "password">; token: string }>;
  login(
    email: string,
    password: string
  ): Promise<{ user: Omit<IAuthUser, "password">; token: string }>;
  verifyToken(token: string): Promise<{ userId: number }>;
}
