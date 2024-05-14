export const LogSqliteSchema = `
  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code INTEGER NOT NULL,
    message TEXT NOT NULL,
    timestamp INTEGER NOT NULL
  );
`
