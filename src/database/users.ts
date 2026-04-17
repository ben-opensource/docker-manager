import { db } from "./db.js";
import { logADD_OAUTH } from "./logger.js";

export const enum Access { ADMIN = 1, ADMIN_READ_ONLY = 2, USER = 3, USER_READ_ONLY = 4, NONE = 0 }; //update in schema and delete .db file when changing
export const enum LoginsAllowed { ALL = 1, OAUTH_ONLY = 2, OAUTH_ONLY_IF_SET = 3, NONE = 0 }; //update in schema and delete .db file when changing

export const userRoles = [Access.ADMIN, Access.ADMIN_READ_ONLY, Access.USER, Access.USER_READ_ONLY];
export const loginTypes = [LoginsAllowed.ALL, LoginsAllowed.OAUTH_ONLY, LoginsAllowed.OAUTH_ONLY_IF_SET];

type UserData = {
  id: number,
  username: string,
  password: string,
  access: Access,
  requireSignIn?: boolean,
  loginsAllowed: LoginsAllowed
}
type OauthConnection = {
  userId: number,
  oauthClientId: string,
  //notCreated?: boolean //if admin gives permission to sign in with oauth
}
export const getUserCount = () => {
  try {
    return (db.prepare("SELECT COUNT(*) from users;").get() as { "COUNT(*)": number | undefined})["COUNT(*)"] ?? 0;
  } catch (err) {
    console.error(err);
    return 0;
  }
}
export const getUserById = (id: number) => {
  try {
    return (db.prepare("SELECT id, username, access, requireSignIn, loginsAllowed FROM users WHERE id = ? LIMIT 1").get(id) as UserData) ?? null;
  } catch (err) {
    console.error(err);
    return null;
  }
}
export const userExists = (username: string) => {
  try {
    return db.prepare("SELECT id, username, access, requireSignIn, loginsAllowed FROM users WHERE username = ? LIMIT 1").get(username) ? true : false;
  } catch (err) {
    console.error(err);
    return false;
  }
}
export const getUsers = () => {
  try {
    return (db.prepare("SELECT id, username, access, requireSignIn, loginsAllowed FROM users").all() as UserData[]) ?? [];
  } catch (err) {
    console.error(err);
    return [];
  }
}
export enum AddUserResponseCodes { USER_CREATED = 1, USERNAME_USED = -1, ADD_USER_ERROR, USERNAME_INVALID }
export const addUser = (data: Omit<UserData, "id">) => {
  try {
    if (data.username.length < 3)
      return AddUserResponseCodes.USERNAME_INVALID;
    if (userExists(data.username))
      return AddUserResponseCodes.USERNAME_USED;
    db.prepare("INSERT INTO users (username, password, access, requireSignIn, loginsAllowed) VALUES (?, ?, ?, ?, ?)")
      .run(data.username, data.password, data.access, data.requireSignIn ? "true" : "false" , data.loginsAllowed);
    return AddUserResponseCodes.USER_CREATED;
  } catch (err) {
    console.error(err);
    return AddUserResponseCodes.ADD_USER_ERROR;
  }
}
export enum updateUserStatusCodes { UPDATE_USER_ERROR }
export const updateUser = (data: UserData) => {
  try {
    db.prepare("UPDATE users SET username = ?, password = ?, access = ?, requireSignIn = ?, loginsAllowed = ? WHERE id = ?")
      .run(data.username, data.password, data.access, data.requireSignIn ? "true" : "false", data.loginsAllowed, data.id);
  } catch (err) {
    console.error(err);
    return updateUserStatusCodes.UPDATE_USER_ERROR;
  }
}
export const getUserFromLogin = (username: string, password: string) => {
  try {
    return (db.prepare("SELECT id, username, access, requireSignIn, loginsAllowed FROM users WHERE username = ? AND PASSWORD = ? LIMIT 1").get(username, password) as UserData) ?? null
  } catch (err) {
    console.error(err);
    return null;
  }
}
export const getUserFromOauth = (oauthId: string) => {
  try {
    return (db.prepare("SELECT users.id, users.username, users.access, users.requireSignIn, users.loginsAllowed FROM users JOIN oauthConnections WHERE oauthConnections.oauth_client_id = ? LIMIT 1").get(oauthId) as UserData) ?? null;
  } catch (err) {
    console.error(err);
    return null;
  }
}
export const oauthConnectionExists = (oauthId: string) => {
  try {
    return db.prepare("SELECT oauth_client_id FROM oauthConnections WHERE oauth_client_id = ? LIMIT 1").get(oauthId) ? true : false;
  } catch (err) {
    console.error(err);
    return false;
  }
}
export enum AddOauthResponseCodes { CONNECTION_CREATED = 1, CONNECTION_EXISTS = -1, ADD_OAUTH_ERROR }
export const addOauthConnection = (data: OauthConnection ) => {
  try {
    if (oauthConnectionExists(data.oauthClientId))
      return AddOauthResponseCodes.CONNECTION_EXISTS;
    db.prepare("INSERT INTO oauthConnections (user_id, oauth_client_id) VALUES (?, ?)")
      .run(data.userId, data.oauthClientId);
      logADD_OAUTH(data.userId, data.oauthClientId);
    return AddOauthResponseCodes.CONNECTION_CREATED;
  } catch (err) {
    console.error(err);
    logADD_OAUTH(data.userId, data.oauthClientId, (err as Error).name);
    return AddOauthResponseCodes.ADD_OAUTH_ERROR;
  }
}

export const getStacksForUser = (userId: number) => {
  try {
    return (db.prepare("SELECT stackName FROM stackAccess WHERE user_id = ?").all(userId) as { stackName: string }[]).map(s => s.stackName);
  } catch (err) {
    console.error(err);
    return [];
  }
}
export const getStackAccess = () => {
  try {
    return (db.prepare("SELECT user_id AS userId, stackName FROM stackAccess").all() as { userId: number, stackName: string }[]);
  } catch (err) {
    console.error(err);
    return [];
  }
}


export const loadDbFromBackup = () => {}