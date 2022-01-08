
/**
 * Themes available in the app
 */
export type themeType = "auto" | "light" | "dark"


/**
 * Type defining theme color object attributes
 */
export interface ColorTheme {
    name: themeType;
    appTheme: themeType;
    switchTheme: (newTheme: themeType) => void;
    color: {
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

        noteItem_background: string;
        noteItem_color: string;
        noteItem_selected_background: string;
        noteItem_selected_color: string;
        noteItem_ripple: string;

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
    };
    opacity: {
        headerEmphasis: number;
        highEmphasis: number;
        mediumEmphasis: number;
        disabled: number;
    };
}


/**
 * Type to add ColorTheme in styled-components props
 */
export interface styledProps {
    theme: ColorTheme;
}
