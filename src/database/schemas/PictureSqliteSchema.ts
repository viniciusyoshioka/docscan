export const PictureSqliteSchema = `
  CREATE TABLE IF NOT EXISTS pictures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_name TEXT NOT NULL,
    position INTEGER NOT NULL,
    belongs_to INTEGER NOT NULL,
    FOREIGN KEY (belongs_to) REFERENCES documents(id)
  );
`
