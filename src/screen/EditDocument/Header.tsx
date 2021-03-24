import React from "react"

import { Header, BlockLeft, HeaderButton } from "../../component/Header"


export interface EditDocumentHeaderProps {
    goBack: () => void,
}


export default function EditDocumentHeader(props: EditDocumentHeaderProps) {
    return (
        <Header>
            <BlockLeft>
                <HeaderButton 
                    onPress={() => props.goBack()} 
                    iconName={"md-arrow-back"} />
            </BlockLeft>
        </Header>  
    )
}
