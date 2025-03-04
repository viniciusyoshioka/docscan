import { ActivityIndicator } from "react-native-paper"
import { EmptyScreen } from "react-native-paper-towel"


interface LoadingDocumentsProps {}


// TODO: Replace ActivityIndicator by skeleton
export function LoadingDocuments(props: LoadingDocumentsProps) {
  return (
    <EmptyScreen.Content visible={true}>
      <ActivityIndicator size={"large"} />
    </EmptyScreen.Content>
  )
}
