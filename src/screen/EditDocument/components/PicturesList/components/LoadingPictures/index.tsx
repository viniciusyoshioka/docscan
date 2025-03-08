import { ActivityIndicator } from "react-native-paper"
import { EmptyScreen } from "react-native-paper-towel"


interface LoadingPicturesProps {}


// TODO: Replace ActivityIndicator by skeleton
// TODO: Replace EmptyScreen component after update the library
export function LoadingPictures(props: LoadingPicturesProps) {
  return (
    <EmptyScreen.Content visible={true}>
      <ActivityIndicator size={"large"} />
    </EmptyScreen.Content>
  )
}
