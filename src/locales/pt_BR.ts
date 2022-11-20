/* eslint-disable camelcase */
import { TranslationType } from "../types"


export const pt_BR: TranslationType = {
    ok: "Ok",
    cancel: "Cancelar",
    warn: "Aviso",
    delete: "Apagar",
    criticalError: "Erro crítico",
    save: "Salvar",
    dont_save: "Não salvar",

    // App alert
    app_alert_errorLoadingTheme_text: "Erro carregando tema de cores",
    app_alert_errorSavingTheme_text: "Erro salvando novo tema de cores",

    // Camera alert
    camera_alert_unsavedPictures_text: "Você tem fotos que não foram salvas, ao voltar elas serão perdidas",
    camera_alert_unknownErrorTakingPicture_text: "Erro desconhecido ao tirar foto, tente novamente",
    // Camera screen
    camera_noPermission: "Sem permissão",
    camera_allowCameraWithGrantPermission: "Permita o uso da câmera com \"Conceder permissão\"",
    camera_allowCameraThroughSettings: "Permita o uso da câmera através das configurações do aplicativo com \"Abrir configurações\"",
    camera_enableCamera: "Ou habilite o uso da câmera nas configurações de privacidade do dispositivo",
    camera_openSettings: "Abrir configurações",
    camera_grantPermission: "Conceder permissão",
    camera_cameraNotAvailable: "Câmera indisponível",
    // Camera CameraSettings alert
    CameraSettings_alert_errorSavingNewFlashSetting_text: "Erro salvando nova configuração de flash",
    CameraSettings_alert_errorSavingNewWhiteBalanceSetting_text: "Erro salvando nova configuração de balanço de branco",
    CameraSettings_alert_errorSavingNewCameraTypeSetting_text: "Erro salvando nova configuração de tipo da câmera",
    CameraSettings_alert_errorSavingNewRatioSetting_text: "Erro salvando nova configuração de proporção",
    CameraSettings_alert_errorResetingFlashSetting_text: "Erro redefinindo configuração de flash da câmera",
    CameraSettings_alert_errorResetingWhiteBalanceSetting_text: "Erro redefinindo configuração de balanço de branco da câmera",
    CameraSettings_alert_errorResetingCameraTypeSetting_text: "Erro redefinindo configuração de tipo de câmera",
    CameraSettings_alert_errorResetingCameraIdSetting_text: "Erro redefinindo configuração de id da câmera",
    CameraSettings_alert_errorResetingRatioSetting_text: "Erro redefinindo configuração de porporção da câmera",
    // Camera CameraSettings
    CameraSettings_frontalCamera: "Câmera frontal",
    CameraSettings_backCamera: "Câmera traseira",
    CameraSettings_flip: "Virar",
    CameraSettings_ratio: "Proporção",
    CameraSettings_flash: "Flash",
    CameraSettings_whiteBalance: "Balanço de branco",
    CameraSettings_reset: "Redefinir",

    // Gallery alert
    Gallery_alert_noPermissionForGallery_text: "Sem permissão para abrir galeria",
    Gallery_alert_errorOpeningGallery_text: "Erro desconhecido ao abrir galeria",
    Gallery_alert_noPermissionToImportSingle_text: "Sem permissão para importar imagem",
    Gallery_alert_unknownErrorImportingSingle_text: "Erro desconhecido ao importar imagem da galeria",
    Gallery_alert_noPermissionToImportMultiple_text: "Sem permissão para importar múltiplas imagens",
    // Gallery header
    Gallery_header_title: "Importar imagem",
    // Gallery screen
    Gallery_emptyGallery: "Galeria vazia",

    // Home alert
    home_alert_errorLoadingDocuments_text: "Erro ao carregar documentos",
    home_alert_errorDeletingSelectedDocuments_text: "Erro ao apagar documentos selecionados",
    home_alert_deleteDocuments_title: "Apagar",
    home_alert_deleteDocuments_text: "Estes documentos serão apagados permanentemente",
    home_alert_exportingDocuments_title: "Aguarde",
    home_alert_exportingDocuments_text: "A exportação de documentos pode demorar um pouco",
    home_alert_errorExportingDocuments_text: "Erro exportando documentos",
    home_alert_noDocumentsToExport_text: "Nenhum documento existente para ser exportado",
    home_alert_exportDocuments_title: "Exportar",
    home_alert_allSelectedDocumentsWillBeExported_text: "Os documentos selecionados serão exportados",
    home_alert_allDocumentsWillBeExported_text: "Todos os documentos serão exportados",
    home_alert_mergeDocuments_title: "Unir",
    home_alert_mergeDocuments_text: "Os documento selecionados serão unidos em um único documento",
    home_alert_duplicateDocuments_title: "Duplicar",
    home_alert_duplicateDocuments_text: "Os documentos selecionados serão duplicados",
    // Home header
    home_header_title: "DocScan",
    // Home screen
    home_export: "Exportar",
    home_merge: "Unir",
    home_duplicate: "Duplicar",
    home_emptyDocumentList: "Nenhum documento",
    home_deletingDocuments: "Apagando documentos...",
    // Home menu
    home_menu_importDocument: "Importar documentos",
    home_menu_exportDocument: "Exportar documentos",
    home_menu_settings: "Configurações",
    home_menu_mergeDocument: "Unir documentos",
    home_menu_duplicateDocument: "Duplicar documentos",

    // Settings alert
    settings_alert_errorSharingLogDatabase_text: "Erro ao compartilhar logs",
    settings_alert_errorSharingAppDatabase_text: "Erro ao compartilhar banco de dados dos documentos",
    // Settings header
    settings_header_title: "Configurações",
    // Settings screen
    settings_theme_title: "Tema",
    settings_theme_text: "Mudar tema de cores do aplicativo",
    settings_shareLogDatabase_title: "Compartilhar logs",
    settings_shareLogDatabase_text: "Enviar registro de erros",
    settings_shareAppDatabase_title: "Compartilhar banco de dados",
    settings_shareAppDatabase_text: "Enviar banco de dados dos documentos",
    // Settings ChangeTheme
    ChangeTheme_title: "Mudar tema",
    ChangeTheme_auto: "Automático",
    ChangeTheme_light: "Claro",
    ChangeTheme_dark: "Escuro",

    // VisualizePicture alert
    VisualizePicture_alert_errorCroppingImage_text: "Erro cortando imagem",
    VisualizePicture_alert_warnCurrentPicture_text: "A imagem atual a ser substituída não existe",
    VisualizePicture_alert_errorSavingCroppedImage_text: "Não foi possível salvar imagem cortada",
    // VisualizePicture header
    VisualizePicture_header_visualize_title: "Visualizar foto",
    VisualizePicture_header_crop_title: "Cortar foto",

    // document-service service
    documentService_notification_deletingImages_title: "Apagando imagens",
    documentService_notification_copyingImages_title: "Copiando imagens",
    documentService_notification_movingImages_title: "Movendo imagens",
    documentService_notification_exportingDocuments_title: "Exportando documentos",
    // document service
    document_newDocumentName: "Novo documento",
    document_alert_errorSavingDocument_text: "Erro salvando documento",
    // Log service
    log_alert_errorRegisteringLog_text: "Erro registrando log.",
}
