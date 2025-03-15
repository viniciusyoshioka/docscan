import { useNavigation } from "@react-navigation/native"
import { View } from "react-native"
import { FAB } from "react-native-paper"
import { LoadingModal, useModal } from "react-native-paper-towel"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useSelectionMode } from "react-native-selection-mode"

import { EntityId } from "@database"
import { useBackHandler } from "@hooks"
import { useLogger } from "@libs/logger"
import { translate } from "@locales"
import { NavigationProps } from "@router"
import { stringifyError } from "@utils"
import {
  DeleteSelectedDocumentsModal,
  DocumentsList,
  ErrorDeletingSelectedDocumentsModal,
  HomeHeader,
  NotificationPermissionDeniedModal,
} from "./components"
import {
  useDeleteDocuments,
  useDocumentList,
  useDuplicateDocuments,
  useExportDocuments,
  useGoBack,
  useImportDocuments,
  useInvertDocumentSelection,
  useMergeDocuments,
  useRequestNotificationPermission,
} from "./hooks"


// TODO add comunication with background service to alert when export is done
// TODO add comunication with background service to alert when import is done
export function Home() {


  const safeAreaInsets = useSafeAreaInsets()
  const navigation = useNavigation<NavigationProps<"Home">>()
  const documentSelection = useSelectionMode<EntityId>()

  const logger = useLogger()

  const documents = useDocumentList()
  const notificationPermissionDeniedModal = useModal()
  const deleteSelectedDocumentsModal = useModal()
  const errorDeletingSelectedDocumentsModal = useModal()

  const invertDocumentSelection = useInvertDocumentSelection({
    setSelectedData: documentSelection.setNewSelectedData,
    documents: documents.data,
  })
  const deleteDocuments = useDeleteDocuments({
    getSelectedDocumentIds: documentSelection.getSelectedData,
    onSuccess: async () => await documents.loadDocuments(),
    onError: async error => {
      errorDeletingSelectedDocumentsModal.show()
      const stringifiedError = stringifyError(error)
      await logger.error(stringifiedError)
    },
  })
  const importDocuments = useImportDocuments()
  const exportDocuments = useExportDocuments()
  const mergeDocuments = useMergeDocuments()
  const duplicateDocuments = useDuplicateDocuments()


  useRequestNotificationPermission({
    onPermissionDenied: notificationPermissionDeniedModal.show,
  })


  const goBack = useGoBack({
    hasBlockingModal: deleteDocuments.isLoading,
    isSelectionMode: documentSelection.isSelectionMode,
    exitSelection: documentSelection.exitSelection,
    isNotificationPermissionDeniedModalVisible: notificationPermissionDeniedModal.isVisible,
    hideNotificationPermissionDeniedModal: notificationPermissionDeniedModal.hide,
    isDeleteSelectedDocumentsModalVisible: deleteSelectedDocumentsModal.isVisible,
    hideDeleteSelectedDocumentsModal: deleteSelectedDocumentsModal.hide,
  })

  useBackHandler(goBack)


  return (
    <View style={{ flex: 1 }}>
      <HomeHeader
        isSelectionMode={documentSelection.isSelectionMode}
        selectedDocumentsCount={documentSelection.length}
        exitSelection={documentSelection.exitSelection}
        invertSelection={invertDocumentSelection}
        deleteDocuments={deleteSelectedDocumentsModal.show}
        importDocuments={importDocuments}
        exportDocuments={exportDocuments}
        mergeDocuments={mergeDocuments}
        duplicateDocuments={duplicateDocuments}
      />

      <DocumentsList
        data={documents.data}
        status={documents.status}
        error={documents.error}
        loadDocuments={documents.loadDocuments}
        loadMoreDocuments={documents.loadMoreDocuments}
        selectItem={documentSelection.select}
        deselectItem={documentSelection.deselect}
        isItemSelected={documentSelection.isSelected}
        isSelectionMode={documentSelection.isSelectionMode}
      />

      <FAB
        icon={"plus"}
        mode={"flat"}
        style={{
          position: "absolute",
          right: safeAreaInsets.right,
          bottom: safeAreaInsets.bottom,
          margin: 16,
        }}
        onPress={() => navigation.navigate("Camera")}
      />

      <NotificationPermissionDeniedModal
        isVisible={notificationPermissionDeniedModal.isVisible}
        onDismiss={notificationPermissionDeniedModal.hide}
      />

      <DeleteSelectedDocumentsModal
        isVisible={deleteSelectedDocumentsModal.isVisible}
        onDismiss={deleteSelectedDocumentsModal.hide}
        deleteSelectedDocuments={deleteDocuments.deleteDocuments}
        exitSelection={documentSelection.exitSelection}
      />

      <LoadingModal
        visible={deleteDocuments.isLoading}
        message={translate("Home_deletingDocuments")}
      />

      <ErrorDeletingSelectedDocumentsModal
        isVisible={errorDeletingSelectedDocumentsModal.isVisible}
        onDismiss={errorDeletingSelectedDocumentsModal.hide}
      />
    </View>
  )
}
