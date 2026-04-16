import { positiveIntOrNull, stringOrNull } from "./validation.js";

const enum Access { ADMIN = 1, ADMIN_READ_ONLY = 2, USER = 3, USER_READ_ONLY = 4, NONE = 0 };
const enum LoginsAllowed { ALL = 1, OAUTH_ONLY = 2, OAUTH_ONLY_IF_SET = 3, NONE = 0 };

const userRoles = [Access.ADMIN, Access.ADMIN_READ_ONLY, Access.USER, Access.USER_READ_ONLY];

type OauthConnection = {
  userId: number,
  oauthClientId: string,
  //notCreated?: boolean //if admin gives permission to sign in with oauth
}
type UserData = {
  id: number,
  username: string,
  password: string,
  access: Access,
  requireSignIn?: boolean,
  loginsAllowed: LoginsAllowed
}

const database: { users: UserData[], stackAccess: { userId: number, stackName: string }[], oauthConnections: OauthConnection[]} = {
  users: [
    {
      id: 1,
      username: "admin",
      password: "123",
      access: Access.ADMIN,
      loginsAllowed: LoginsAllowed.ALL
    }
  ],
  stackAccess: [
    {
      userId: 1,
      stackName: "docker-manager"
    }
  ],
  oauthConnections: [
    // {
    //   oauthClientId: "google-oauth2|112872330911524780028",
    //   userId: 1,

    // }
  ]
};
const getUsers = () => {
  return database.users;
}
const getUserCount = () => {
  return database.users.length;
}
const getUser = (id: number) => {
  const users = database.users.filter(u => u.id == id);
  if (users.length == 0)
    return null;
  return users[0];
}

const createNewUser = (username: string, password: string, access: Access = Access.USER_READ_ONLY, loginsAllowed = LoginsAllowed.ALL) => {
  database.users.push({
    id: database.users.length + 1,
    username,
    password,
    access,
    loginsAllowed
  })
}
const updateUser = (id: number, username: string, password: string, access: Access = Access.USER_READ_ONLY) => {
  const user = database.users.filter(u => u.id == id)[0];
  user.username = username;
  user.password = password;
  user.access = access;
}

const userAlreadyExists = (username: string) => {
  return database.users.filter(u => u.username == username).length > 0;
}

const validateUser: (u:string,p:string)=>[Access,number|null,LoginsAllowed] = (username: string, password: string) => {
  const users = database.users.filter(u => u.username == username && u.password == password);
  if (users.length > 0 && 
    (
      users[0].loginsAllowed == LoginsAllowed.ALL || 
      (users[0].loginsAllowed == LoginsAllowed.OAUTH_ONLY_IF_SET && database.oauthConnections.filter(c => c.userId == users[0].id).length == 0)
    ))
    return [ users[0].access, users[0].id, users[0].loginsAllowed ?? LoginsAllowed.ALL ];
  return [ Access.NONE, null, LoginsAllowed.NONE ];
  
}
const getUserFromLogin = (username: string, password: string) => {
  const users = database.users.filter(u => u.username == username && u.password == password);
  if (users.length > 0 && 
    (
      users[0].loginsAllowed == LoginsAllowed.ALL || 
      (users[0].loginsAllowed == LoginsAllowed.OAUTH_ONLY_IF_SET && database.oauthConnections.filter(c => c.userId == users[0].id).length == 0)
    ))
    return users[0];
  return null;
}
const getOauthUser = (oauthClientId: string) => {
  const connections = database.oauthConnections.filter(c => c.oauthClientId == oauthClientId);
  if (connections.length == 0)
    return null;
  const users = database.users.filter(u => u.id == connections[0].userId);
  if (users.length == 0 || users[0].loginsAllowed == LoginsAllowed.NONE)
    return null;
  return users[0];
}

const getStackAccess = () => {
  return database.stackAccess;
}
const getStacksForUser = (userId: number) => {
  return database.stackAccess.filter(s => s.userId == userId).map(s => s.stackName);
}


const loadDbFromBackup = (data: any) => {
  //const data = JSON.parse(jsonString);
  if (data?.users && data.users.length && data.users.length > 0) {
    const users = data.users as { id?: number, username?: string, password?: string, access?: string}[];
    for (let user of users) {
      const id = positiveIntOrNull(user.id) 
      const username = stringOrNull(user.username, u => !userAlreadyExists(u));
      const password = stringOrNull(user.password);
      const access = positiveIntOrNull(user.access, a => userRoles.includes(a));
      if ([id, username, password, access].includes(null))
        continue;console.log(2)
      createNewUser(username as string, password as string, access as Access);
    }
  }
}

export {
  database,
  getUser,
  getUserCount,
  createNewUser,
  userAlreadyExists,
  validateUser,
  getStacksForUser,
  Access,
  updateUser,
  getUsers,
  getStackAccess,
  loadDbFromBackup,
  getOauthUser,
  userRoles,
  LoginsAllowed,
  getUserFromLogin
}