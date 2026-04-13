export {};

declare global {
  type Access = "ADMIN" | "ADMIN_READ_ONLY" | "USER" | "USER_READ_ONLY" | "NONE";
}