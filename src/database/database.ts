type Access = "ADMIN" | "USER"
type UserData = {
  id: number,
  username: string,
  password: string,
  access: Access
}
const database: { users: UserData[]} = {
  users: [
    // {
    //   id: 1,
    //   username: "user1",
    //   password: "password1",
    //   access: "ADMIN"
    // }
  ]
};
const getUserCount = () => {
  return database.users.length;
}
const getUser = (id: number) => {
  const users = database.users.filter(u => u.id == id);
  if (users.length == 0)
    return null;
  return users[0];
}

const createNewUser = (username: string, password: string, access: Access = "USER") => {
  database.users.push({
    id: database.users.length + 1,
    username,
    password,
    access
  })
}

const userAlreadyExists = (username: string) => {
  return database.users.filter(u => u.username == username).length > 0;
}

const validateUser = (username: string, password: string) => {
  const users = database.users.filter(u => u.username == username && u.password == password);
  if (users.length == 0)
    return false;
  return true;
}

export {
  getUser,
  getUserCount,
  createNewUser,
  userAlreadyExists,
  validateUser
}