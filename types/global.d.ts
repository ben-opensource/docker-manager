export {};

declare global {
  //export type UserRoles = "ADMIN" | "USER";
  export type User = { username: string, password: string, role_id: number }
}
