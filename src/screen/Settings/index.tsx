import React, { useCallback, useContext, useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/core"
import { useBackHandler } from "@react-native-community/hooks"

import { SafeScreen } from "../../component/Screen"
import SettingsHeader from "./Header"
import { TextVersion, ViewVersion } from "./style"
import { appFName, appType, appVersion } from "../../service/constant"
import { SettingsButton } from "../../component/SettingsButton"
import ChangeTheme from "./ChangeTheme"
import { SwitchThemeContext } from "../../service/theme"
import { readTheme } from "../../service/storage"


export default function Settings() {


    const switchTheme = useContext(SwitchThemeContext)
    const navigation = useNavigation()

    const [changeThemeVisible, setChangeThemeVisible] = useState(false)
    const [currentTheme, setCurrentTheme] = useState("")


    useBackHandler(() => {
        goBack()
        return true
    })


    const getCurrentTheme = useCallback(async () => {
        const theme = await readTheme()
        setCurrentTheme(theme)
    }, [])

    const goBack = useCallback(() => {
        navigation.navigate("Home")
    }, [])
  

    useEffect(() => {
        getCurrentTheme()
    }, [changeThemeVisible])


    return (
        <SafeScreen>
            <ChangeTheme 
                visible={changeThemeVisible} 
                setVisible={setChangeThemeVisible} 
                changeTheme={async (newTheme) => await switchTheme(newTheme)} 
                currentTheme={currentTheme}
            />

            <SettingsHeader
                goBack={goBack}
            />

            <SettingsButton
                title={"Tema"}
                description={"Mudar tema de cores do aplicativo"}
                onPress={() => setChangeThemeVisible(true)}
            />

            <ViewVersion>
                <TextVersion>
                    {appFName} - {appVersion} - {appType}
                </TextVersion>
            </ViewVersion>
        </SafeScreen>
    )
}
