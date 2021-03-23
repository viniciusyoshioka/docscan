import AsyncStorage from "@react-native-async-storage/async-storage"

import { storageTheme, themeDefault } from "./constant"


export async function writeTheme(newTheme: string) {
    await AsyncStorage.setItem(storageTheme, newTheme)
}

export async function readTheme(): Promise<string> {
    let theme = await AsyncStorage.getItem(storageTheme)
    if (theme === null) {
        await writeTheme(themeDefault)
        return themeDefault
    }
    return theme
}
