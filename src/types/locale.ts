
/**
 * Defines the keys used in translation object
 * and translation function param
 */
export type TranslationKeyType =
    "cancel"
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
    // Home
    | "home_export"
    | "home_merge"
    | "home_duplicate"
    | "home_emptyDocumentList"
    | "home_deletingDocuments"


/**
 * Type of translation object
 */
export type TranslationType = {
    [key in TranslationKeyType]: string;
}
