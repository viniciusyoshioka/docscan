import { SystemBars } from 'react-native-edge-to-edge'


export interface StatusBarProps {
  isHidden?: boolean
}


export function StatusBar(props: StatusBarProps) {
  const { isHidden = false } = props


  return (
    <SystemBars
      hidden={isHidden}
      style={{
        statusBar: 'auto',
        navigationBar: 'auto',
      }}
    />
  )
}
