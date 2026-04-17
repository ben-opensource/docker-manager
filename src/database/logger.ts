// import fs from "fs";

// type AccountLog = { 
//   category: "LOGIN" | "FORCE_LOGOUT" | "NEW_USER" | "EDIT_USER" | "CHANGE_USER_ACCESS" | "FAILED_LOGIN",
//   data: string,
//   time: string,
//   username: string,
// }
// type DockerEventLog = {
//   category: "DOCKER" | "COMPOSE" | "CONTAINER" | "VOLUME" | "NETWORK",
//   subCategory: "START" | "STOP" | "RESTART" | "DELETE" | "CREATE",
//   data: string,
//   time: string,
// }


// const getTime = () => new Date().toLocaleTimeString();
// const logAccountData = (log: AccountLog) => {
//   const line = `${log.time},${log.category},${log.data},${log.username},\n`;
//   fs.appendFile('logs/account.csv', line, (err) => {
//     if (err) {
//       console.error('Error appending to file:', err);
//     } else {
//       console.log('Line added successfully');
//     }
//   });
// }
// const logLOGIN = (username: string, userId: number) => {
//   logAccountData({
//     category: "LOGIN",
//     time: getTime(),
//     data: `user:${username};userId:${userId}`,
//     username
//   });
// }

// const getAccountLogs = (lineStart: number, lineEnd: number) => {
//   //todo
// }

// export {
//   logLOGIN
// }

const getTime = () => new Date().toLocaleTimeString();

type AccountLog = {
  type: "ACCOUNT",
  subType: "LOGIN" | "OAUTH_LOGIN" | "ADD_OAUTH" | "LOGOUT" | "NEW_USER" | "EDIT_CURRENT_USER" | "EDIT_USER" | "CHANGE_USER_ACCESS" | "FAILED_LOGIN" | "DELETE_USER"
}
type ContainerLog = {
  type: "CONTAINER",
  subType: "STOP" | "START" | "DELETE" | "RESTART"
}
type ComposeLog = {
  type: "COMPOSE",
  subType: "UP" | "DOWN"
}
type LogData = {
  id: number,
  time: string,
  byUserId: number
  data: string,
  success: boolean
} & (AccountLog | ContainerLog | ComposeLog);
const tempLogTable: LogData[] = [];
const addLog = (log: Omit<LogData, "time" | "id">) => {
  tempLogTable.push({...log, time: getTime(), id: tempLogTable.length + 1} as LogData);
}

const logNEW_USER = (username: string, error = '') => {
  addLog({
    type: "ACCOUNT",
    subType: "NEW_USER",
    byUserId: -1,
    data: `username:${username}${error != '' ? ";error:" + error : ''}`,
    success: error == ''
  });
}
const logLOGIN = (userId: number, error = '') => {
  addLog({
    type: "ACCOUNT",
    subType: "LOGIN",
    byUserId: userId,
    data: `${error != '' ? "error:" + error : ''}`,
    success: error == ''
  });
}
const logOAUTH_LOGIN = (userId: number, oauthId: string, error = '') => {
  addLog({
    type: "ACCOUNT",
    subType: "OAUTH_LOGIN",
    byUserId: userId,
    data: `oauthId:${oauthId}${error != '' ? ";error:" + error : ''}`,
    success: error == ''
  });
}
const logADD_OAUTH = (userId: number, oauthId: string, error = '') => {
  addLog({
    type: "ACCOUNT",
    subType: "ADD_OAUTH",
    byUserId: userId,
    data: `oauthId:${oauthId}${error != '' ? ";error:" + error : ''}`,
    success: error == ''
  });
}
const logLOGOUT = (userId: number, error = '') => {
  addLog({
    type: "ACCOUNT",
    subType: "LOGOUT",
    byUserId: userId,
    data: `${error != '' ? "error:" + error : ''}`,
    success: error == ''
  });
}
const logEDIT_CURRENT_USER = (userId: number, error = '') => {
  addLog({
    type: "ACCOUNT",
    subType: "EDIT_CURRENT_USER",
    byUserId: userId,
    data: `${error != '' ? "error:" + error : ''}`,
    success: error == ''
  });
}
const logEDIT_USER = (userId: number, error = '') => {
  addLog({
    type: "ACCOUNT",
    subType: "EDIT_USER",
    byUserId: userId,
    data: `${error != '' ? "error:" + error : ''}`,
    success: error == ''
  });
}

const getLogs = (startId: number, count: number) => {
  return tempLogTable.filter(l => l.id >= startId && l.id < startId + count);
}

export {
  logLOGIN,
  logLOGOUT,
  getLogs,
  logOAUTH_LOGIN,
  logADD_OAUTH,
  logNEW_USER,
  logEDIT_USER,
  logEDIT_CURRENT_USER
}
