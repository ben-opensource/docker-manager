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
  subType: "LOGIN" | "LOGOUT" | "NEW_USER" | "EDIT_USER" | "CHANGE_USER_ACCESS" | "FAILED_LOGIN" | "DELETE_USER"
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
  data: string
} & (AccountLog | ContainerLog | ComposeLog);
const tempLogTable: LogData[] = [];
const addLog = (log: Omit<LogData, "time" | "id">) => {
  tempLogTable.push({...log, time: getTime(), id: tempLogTable.length + 1} as LogData);
}

const logLOGIN = (userId: number) => {
  addLog({
    type: "ACCOUNT",
    subType: "LOGIN",
    byUserId: userId,
    data: ""
  });
}
const logLOGOUT = (userId: number) => {
  addLog({
    type: "ACCOUNT",
    subType: "LOGOUT",
    byUserId: userId,
    data: ""
  });
}

const getLogs = (startId: number, count: number) => {
  return tempLogTable.filter(l => l.id >= startId && l.id < startId + count);
}

export {
  logLOGIN,
  logLOGOUT,
  getLogs
}
