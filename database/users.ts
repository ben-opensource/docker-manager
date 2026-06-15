import db from "./database.js";
import bcrypt from "bcryptjs";



const hashPassword = (password: string) => bcrypt.hash(password, 10);
export const getUserCount = (): Promise<number> => {
  return new Promise((resolve, reject) => {
    try {
      const sql = `
        SELECT COUNT(*)
        FROM users
      `;

      db.get(sql, [], (err, result: { "COUNT(*)": number}) => {
        if (err) {
            resolve(0);
        } else {
            resolve(result["COUNT(*)"] || 0);
        }
      });
    } catch (err) {
      resolve(0);
    }
  });
}
const getUser = (username: string): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    try {
      const sql = `
        SELECT *
        FROM users
        WHERE username = ?
        LIMIT 1
      `;

      db.get(sql, [username], (err, result: User | undefined) => {
        if (err) {
            resolve(null);
        } else {
            resolve(result || null);
        }
      });
    } catch (err) {
      resolve(null);
    }
  });
}
export const getUsers = (): Promise<User[]> => {
  return new Promise((resolve, reject) => {
    try {
      const sql = `
        SELECT users.id AS userID, username, roles.id AS roleID, roles.name AS roleName
        FROM users
        JOIN roles ON roles.id = users.role_id
      `;

      db.all(sql, [], (err, result: User[] | undefined) => {
        if (err) {
          console.error(err);
          resolve([]);
        } else {
          resolve(result || []);
        }
      });
    } catch (err) {
      console.error(err);
      resolve([]);
    }
  });
}

export const getUserFromLogin = (username: string, password: string): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    try {
      const sql = `
        SELECT *
        FROM users
        WHERE username = ?
        LIMIT 1
      `;

      db.get(sql, [username], async (err, result: User | undefined) => {
        if (err || !result) {
          resolve(null);
        } else if (await bcrypt.compare(password, result.password)) {
          resolve(result);
        }
        resolve(null);
      });
    } catch (err) {
      resolve(null);
    }
  });
}
export const createUser = (username: string, password: string, role = 2): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `
        INSERT INTO users 
        (username, password, role_id)
        VALUES
        (?, ?, ?)
      `;

      db.run(sql, [username, await hashPassword(password), role], (err) => {
        if (err) {
            resolve(false);
        } else {
            resolve(true);
        }
      });
    } catch (err) {
      resolve(false);
    }
  });
}

const updateUser = (oldUsername: string, newUsername: string, password: string): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const currentUserData = await getUser(oldUsername);
      if (!currentUserData)
        return resolve(false);
      const sql = `
        UPDATE users
        SET username = ?, password = ?
        WHERE username = ?
      `;
      db.run(sql, [newUsername ?? currentUserData.username, password ? await hashPassword(password) : currentUserData.password, oldUsername], (err) => {
        if (err) {
          console.error(err);
          resolve(false);
        } else {
          resolve(true);
        }
      });
      resolve(true);
    } catch (err) {
      console.error(err);
      resolve(false);
    }
  });
}

export const roleHasPermission = (role: number, permissionCode: number): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `
        SELECT code FROM rolePermissions WHERE role_id = ? AND code = '0' OR code = ? OR code = ?
      `;
      db.all(sql, [role, permissionCode, Math.floor(permissionCode)], (err, result) => {
        if (err || result.length === 0) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    } catch (err) {
      console.error(err);
      resolve(false);
    }
  });
}

export const getRoles = async (): Promise<{ id: number, name: string}[]> => {
  return new Promise((resolve, reject) => {
    try {
      const sql = `
        SELECT *
        FROM roles
      `;

      db.all(sql, [], (err, result: { id: number, name: string}[] | undefined) => {
        if (err || !result) {
            resolve([]);
        } else {
            resolve(result || []);
        }
      });
    } catch (err) {
      resolve([]);
    }
  });
}