import { ActivityIndicator } from "react-native-paper"


interface LoadingMoreItemsProps {}


export function LoadingMoreItems(props: LoadingMoreItemsProps) {
  return (
    <ActivityIndicator
      size={"small"}
      style={{ paddingVertical: 24 }}
    />
  )
}
