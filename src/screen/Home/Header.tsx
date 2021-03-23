import React from "react"

import { BlockCenter, BlockRight, Header, HeaderTitle } from "../../component/Header"
import HomeMenu from "./HomeMenu"


export interface HomeHeaderProps {
    switchDebugHome: () => void,
}


export default function HomeHeader(props: HomeHeaderProps) {
    return (
        <Header>
            <BlockCenter>
                <HeaderTitle>
                    DocScan
                </HeaderTitle>
            </BlockCenter>

            <BlockRight>
                <HomeMenu
                    switchDebugHome={props.switchDebugHome}
                />                
            </BlockRight>
        </Header>  
    )
}
