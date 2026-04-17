import { getStackAccess, getUsers } from "@/database/users.js";


const getBackup = () => {
  let backup = {
    users: getUsers(),
    stackAccess: getStackAccess()
  };

  return JSON.stringify(backup);
}


export {
  getBackup
}
