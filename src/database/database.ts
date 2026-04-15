import { positiveIntOrNull, stringOrNull } from "./validation.js";

const userRoles = ["ADMIN", "ADMIN_READ_ONLY", "USER", "USER_READ_ONLY"];

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
  requireSignIn?: boolean
}

const database: { users: UserData[], stackAccess: { userId: number, stackName: string }[], oauthConnections: OauthConnection[]} = {
  users: [
    {
      id: 1,
      username: "admin",
      password: "123",
      access: "ADMIN",
    }
  ],
  stackAccess: [
    {
      userId: 1,
      stackName: "docker-manager"
    }
  ],
  oauthConnections: [
    {
      oauthClientId: "google-oauth2|112872330911524780028",
      userId: 1,

    }
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

const createNewUser = (username: string, password: string, access: Access = "USER_READ_ONLY") => {
  database.users.push({
    id: database.users.length + 1,
    username,
    password,
    access
  })
}
const updateUser = (id: number, username: string, password: string, access: Access = "USER_READ_ONLY") => {
  const user = database.users.filter(u => u.id == id)[0];
  user.username = username;
  user.password = password;
  user.access = access;
}

const userAlreadyExists = (username: string) => {
  return database.users.filter(u => u.username == username).length > 0;
}

const validateUser: (u:string,p:string)=>[Access,number|null] = (username: string, password: string) => {
  const users = database.users.filter(u => u.username == username && u.password == password);
  if (users.length == 0)
    return ["NONE", null];
  return [users[0].access, users[0].id ];
}
const getOauthUser = (oauthClientId: string) => {
  const connections = database.oauthConnections.filter(c => c.oauthClientId == oauthClientId);console.log(1) //todo it stops here
  if (connections.length == 0)
    return null;console.log(2)
  const users = database.users.filter(u => u.id == connections[0].userId);
  if (users.length == 0)
    return null;console.log(3)
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
      const access = stringOrNull(user.access, a => userRoles.includes(a));
      if ([id, username, password, access].includes(null))
        continue;console.log(2)
      createNewUser(username as string, password as string, access as Access);
    }
  }
}

export {
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
  getOauthUser
}