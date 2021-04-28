import React, { Component } from "react"

import { Header, BlockLeft, HeaderButton, BlockCenter, HeaderTitle } from "../../component/Header"


export interface SettingsHeaderProps {
    goBack: () => void
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
                <BlockLeft>
                    <HeaderButton 
                        onPress={this.props.goBack} 
                        iconName={"md-arrow-back"}
                    />
                </BlockLeft>

                <BlockCenter>
                    <HeaderTitle>
                        Configurações
                    </HeaderTitle>
                </BlockCenter>
            </Header>  
        )
    }
}
