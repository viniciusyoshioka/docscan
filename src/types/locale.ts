
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
    | "App_alert_errorLoadingTheme_text"
    | "App_alert_errorSavingTheme_text"

    // Camera alert
    | "Camera_alert_unsavedPictures_text"
    | "Camera_alert_unknownErrorTakingPicture_text"
    // Camera screen
    | "Camera_noPermission"
    | "Camera_allowCameraWithGrantPermission"
    | "Camera_allowCameraThroughSettings"
    | "Camera_enableCamera"
    | "Camera_openSettings"
    | "Camera_grantPermission"
    | "Camera_cameraNotAvailable"
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
    | "Home_alert_errorLoadingDocuments_text"
    | "Home_alert_errorDeletingSelectedDocuments_text"
    | "Home_alert_deleteDocuments_title"
    | "Home_alert_deleteDocuments_text"
    | "Home_alert_exportingDocuments_title"
    | "Home_alert_exportingDocuments_text"
    | "Home_alert_errorExportingDocuments_text"
    | "Home_alert_noDocumentsToExport_text"
    | "Home_alert_exportDocuments_title"
    | "Home_alert_allSelectedDocumentsWillBeExported_text"
    | "Home_alert_allDocumentsWillBeExported_text"
    | "Home_alert_mergeDocuments_title"
    | "Home_alert_mergeDocuments_text"
    | "Home_alert_duplicateDocuments_title"
    | "Home_alert_duplicateDocuments_text"
    // Home header
    | "Home_header_title"
    // Home screen
    | "Home_export"
    | "Home_merge"
    | "Home_duplicate"
    | "Home_emptyDocumentList"
    | "Home_deletingDocuments"
    // Home menu
    | "Home_menu_importDocument"
    | "Home_menu_exportDocument"
    | "Home_menu_settings"
    | "Home_menu_mergeDocument"
    | "Home_menu_duplicateDocument"

    // Settings alert
    | "Settings_alert_errorSharingLogDatabase_text"
    | "Settings_alert_errorSharingAppDatabase_text"
    // Settings header
    | "Settings_header_title"
    // Settings screen
    | "Settings_theme_title"
    | "Settings_theme_text"
    | "Settings_shareLogDatabase_title"
    | "Settings_shareLogDatabase_text"
    | "Settings_shareAppDatabase_title"
    | "Settings_shareAppDatabase_text"
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
