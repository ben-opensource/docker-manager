type UserData = {
  id: number,
  username: string,
  password: string,
  access: Access,
  requireSignIn?: boolean
}
const database: { users: UserData[], stackAccess: { userId: number, stackName: string }[]} = {
  users: [
    {
      id: 1,
      username: "admin",
      password: "123",
      access: "ADMIN"
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

const getStacksForUser = (userId: number) => {
  return database.stackAccess.filter(s => s.userId == userId).map(s => s.stackName);
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
  getUsers
}