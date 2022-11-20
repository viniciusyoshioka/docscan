
/**
 * Themes available in the app
 */
export type ThemeType = "auto" | "light" | "dark"


/**
 * Name of a theme
 * Excludes `"auto"` from `ThemeType` to only use specific names
 */
export type ThemeName = Omit<ThemeType, "auto">


/**
 * Defines all color codes used in the app
 */
export interface ThemeColors {
    header_background: string;
    header_color: string;
    header_ripple: string;

    subHeader_background: string;
    subHeader_color: string;

    screen_background: string;
    screen_color: string;

    menuItem_background: string;
    menuItem_color: string;
    menuItem_ripple: string;

    documentItem_background: string;
    documentItem_color: string;
    documentItem_selected_background: string;
    documentItem_selected_color: string;
    documentItem_ripple: string;

    imageItem_background: string;
    imageItem_color: string;
    imageItem_selected_background: string;
    imageItem_selected_color: string;

    pictureItem_background: string;
    pictureItem_color: string;
    pictureItem_selected_background: string;
    pictureItem_selected_color: string;

    listItem_background: string;
    listItem_color: string;
    listItem_ripple: string;

    modal_background: string;
    modal_color: string;

    input_background: string;
    input_color: string;
    input_placeholder: string;
    input_unfocus_border: string;
    input_focus_border: string;
    input_selection: string;

    button_background: string;
    button_color: string;
    button_ripple: string;

    radioButton_unchecked_color: string;
    radioButton_checked_color: string;

    checkButton_unchecked_color: string;
    checkButton_checked_color: string;
}


/**
 * Defines all opacity values used in the app
 */
export interface ThemeOpacity {
    headerEmphasis: number;
    highEmphasis: number;
    mediumEmphasis: number;
    disabled: number;
}


/**
 * Type defining theme color object attributes
 */
export interface AppTheme {
    name: ThemeName;
    isDark: boolean;
    appTheme: ThemeType;
    switchTheme: (newTheme: ThemeType) => void;
    color: ThemeColors;
    opacity: ThemeOpacity;
}


/**
 * Type to add `AppTheme` in styled-components props
 */
export interface StyledProps {
    theme: AppTheme;
}
