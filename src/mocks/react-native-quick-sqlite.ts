export const mockReactNativeQuickSqlite = {
  open: jest.fn(() => ({
    attach: jest.fn(),
    close: jest.fn(),
    delete: jest.fn(),
    detach: jest.fn(),
    execute: jest.fn(),
    executeAsync: jest.fn(),
    executeBatch: jest.fn(),
    executeBatchAsync: jest.fn(),
    loadFile: jest.fn(),
    loadFileAsync: jest.fn(),
    transaction: jest.fn(),
  })),
}
