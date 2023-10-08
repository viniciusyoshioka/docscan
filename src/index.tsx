import { GestureHandlerRootView } from "react-native-gesture-handler"

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
                            <Router />
                        </AppThemeProvider>
                    </DocumentModelProvider>
                </SettingsProvider>
            </RealmProvider>
        </GestureHandlerRootView>
    )
}
