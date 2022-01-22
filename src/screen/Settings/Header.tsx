import React, { Component } from "react"

import { Header, HeaderButton, HeaderTitle } from "../../components"


export interface SettingsHeaderProps {
    goBack: () => void;
}


export class SettingsHeader extends Component<SettingsHeaderProps> {


    constructor(props: SettingsHeaderProps) {
        super(props)
    }


    shouldComponentUpdate() {
        return false
    }


    render() {
        return (
            <Header>
                <HeaderButton
                    iconName={"arrow-back"}
                    onPress={this.props.goBack}
                />

                <HeaderTitle title={"Configurações"} />
            </Header>
        )
    }
}
