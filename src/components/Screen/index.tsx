import styled from "styled-components/native"

import { StyledProps } from "../../types"


export const SafeScreen = styled.SafeAreaView`
    flex: 1;
    background-color: ${(props: StyledProps) => props.theme.color.screen_background};
`


export const SpaceScreen = styled.View`
    flex: 1;
    margin: 8px;
`


export const CenterScreen = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
`
