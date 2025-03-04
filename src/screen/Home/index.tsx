import { useNavigation } from "@react-navigation/native"
import { useCallback } from "react"
import { View } from "react-native"
import { FAB } from "react-native-paper"
import { LoadingModal, useModal } from "react-native-paper-towel"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useSelectionMode } from "react-native-selection-mode"

import { EntityId } from "@database"
import { useBackHandler } from "@hooks"
import { translate } from "@locales"
import { NavigationProps } from "@router"
import { DocumentsList, HomeHeader, NotificationPermissionDeniedModal } from "./components"
import {
  useDeleteDocuments,
  useDocuments,
  useDuplicateDocuments,
  useExportDocuments,
  useGoBack,
  useImportDocuments,
  useInvertDocumentSelection,
  useMergeDocuments,
  useRequestNotificationPermission,
} from "./hooks"


// TODO: Check if loading modal can be used to other operations
// TODO: Update isDeletingDocumentsModal
// TODO add comunication with background service to alert when export is done
// TODO add comunication with background service to alert when import is done
export function Home() {


  const safeAreaInsets = useSafeAreaInsets()
  const navigation = useNavigation<NavigationProps<"Home">>()

  const documentSelection = useSelectionMode<EntityId>()

  const documents = useDocuments()
  const notificationPermissionDeniedModal = useModal()

  const invertDocumentSelection = useInvertDocumentSelection({
    setSelectedData: documentSelection.setNewSelectedData,
    documents: documents.data,
  })
  const deleteDocuments = useDeleteDocuments()
  const importDocuments = useImportDocuments()
  const exportDocuments = useExportDocuments()
  const mergeDocuments = useMergeDocuments()
  const duplicateDocuments = useDuplicateDocuments()


  const onNotificationPermissionDenied = useCallback(() => {
    notificationPermissionDeniedModal.show()
  }, [notificationPermissionDeniedModal.show])

  useRequestNotificationPermission({
    onPermissionDenied: onNotificationPermissionDenied,
  })


  const goBack = useGoBack({
    isSelectionMode: documentSelection.isSelectionMode,
    exitSelection: documentSelection.exitSelection,
    isNotificationPermissionDeniedModalVisible: notificationPermissionDeniedModal.isVisible,
    hideNotificationPermissionDeniedModal: notificationPermissionDeniedModal.hide,
  })

  useBackHandler(goBack)


  return (
    <View style={{ flex: 1 }}>
      <HomeHeader
        isSelectionMode={documentSelection.isSelectionMode}
        selectedDocumentsCount={documentSelection.length}
        exitSelectionMode={documentSelection.exitSelection}
        invertSelection={invertDocumentSelection}
        deleteDocuments={deleteDocuments}
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

      <LoadingModal
        visible={false}
        message={translate("Home_deletingDocuments")}
      />

      <NotificationPermissionDeniedModal
        isVisible={notificationPermissionDeniedModal.isVisible}
        onDismiss={notificationPermissionDeniedModal.hide}
      />
    </View>
  )
}
