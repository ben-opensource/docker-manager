CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT unique NOT NULL,
  password TEXT NOT NULL,
  access INTEGER NOT NULL CHECK (access IN (0,1,2,3,4)) DEFAULT 0,
  requireSignIn BOOLEAN DEFAULT false,
  loginsAllowed INTEGER NOT NULL CHECK (loginsAllowed IN (0,1,2,3)) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS oauthConnections (
  user_id INTEGER NOT NULL,
  oauth_client_id TEXT unique NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS stackAccess (
  user_id INTEGER NOT NULL,
  stackName TEXT unique NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  time TEXT NOT NULL,
  byUserId INTEGER NOT NULL,
  data TEXT NOT NULL,
  success BOOLEAN DEFAULT true,
  type TEXT NOT NULL,
  subType TEXT NOT NULL
);