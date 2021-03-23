import React from "react"

import { BlockCenter, Header, HeaderTitle } from "../../component/Header"


export interface HomeHeaderProps {}


export default function HomeHeader(props: HomeHeaderProps) {
    return (
        <Header>
            <BlockCenter>
                <HeaderTitle>
                    DocScan
                </HeaderTitle>
            </BlockCenter>
        </Header>  
    )
}
