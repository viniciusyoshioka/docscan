import React from "react"

import {
    Header,
    BlockLeft,
    HeaderButton,
    BlockCenter,
    HeaderTitle,
} from "../../component/Header"


export interface VisualizePictureHeaderProps {
    goBack: () => void
}


export default function VisualizePictureHeader(props: VisualizePictureHeaderProps) {
    return (
        <Header>
            <BlockLeft>
                <HeaderButton 
                    onPress={() => props.goBack()} 
                    iconName={"md-arrow-back"} />
            </BlockLeft>

            <BlockCenter>
                <HeaderTitle>
                    Visualizar foto
                </HeaderTitle>
            </BlockCenter>
        </Header>  
    )
}
