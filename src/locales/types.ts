
export type TranslationKeyType =
  "ok"
  | "cancel"
  | "warn"
  | "delete"
  | "criticalError"
  | "success"
  | "save"
  | "dont_save"
  | "tryAgain"
  | "clickHereToTryAgain"
  | "error"

  // Database
  | "Database_errorInitializingDatabase"
  | "Database_errorOpeningDatabase"

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
  | "Camera_noCameraAvailable"
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

  // EditDocument alert
  | "EditDocument_alert_errorLoadingDocument_text"
  | "EditDocument_alert_errorLoadingDocumentPicture_text"
  | "EditDocument_alert_emptyDocument_text"
  | "EditDocument_alert_documentWithoutName_text"
  | "EditDocument_alert_noDocumentOpened_text"
  | "EditDocument_alert_convertNotExistentPdfToShare_text"
  | "EditDocument_alert_errorSharingPdf_text"
  | "EditDocument_alert_noPermissionToVisualizePdf_text"
  | "EditDocument_alert_convertNotExistentPdfToVisualize_text"
  | "EditDocument_alert_noPermissionToDeletePdf_text"
  | "EditDocument_alert_pdfFileDoesNotExists_text"
  | "EditDocument_alert_pdfFileDeletedSuccessfully_text"
  | "EditDocument_alert_errorDeletingPdfFile_text"
  | "EditDocument_alert_deletePdf_title"
  | "EditDocument_alert_deletePdf_text"
  | "EditDocument_alert_cantDeletePictureFromEmptyDocument_text"
  | "EditDocument_alert_errorDeletingSelectedPictures_text"
  | "EditDocument_alert_deletePicture_title"
  | "EditDocument_alert_deletePicture_text"
  // EditDocument screen
  | "EditDocument_shareDocument"
  | "EditDocument_deletingPictures"
  | "EditDocument_emptyDocument"
  | "EditDocument_errorLoadingMorePictures_title"
  | "EditDocument_errorLoadingPictures_text"
  // EditDocument menu
  | "EditDocument_menu_convertToPdf"
  | "EditDocument_menu_sharePdf"
  | "EditDocument_menu_visualizePdf"
  | "EditDocument_menu_rename"
  | "EditDocument_menu_deletePdf"
  | "EditDocument_menu_deleteDocument"
  // EditDocument ConvertPdfOption alert
  | "ConvertPdfOption_alert_noDocumentOpened_text"
  | "ConvertPdfOption_alert_documentWithoutPictures_text"
  | "ConvertPdfOption_alert_noPermissionToConvertToPdf_text"
  // EditDocument ConvertPdfOption
  | "ConvertPdfOption_title"
  | "ConvertPdfOption_description"
  | "ConvertPdfOption_highCompression"
  | "ConvertPdfOption_lowCompression"
  | "ConvertPdfOption_customCompression"
  // EditDocument RenameDocument
  | "RenameDocument_title"
  | "RenameDocument_documentName_placeholder"

  // Gallery alert
  | "Gallery_alert_noPermissionForGallery_text"
  | "Gallery_alert_errorOpeningGallery_text"
  | "Gallery_alert_noPermissionToImportSingle_text"
  | "Gallery_alert_unknownErrorImportingSingle_text"
  | "Gallery_alert_noPermissionToImportMultiple_text"
  // Gallery header
  | "Gallery_header_title"
  // Gallery screen
  | "Gallery_noPermission"
  | "Gallery_photoAccessPermissionDescription"
  | "Gallery_allowPhotoAccessWithGrantPermission"
  | "Gallery_allowPhotoAccessThroughSettings"
  | "Gallery_openSettings"
  | "Gallery_grantPermission"
  | "Gallery_errorLoadingImages_title"
  | "Gallery_errorLoadingImages_text"
  | "Gallery_errorLoadingImages_tryAgain"
  | "Gallery_errorLoadingMoreImages_title"
  | "Gallery_errorLoadingMoreImages_text"
  | "Gallery_emptyGallery"
  | "Gallery_importingPictures"
  // Gallery ErrorImportingImagesModal
  | "ErrorImportingImagesModal_title"
  | "ErrorImportingImagesModal_text"

  // Home alert
  | "Home_alert_errorLoadingDocuments_text"
  | "Home_alert_errorDeletingSelectedDocuments_text"
  | "Home_alert_deleteDocuments_title"
  | "Home_alert_deleteDocuments_text"
  | "Home_alert_importDocuments_title"
  | "Home_alert_importDocuments_text"
  | "Home_alert_errorImportingDocuments_text"
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
  | "Home_alert_notificationPermissionDenied_title"
  | "Home_alert_notificationPermissionDenied_text"
  // Home header
  | "Home_header_title"
  // Home screen
  | "Home_export"
  | "Home_merge"
  | "Home_duplicate"
  | "Home_emptyDocumentList"
  | "Home_deletingDocuments"
  | "Home_errorLoadingMoreDocuments_title"
  | "Home_errorLoadingMoreDocuments_text"
  | "Home_errorLoadingDocuments_title"
  | "Home_errorLoadingDocuments_text"
  | "Home_errorLoadingDocuments_tryAgain"
  // Home menu
  | "Home_menu_importDocument"
  | "Home_menu_exportDocument"
  | "Home_menu_settings"
  | "Home_menu_mergeDocument"
  | "Home_menu_duplicateDocument"
  // Home NotificationPermissionDeniedModal
  | "NotificationPermissionDeniedModal_title"
  | "NotificationPermissionDeniedModal_description"
  | "NotificationPermissionDeniedModal_close"
  | "NotificationPermissionDeniedModal_allow"
  // Home DeleteSelectedDocumentsModal
  | "DeleteSelectedDocumentsModal_title"
  | "DeleteSelectedDocumentsModal_description"
  // Home ErrorDeletingSelectedDocumentsModal
  | "ErrorDeletingSelectedDocumentsModal_title"
  | "ErrorDeletingSelectedDocumentsModal_description"

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
  | "Settings_appVersionInfo_title"
  // Settings ChangeTheme
  | "ChangeTheme_title"
  | "ChangeTheme_auto"
  | "ChangeTheme_light"
  | "ChangeTheme_dark"

  // VisualizePicture alert
  | "VisualizePicture_alert_errorSavingRotatedImage_text"
  | "VisualizePicture_alert_errorCroppingImage_text"
  | "VisualizePicture_alert_warnCurrentPicture_text"
  | "VisualizePicture_alert_errorSavingCroppedImage_text"

  // document state
  | "untitleDocument"

  // document service
  | "document_newDocumentName"
  | "document_exportedDocumentName"
  | "document_alert_errorSavingDocument_text"
  | "document_alert_errorSavingDocumentChanges_text"
  | "document_notification_deletingImages_title"
  | "document_notification_copyingImages_title"
  | "document_notification_movingImages_title"
  | "document_notification_exportingDocuments_title"
  // Log service
  | "log_alert_reportCriticalError_text"


export type TranslationObjectType = {
  [key in TranslationKeyType]: string
}
