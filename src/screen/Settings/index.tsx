import React, { useCallback, useState } from "react"
import { useNavigation } from "@react-navigation/core"

import { SettingsHeader } from "./Header"
import { ChangeTheme } from "./ChangeTheme"
import { TextVersion, ViewVersion } from "./style"
import { ListItem, SafeScreen } from "../../component"
import { appName, appType, appVersion } from "../../service/constant"
import { useBackHandler } from "../../service/hook"


export function Settings() {


    const navigation = useNavigation()

    const [changeThemeVisible, setChangeThemeVisible] = useState(false)


    useBackHandler(() => {
        goBack()
        return true
    })


    const goBack = useCallback(() => {
        navigation.navigate("Home")
    }, [])


    return (
        <SafeScreen>
            <ChangeTheme
                visible={changeThemeVisible}
                setVisible={setChangeThemeVisible}
            />

            <SettingsHeader
                goBack={goBack}
            />

            <ListItem
                icon={"brightness-medium"}
                title={"Tema"}
                description={"Mudar tema de cores do aplicativo"}
                onPress={() => setChangeThemeVisible(true)}
            />

            <ViewVersion>
                <TextVersion>
                    {appName} - {appVersion} - {appType}
                </TextVersion>
            </ViewVersion>
        </SafeScreen>
    )
}
