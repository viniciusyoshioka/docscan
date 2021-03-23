import styled from "styled-components/native"

import { styledProps } from "../../service/theme"
import { BlockCenter, BlockLeft, BlockRight } from "./Block"
import { HeaderButton, HeaderButtonBase, HeaderButtonProps } from "./Button"
import { HeaderIcon, HeaderIconProps, headerIconSize } from "./Icon"
import { HeaderTitle, HeaderTitleBase, HeaderTitleProps } from "./Title"


export const Header = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0px 5px;
    width: 100%;
    height: 50px;
    background-color: ${(props: styledProps) => props.theme.color.backgroundDark};
`


export { BlockCenter, BlockLeft, BlockRight }
export type { HeaderButtonProps }
export { HeaderButton, HeaderButtonBase }
export type { HeaderIconProps }
export { HeaderIcon, headerIconSize }
export type { HeaderTitleProps }
export { HeaderTitle, HeaderTitleBase }
