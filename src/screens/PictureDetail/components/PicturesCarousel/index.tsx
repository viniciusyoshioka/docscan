import { useCallback, useRef } from 'react'
import type { FlatListProps, ListRenderItem } from 'react-native'
import { FlatList, useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import type { PictureEntity } from '@database'
import { useDocumentState } from '@modules/document-state'
import { useZoomActivation } from '../../hooks'
import { PictureVisualizationItem } from './components'


interface PicturesCarouselProps {
  isVisible: boolean
  currentPictureIndex: number
  toggleScreenVisibility: () => void
  onCurrentIndexChange: (newCurrentIndex: number) => void
}


export function PicturesCarousel(props: PicturesCarouselProps) {
  const {
    isVisible,
    currentPictureIndex,
    toggleScreenVisibility,
    onCurrentIndexChange,
  } = props


  const { width } = useWindowDimensions()
  const safeAreaInsets = useSafeAreaInsets()

  const flatListRef = useRef<FlatList | null>(null)
  const { pictures } = useDocumentState()

  const zoomActivation = useZoomActivation()


  const scrollToItem = useCallback((index: number) => {
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
    })
  }, [flatListRef])

  const renderItem: ListRenderItem<PictureEntity> = useCallback(
    ({ item, index }) => {
      return (
        <PictureVisualizationItem
          item={item}
          onZoomActivated={zoomActivation.onZoomActivated}
          onZoomDeactivated={zoomActivation.onZoomDeactivated}
          onSingleTap={toggleScreenVisibility}
          scrollToItem={() => scrollToItem(index)}
        />
      )
    },
    [
      zoomActivation.onZoomActivated,
      zoomActivation.onZoomDeactivated,
      toggleScreenVisibility,
      scrollToItem,
    ],
  )

  const getItemLayout: FlatListProps<PictureEntity>['getItemLayout'] =
    useCallback((data, index) => ({
      index,
      length: width,
      offset: width * index,
    }), [width])

  const onMomentumScrollEnd: FlatListProps<PictureEntity>['onMomentumScrollEnd'] =
    useCallback(event => {
      const newCurrentIndex = Math.round(
        event.nativeEvent.contentOffset.x / width,
      )

      onCurrentIndexChange(newCurrentIndex)
    }, [width, onCurrentIndexChange])


  const initialScrollIndex = currentPictureIndex
  const scrollEnabled = !zoomActivation.isZoomActive


  if (!isVisible) return null


  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        marginLeft: safeAreaInsets.left,
      }}
    >
      <FlatList
        ref={flatListRef}
        data={pictures ?? []}
        renderItem={renderItem}
        horizontal={true}
        getItemLayout={getItemLayout}
        onMomentumScrollEnd={onMomentumScrollEnd}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        initialScrollIndex={initialScrollIndex}
        scrollEnabled={scrollEnabled}
      />
    </View>
  )
}
