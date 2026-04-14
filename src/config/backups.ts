import { getStackAccess, getUsers } from "@/database/database.js";


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
