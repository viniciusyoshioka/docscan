export const mockReactNative = {
  Alert: {
    alert: jest.fn(),
  },
  NativeModules: {
    I18nManager: {
      localeIdentifier: "en-us",
    },
  },
  Platform: {
    OS: "android",
  },
}
