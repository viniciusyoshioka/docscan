import { ActivityIndicator } from 'react-native-paper'
import { EmptyScreen } from 'react-native-paper-towel'


interface LoadingImagesListProps {}


// TODO: Replace ActivityIndicator by skeleton
// TODO: Replace EmptyScreen component after update the library
export function LoadingImagesList(props: LoadingImagesListProps) {
  return (
    <EmptyScreen.Content visible={true}>
      <ActivityIndicator size={'large'} />
    </EmptyScreen.Content>
  )
}
