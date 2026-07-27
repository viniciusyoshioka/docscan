
export enum PathType {
  // Path type is still not determined
  UNKNOWN = 'UNKNOWN',

  // Could not determine path type. The path doesn't exists or an
  // error was thrown when verifying the path type
  NULL = 'NULL',

  FILE = 'FILE',
  FOLDER = 'FOLDER',
  OTHER = 'OTHER',

  SYMLINK_FILE = 'SYMLINK_FILE',
  SYMLINK_FOLDER = 'SYMLINK_FOLDER',
  SYMLINK_OTHER = 'SYMLINK_OTHER',
}
