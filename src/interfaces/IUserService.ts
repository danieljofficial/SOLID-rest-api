import { IUser } from "./IUser";

export interface IUserService {
  // createUser(
  //   userData: Omit<IUser, "id" | "createdAt">
  // ): Promise<Omit<IUser, "password">>;
  getAllUsers(): Promise<IUser[]>;
  getUserById(id: number): Promise<IUser | null>;
  updateUser(id: number, userData: Partial<IUser>): Promise<IUser | null>;
  deleteUser(id: number): Promise<boolean>;
}
