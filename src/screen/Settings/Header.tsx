import React from "react"

import { Header, HeaderButton, HeaderTitle } from "../../components"


export interface SettingsHeaderProps {
    goBack: () => void;
}


export function SettingsHeader(props: SettingsHeaderProps) {
    return (
        <Header>
            <HeaderButton
                iconName={"arrow-back"}
                onPress={props.goBack}
            />

            <HeaderTitle title={"Configurações"} />
        </Header>
    )
}
