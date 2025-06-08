export interface IRoleService {
  assignRoleToUser(userId: number, roleName: string): Promise<boolean>;
  getUserRoles(userId: number): Promise<string[]>;
  hasPermission(userId: number, requiredPermission: string): Promise<boolean>;
}
