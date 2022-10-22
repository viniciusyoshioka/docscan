
/**
 * Defines the keys used in translation object
 * and translation function param
 */
export type TranslationKeyType =
    "ok"
    | "cancel"
    | "warn"
    | "delete"

    // Home alert
    | "home_alert_errorLoadingDocuments_text"
    | "home_alert_errorDeletingSelectedDocuments_text"
    | "home_alert_deleteDocuments_title"
    | "home_alert_deleteDocuments_text"
    | "home_alert_exportingDocuments_title"
    | "home_alert_exportingDocuments_text"
    | "home_alert_noDocumentsToExport_text"
    | "home_alert_exportDocuments_title"
    | "home_alert_allSelectedDocumentsWillBeExported_text"
    | "home_alert_allDocumentsWillBeExported_text"
    | "home_alert_mergeDocuments_title"
    | "home_alert_mergeDocuments_text"
    | "home_alert_duplicateDocuments_title"
    | "home_alert_duplicateDocuments_text"
    // Home screen
    | "home_export"
    | "home_merge"
    | "home_duplicate"
    | "home_emptyDocumentList"
    | "home_deletingDocuments"
    // Home menu
    | "home_menu_importDocument"
    | "home_menu_exportDocument"
    | "home_menu_settings"
    | "home_menu_mergeDocument"
    | "home_menu_duplicateDocument"

    // Settings alert
    | "settings_alert_errorSharingLogDatabase_text"
    | "settings_alert_errorSharingAppDatabase_text"
    // Settings header
    | "settings_header_title"
    // Settings screen
    | "settings_theme_title"
    | "settings_theme_text"
    | "settings_shareLogDatabase_title"
    | "settings_shareLogDatabase_text"
    | "settings_shareAppDatabase_title"
    | "settings_shareAppDatabase_text"
    // Settings ChangeTheme
    | "ChangeTheme_title"
    | "ChangeTheme_auto"
    | "ChangeTheme_light"
    | "ChangeTheme_dark"


/**
 * Type of translation object
 */
export type TranslationType = {
    [key in TranslationKeyType]: string;
}
