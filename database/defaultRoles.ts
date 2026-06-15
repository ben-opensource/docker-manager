import { Database } from "sqlite3"

export const permissions = {
  all: 0,
  currentUser: 1,
  "currentUser:get": 1.1,
  "currentUser:set": 1.2,
  user: 2,
  "user:get": 2.1,
  "user:set": 2.2,
  "user:delete": 2.3,
  "user:create": 2.4
}

export const addDefaultRoles = (db: Database) => {
  return new Promise((resolve, reject) => {
    try {
      db.run(`
        INSERT INTO roles
        (id, name)
        VALUES
        (1, 'Admin'),
        (2, 'User')
      `, [], (err) => {
        if (err) {
            return reject(err);
        } 
      });

      db.run(`
        INSERT INTO rolePermissions
        (role_id, code)
        VALUES
        (1, ?),
        (2, ?)
      `, [permissions.all, permissions.currentUser], (err) => {
        if (err) {
          console.error(err);
            return reject(err);
        } 
        resolve(0);
      });
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}