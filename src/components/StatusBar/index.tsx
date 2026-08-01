import type { SystemBarsProps } from 'react-native-edge-to-edge'
import { SystemBars } from 'react-native-edge-to-edge'


const style: SystemBarsProps['style'] = {
  statusBar: 'auto',
  navigationBar: 'auto',
}


export interface StatusBarProps {
  isHidden?: boolean
}


export function StatusBar(props: StatusBarProps) {
  const { isHidden = false } = props


  return (
    <SystemBars
      hidden={isHidden}
      style={style}
    />
  )
}
