import { StatusBar } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { KeyboardAvoidingView, KeyboardProvider } from "react-native-keyboard-controller"

import { DatabaseProvider, DocumentModelProvider } from "@database"
import { useKeepAwakeOnDev } from "@hooks"
import { LoggerProvider } from "@lib/log"
import { Router } from "@router"
import { AppThemeProvider } from "@theme"


export function App() {


  useKeepAwakeOnDev()


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DatabaseProvider>
        <DocumentModelProvider>
          <LoggerProvider>
            <AppThemeProvider>
              <KeyboardProvider statusBarTranslucent={true}>
                <KeyboardAvoidingView
                  style={{ flex: 1 }}
                  behavior={"padding"}
                  keyboardVerticalOffset={-(StatusBar.currentHeight ?? 0)}
                >
                  <Router />
                </KeyboardAvoidingView>
              </KeyboardProvider>
            </AppThemeProvider>
          </LoggerProvider>
        </DocumentModelProvider>
      </DatabaseProvider>
    </GestureHandlerRootView>
  )
}
