import React from "react"

import { Header, HeaderButton, HeaderTitle } from "../../components/Header"


export interface FileExplorerHeaderProps {
    goBack: () => void;
}


export function FileExplorerHeader(props: FileExplorerHeaderProps) {
    return (
        <Header>
            <HeaderButton
                iconName={"arrow-back"}
                onPress={props.goBack}
            />

            <HeaderTitle title={"Escolher arquivo"} />
        </Header>
    )
}
