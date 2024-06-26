import { GestureHandlerRootView } from "react-native-gesture-handler"
import { KeyboardProvider } from "react-native-keyboard-controller"

import { DocumentModelProvider, RealmProvider } from "@database"
import { useKeepAwakeOnDev } from "@hooks"
import { Router } from "@router"
import { SettingsProvider } from "@services/settings"
import { AppThemeProvider } from "@theme"


export function App() {


    useKeepAwakeOnDev()


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <RealmProvider>
                <SettingsProvider>
                    <DocumentModelProvider>
                        <AppThemeProvider>
                            <KeyboardProvider statusBarTranslucent={true}>
                                <Router />
                            </KeyboardProvider>
                        </AppThemeProvider>
                    </DocumentModelProvider>
                </SettingsProvider>
            </RealmProvider>
        </GestureHandlerRootView>
    )
}
