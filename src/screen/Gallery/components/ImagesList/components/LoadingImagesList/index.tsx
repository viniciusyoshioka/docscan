import { ActivityIndicator } from "react-native-paper"
import { EmptyScreen } from "react-native-paper-towel"


interface LoadingImagesListProps {}


export function LoadingImagesList(props: LoadingImagesListProps) {
  return (
    <EmptyScreen.Content visible={true}>
      <ActivityIndicator size={"large"} />
    </EmptyScreen.Content>
  )
}
