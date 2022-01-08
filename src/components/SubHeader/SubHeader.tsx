import styled from "styled-components/native"

import { StyledProps } from "../../types"


export const SubHeader = styled.View`
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    height: 28px;
    padding: 4px 16px;
    background-color: ${(props: StyledProps) => props.theme.color.subHeader_background};
    elevation: 4;
`
