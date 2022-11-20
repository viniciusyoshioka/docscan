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
    App_alert_errorLoadingTheme_text: "Erro carregando tema de cores",
    App_alert_errorSavingTheme_text: "Erro salvando novo tema de cores",

    // Camera alert
    Camera_alert_unsavedPictures_text: "Você tem fotos que não foram salvas, ao voltar elas serão perdidas",
    Camera_alert_unknownErrorTakingPicture_text: "Erro desconhecido ao tirar foto, tente novamente",
    // Camera screen
    Camera_noPermission: "Sem permissão",
    Camera_allowCameraWithGrantPermission: "Permita o uso da câmera com \"Conceder permissão\"",
    Camera_allowCameraThroughSettings: "Permita o uso da câmera através das configurações do aplicativo com \"Abrir configurações\"",
    Camera_enableCamera: "Ou habilite o uso da câmera nas configurações de privacidade do dispositivo",
    Camera_openSettings: "Abrir configurações",
    Camera_grantPermission: "Conceder permissão",
    Camera_cameraNotAvailable: "Câmera indisponível",
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
    Home_alert_errorLoadingDocuments_text: "Erro ao carregar documentos",
    Home_alert_errorDeletingSelectedDocuments_text: "Erro ao apagar documentos selecionados",
    Home_alert_deleteDocuments_title: "Apagar",
    Home_alert_deleteDocuments_text: "Estes documentos serão apagados permanentemente",
    Home_alert_exportingDocuments_title: "Aguarde",
    Home_alert_exportingDocuments_text: "A exportação de documentos pode demorar um pouco",
    Home_alert_errorExportingDocuments_text: "Erro exportando documentos",
    Home_alert_noDocumentsToExport_text: "Nenhum documento existente para ser exportado",
    Home_alert_exportDocuments_title: "Exportar",
    Home_alert_allSelectedDocumentsWillBeExported_text: "Os documentos selecionados serão exportados",
    Home_alert_allDocumentsWillBeExported_text: "Todos os documentos serão exportados",
    Home_alert_mergeDocuments_title: "Unir",
    Home_alert_mergeDocuments_text: "Os documento selecionados serão unidos em um único documento",
    Home_alert_duplicateDocuments_title: "Duplicar",
    Home_alert_duplicateDocuments_text: "Os documentos selecionados serão duplicados",
    // Home header
    Home_header_title: "DocScan",
    // Home screen
    Home_export: "Exportar",
    Home_merge: "Unir",
    Home_duplicate: "Duplicar",
    Home_emptyDocumentList: "Nenhum documento",
    Home_deletingDocuments: "Apagando documentos...",
    // Home menu
    Home_menu_importDocument: "Importar documentos",
    Home_menu_exportDocument: "Exportar documentos",
    Home_menu_settings: "Configurações",
    Home_menu_mergeDocument: "Unir documentos",
    Home_menu_duplicateDocument: "Duplicar documentos",

    // Settings alert
    Settings_alert_errorSharingLogDatabase_text: "Erro ao compartilhar logs",
    Settings_alert_errorSharingAppDatabase_text: "Erro ao compartilhar banco de dados dos documentos",
    // Settings header
    Settings_header_title: "Configurações",
    // Settings screen
    Settings_theme_title: "Tema",
    Settings_theme_text: "Mudar tema de cores do aplicativo",
    Settings_shareLogDatabase_title: "Compartilhar logs",
    Settings_shareLogDatabase_text: "Enviar registro de erros",
    Settings_shareAppDatabase_title: "Compartilhar banco de dados",
    Settings_shareAppDatabase_text: "Enviar banco de dados dos documentos",
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
