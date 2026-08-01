import type { StyleProp, ViewStyle } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'


const style: StyleProp<ViewStyle> = {
  paddingVertical: 24,
}


interface LoadingMoreItemsProps {}


export function LoadingMoreItems(props: LoadingMoreItemsProps) {
  return (
    <ActivityIndicator
      size={'small'}
      style={style}
    />
  )
}
