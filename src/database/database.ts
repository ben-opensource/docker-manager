import { positiveIntOrNull, stringOrNull } from "./validation.js";

const userRoles = ["ADMIN", "ADMIN_READ_ONLY", "USER", "USER_READ_ONLY"]
type UserData = {
  id: number,
  username: string,
  password: string,
  access: Access,
  requireSignIn?: boolean,
  authType: string
}

const database: { users: UserData[], stackAccess: { userId: number, stackName: string }[]} = {
  users: [
    {
      id: 1,
      username: "admin",
      password: "123",
      access: "ADMIN",
      authType: "LOCAL"
    }
  ],
  stackAccess: [
    {
      userId: 1,
      stackName: "docker-manager"
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

const createNewUser = (username: string, password: string, access: Access = "USER_READ_ONLY", authType = "LOCAL") => {
  database.users.push({
    id: database.users.length + 1,
    username,
    password,
    access,
    authType
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

const getStackAccess = () => {
  return database.stackAccess;
}
const getStacksForUser = (userId: number) => {
  return database.stackAccess.filter(s => s.userId == userId).map(s => s.stackName);
}


const loadDbFromBackup = (data: any) => {
  //const data = JSON.parse(jsonString);
  if (data?.users && data.users.length && data.users.length > 0) {
    const users = data.users as { id?: number, username?: string, password?: string, authType?: string, access?: string}[];
    for (let user of users) {
      const id = positiveIntOrNull(user.id) 
      const username = stringOrNull(user.username, u => !userAlreadyExists(u));
      const password = stringOrNull(user.password);
      const access = stringOrNull(user.access, a => userRoles.includes(a));
      const authType = stringOrNull(user.authType);
      console.log(JSON.stringify(user), id, username, password, access, authType)
      if ([id, username, password, access, authType].includes(null))
        continue;console.log(2)
      createNewUser(username as string, password as string, access as Access, authType as string);
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
  loadDbFromBackup
}