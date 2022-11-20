
/**
 * Defines the keys used in translation object
 * and translation function param
 */
export type TranslationKeyType =
    "ok"
    | "cancel"
    | "warn"
    | "delete"
    | "criticalError"
    | "save"
    | "dont_save"

    // App alert
    | "app_alert_errorLoadingTheme_text"
    | "app_alert_errorSavingTheme_text"

    // Camera alert
    | "camera_alert_unsavedPictures_text"
    | "camera_alert_unknownErrorTakingPicture_text"
    // Camera screen
    | "camera_noPermission"
    | "camera_allowCameraWithGrantPermission"
    | "camera_allowCameraThroughSettings"
    | "camera_enableCamera"
    | "camera_openSettings"
    | "camera_grantPermission"
    | "camera_cameraNotAvailable"
    // Camera CameraSettings alert
    | "CameraSettings_alert_errorSavingNewFlashSetting_text"
    | "CameraSettings_alert_errorSavingNewWhiteBalanceSetting_text"
    | "CameraSettings_alert_errorSavingNewCameraTypeSetting_text"
    | "CameraSettings_alert_errorSavingNewRatioSetting_text"
    | "CameraSettings_alert_errorResetingFlashSetting_text"
    | "CameraSettings_alert_errorResetingWhiteBalanceSetting_text"
    | "CameraSettings_alert_errorResetingCameraTypeSetting_text"
    | "CameraSettings_alert_errorResetingCameraIdSetting_text"
    | "CameraSettings_alert_errorResetingRatioSetting_text"
    // Camera CameraSettings
    | "CameraSettings_frontalCamera"
    | "CameraSettings_backCamera"
    | "CameraSettings_flip"
    | "CameraSettings_ratio"
    | "CameraSettings_flash"
    | "CameraSettings_whiteBalance"
    | "CameraSettings_reset"

    // Gallery alert
    | "Gallery_alert_noPermissionForGallery_text"
    | "Gallery_alert_errorOpeningGallery_text"
    | "Gallery_alert_noPermissionToImportSingle_text"
    | "Gallery_alert_unknownErrorImportingSingle_text"
    | "Gallery_alert_noPermissionToImportMultiple_text"
    // Gallery header
    | "Gallery_header_title"
    // Gallery screen
    | "Gallery_emptyGallery"

    // Home alert
    | "home_alert_errorLoadingDocuments_text"
    | "home_alert_errorDeletingSelectedDocuments_text"
    | "home_alert_deleteDocuments_title"
    | "home_alert_deleteDocuments_text"
    | "home_alert_exportingDocuments_title"
    | "home_alert_exportingDocuments_text"
    | "home_alert_errorExportingDocuments_text"
    | "home_alert_noDocumentsToExport_text"
    | "home_alert_exportDocuments_title"
    | "home_alert_allSelectedDocumentsWillBeExported_text"
    | "home_alert_allDocumentsWillBeExported_text"
    | "home_alert_mergeDocuments_title"
    | "home_alert_mergeDocuments_text"
    | "home_alert_duplicateDocuments_title"
    | "home_alert_duplicateDocuments_text"
    // Home header
    | "home_header_title"
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

    // VisualizePicture alert
    | "VisualizePicture_alert_errorCroppingImage_text"
    | "VisualizePicture_alert_warnCurrentPicture_text"
    | "VisualizePicture_alert_errorSavingCroppedImage_text"
    // VisualizePicture header
    | "VisualizePicture_header_visualize_title"
    | "VisualizePicture_header_crop_title"

    // document-service service
    | "documentService_notification_deletingImages_title"
    | "documentService_notification_copyingImages_title"
    | "documentService_notification_movingImages_title"
    | "documentService_notification_exportingDocuments_title"
    // document service
    | "document_newDocumentName"
    | "document_alert_errorSavingDocument_text"
    // Log service
    | "log_alert_errorRegisteringLog_text"


/**
 * Type of translation object
 */
export type TranslationType = {
    [key in TranslationKeyType]: string;
}


/**
 * Type for object used to normalize language code
 */
export type LanguageCodeMap = {
    [key in string]: string;
}
