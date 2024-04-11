import { CameraRoll, PhotoIdentifier } from "@react-native-camera-roll/camera-roll"
import { useNavigation, useRoute } from "@react-navigation/core"
import { Realm } from "@realm/react"
import { FlashList } from "@shopify/flash-list"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ActivityIndicator, Alert, View, useWindowDimensions } from "react-native"
import RNFS from "react-native-fs"
import { EmptyScreen, LoadingModal } from "react-native-paper-towel"
import { useSelectionMode } from "react-native-selection-mode"

import {
  DocumentPictureRealmSchema,
  DocumentRealmSchema,
  useDocumentModel,
  useDocumentRealm,
} from "@database"
import { useBackHandler } from "@hooks"
import { useLogger } from "@lib/log"
import { translate } from "@locales"
import { NavigationProps, RouteProps } from "@router"
import { DocumentService } from "@services/document"
import { createAllFolders } from "@services/folder-handler"
import { getReadMediaImagesPermission } from "@services/permission"
import { useAppTheme } from "@theme"
import { stringifyError } from "@utils"
import { GalleryHeader } from "./Header"
import {
  HORIZONTAL_COLUMN_COUNT,
  ImageItem,
  VERTICAL_COLUMN_COUNT,
  getImageItemSize,
} from "./ImageItem"
import { LoadingIndicator } from "./LoadingIndicator"


const HEADER_HEIGHT = 56


// TODO increse ImageItem size when app window is small
// TODO move the loading of images to a hook
// TODO optimize performance of ImageItem when in selection mode
export function Gallery() {


  const navigation = useNavigation<NavigationProps<"Gallery">>()
  const { params } = useRoute<RouteProps<"Gallery">>()
  const { width: windowWidth, height: windowHeight } = useWindowDimensions()
  const log = useLogger()

  const documentRealm = useDocumentRealm()
  const { documentModel, setDocumentModel } = useDocumentModel()

  const { colors } = useAppTheme()

  const gallerySelection = useSelectionMode<string>()
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [imageGallery, setImageGallery] = useState<PhotoIdentifier[] | null>(null)
  const currentAmountOfImages = useMemo(() => imageGallery?.length ?? 0, [imageGallery])
  const [isGalleryFullLoaded, setIsGalleryFullLoaded] = useState(false)
  const [isImportingImages, setIsImportingImages] = useState(false)

  const columnCount = useMemo(
    () => (windowWidth < windowHeight)
      ? VERTICAL_COLUMN_COUNT
      : HORIZONTAL_COLUMN_COUNT
    , [windowWidth, windowHeight]
  )
  const estimatedItemSize = getImageItemSize(windowWidth, columnCount)

  const minimumRowAmountInScreen = useMemo(() => Math.ceil(
    (windowHeight - HEADER_HEIGHT) / estimatedItemSize
  ), [windowHeight, estimatedItemSize])
  const amountOfImageToLoadPerTime = useMemo(() => (
    (minimumRowAmountInScreen + 1) * columnCount
  ), [minimumRowAmountInScreen, columnCount])


  useBackHandler(() => {
    goBack()
    return true
  })


  async function getImage(refreshing?: boolean) {
    if (isLoading) return

    setIsLoading(true)

    const hasReadMediaImagesPermission = await getReadMediaImagesPermission()
    if (!hasReadMediaImagesPermission) {
      setImageGallery([])
      setIsLoading(false)
      log.warn("No permission to access CameraRoll")
      Alert.alert(
        translate("warn"),
        translate("Gallery_alert_noPermissionForGallery_text")
      )
      return
    }

    let amoutToLoad = amountOfImageToLoadPerTime
    if ((refreshing === false || refreshing === undefined) && imageGallery) {
      amoutToLoad += imageGallery.length
    }

    try {
      const cameraRollPhotos = await CameraRoll.getPhotos({
        first: amoutToLoad,
        assetType: "Photos",
      })

      if (cameraRollPhotos.edges.length === currentAmountOfImages
        && (refreshing === false || refreshing === undefined)) {
        setIsGalleryFullLoaded(true)
        setIsLoading(false)
        return
      }

      setImageGallery(cameraRollPhotos.edges)
      setIsLoading(false)
    } catch (error) {
      setImageGallery([])
      setIsLoading(false)
      log.error(`Error getting images from CameraRoll: "${stringifyError(error)}"`)
      Alert.alert(
        translate("warn"),
        translate("Gallery_alert_errorOpeningGallery_text")
      )
    }
  }

  function goBack() {
    if (gallerySelection.isSelectionMode) {
      gallerySelection.exitSelection()
      return
    }

    navigation.goBack()
  }

  async function importSingleImage(imagePath: string) {
    setIsImportingImages(true)

    const hasReadMediaImagesPermission = await getReadMediaImagesPermission()
    if (!hasReadMediaImagesPermission) {
      log.warn("No permission to import image")
      setIsImportingImages(false)
      Alert.alert(
        translate("warn"),
        translate("Gallery_alert_noPermissionToImportSingle_text")
      )
      return
    }

    await createAllFolders()

    const newImagePath = await DocumentService.getNewPicturePath(imagePath)
    try {
      await RNFS.copyFile(imagePath, newImagePath)
    } catch (error) {
      log.error(`Error importing a single image from gallery: "${stringifyError(error)}"`)
      setIsImportingImages(false)
      Alert.alert(
        translate("warn"),
        translate("Gallery_alert_unknownErrorImportingSingle_text")
      )
      return
    }

    if (params.screenAction === "replace-picture") {
      replaceImage(newImagePath)
      setIsImportingImages(false)
      navigation.navigate("VisualizePicture", { pictureIndex: params.replaceIndex })
      return
    }

    addImages([newImagePath])
    setIsImportingImages(false)
    navigation.goBack()
  }

  async function importMultipleImage() {
    setIsImportingImages(true)

    const hasReadMediaImagesPermission = await getReadMediaImagesPermission()
    if (!hasReadMediaImagesPermission) {
      log.warn("No permission to import multiple images")
      setIsImportingImages(false)
      Alert.alert(
        translate("warn"),
        translate("Gallery_alert_noPermissionToImportMultiple_text")
      )
      return
    }

    const imageFilesToCopy: string[] = []
    const imageFilesToAdd: string[] = []

    for (let i = 0; i < gallerySelection.selectedData.length; i++) {
      const newImagePath = await DocumentService.getNewPicturePath(
        gallerySelection.selectedData[i]
      )

      imageFilesToCopy.push(gallerySelection.selectedData[i].replace("file://", ""))
      imageFilesToCopy.push(newImagePath)

      imageFilesToAdd.push(newImagePath)
    }

    await createAllFolders()

    DocumentService.copyPicturesService({ pictures: imageFilesToCopy })
    addImages(imageFilesToAdd)
    setIsImportingImages(false)
    navigation.goBack()
  }

  function replaceImage(filePath: string) {
    if (params.screenAction !== "replace-picture")
      throw new Error(
        "Screen action is different of 'replace-picture'. This should not happen"
      )
    if (!documentModel)
      throw new Error("Document model is undefined. This should not happen")

    const oldPictureName = documentModel.pictures[params.replaceIndex].fileName
    const newPictureName = DocumentService.getFileFullname(filePath)
    documentRealm.write(() => {
      documentModel.document.modifiedAt = Date.now()
      documentModel.pictures[params.replaceIndex].fileName = newPictureName
    })

    const document = documentRealm.objectForPrimaryKey(
      DocumentRealmSchema,
      documentModel.document.id
    )
    const pictures = documentRealm
      .objects(DocumentPictureRealmSchema)
      .filtered("belongsTo = $0", documentModel.document.id)
      .sorted("position")
    if (!document) throw new Error("Document is undefined, this should not happen")
    setDocumentModel({ document, pictures })

    DocumentService.deletePicturesService({
      pictures: [DocumentService.getPicturePath(oldPictureName)],
    })
  }

  function addImages(filePaths: string[]) {
    let modifiedDocumentId: Realm.BSON.ObjectId
    if (documentModel) {
      documentRealm.write(() => {
        let position = documentModel.pictures.length
        filePaths.forEach(filePath => documentRealm.create(DocumentPictureRealmSchema, {
          fileName: DocumentService.getFileFullname(filePath),
          position: position++,
          belongsTo: documentModel.document.id,
        }))

        documentModel.document.modifiedAt = Date.now()
      })

      modifiedDocumentId = documentModel.document.id
    } else {
      modifiedDocumentId = documentRealm.write(() => {
        const now = Date.now()
        const createdDocument = documentRealm.create(DocumentRealmSchema, {
          createdAt: now,
          modifiedAt: now,
          name: DocumentService.getNewName(),
        })

        let position = 0
        filePaths.forEach(filePath => documentRealm.create(DocumentPictureRealmSchema, {
          fileName: DocumentService.getFileFullname(filePath),
          position: position++,
          belongsTo: createdDocument.id,
        }))

        return createdDocument.id
      })
    }

    const document = documentRealm.objectForPrimaryKey(
      DocumentRealmSchema,
      modifiedDocumentId
    )
    const pictures = documentRealm
      .objects(DocumentPictureRealmSchema)
      .filtered("belongsTo = $0", modifiedDocumentId)
      .sorted("position")
    if (!document) throw new Error("Document is undefined, this should not happen")
    setDocumentModel({ document, pictures })
  }

  function renderItem({ item }: { item: PhotoIdentifier }) {
    return (
      <ImageItem
        onClick={async () => await importSingleImage(item.node.image.uri)}
        onSelect={() => gallerySelection.select(item.node.image.uri)}
        onDeselect={() => gallerySelection.deselect(item.node.image.uri)}
        isSelectionMode={gallerySelection.isSelectionMode}
        isSelected={gallerySelection.selectedData.includes(item.node.image.uri)}
        imagePath={item.node.image.uri}
        screenAction={params.screenAction}
        columnCount={columnCount}
      />
    )
  }

  const keyExtractor = useCallback((_: PhotoIdentifier, index: number) => (
    index.toString()
  ), [])

  async function onEndReached() {
    if (isGalleryFullLoaded) {
      return
    }

    const galleryLength = imageGallery?.length ?? 0
    const currentRowAmount = (galleryLength / columnCount)
    if (currentRowAmount < minimumRowAmountInScreen) {
      return
    }

    await getImage(false)
  }

  function ListFooterComponent() {
    if (isLoading && imageGallery) {
      return <LoadingIndicator />
    }
    return null
  }

  async function onRefresh() {
    gallerySelection.exitSelection()
    setIsRefreshing(true)
    setIsGalleryFullLoaded(false)
    await getImage(true)
    setIsRefreshing(false)
  }


  useEffect(() => {
    getImage(false)
  }, [])


  return (
    <View style={{ flex: 1 }}>
      <GalleryHeader
        goBack={goBack}
        exitSelectionMode={gallerySelection.exitSelection}
        importImage={importMultipleImage}
        isSelectionMode={gallerySelection.isSelectionMode}
        selectedImagesAmount={gallerySelection.selectedData.length}
      />

      {(imageGallery && imageGallery.length > 0) && (
        <FlashList
          data={imageGallery}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          extraData={[gallerySelection.isSelectionMode]}
          estimatedItemSize={estimatedItemSize}
          numColumns={columnCount}
          onEndReachedThreshold={0.05}
          onEndReached={onEndReached}
          ListFooterComponent={ListFooterComponent}
          onRefresh={imageGallery?.length ? onRefresh : undefined}
          refreshing={isRefreshing}
        />
      )}

      <EmptyScreen.Content visible={!imageGallery && !isRefreshing}>
        <ActivityIndicator
          color={colors.onBackground}
          size={"large"}
        />
      </EmptyScreen.Content>

      <EmptyScreen.Content visible={imageGallery?.length === 0}>
        <EmptyScreen.Icon name={"image-outline"} size={56} />

        <EmptyScreen.Message>
          {translate("Gallery_emptyGallery")}
        </EmptyScreen.Message>
      </EmptyScreen.Content>

      <LoadingModal
        message={translate("Gallery_importingPictures")}
        visible={isImportingImages}
      />
    </View>
  )
}
