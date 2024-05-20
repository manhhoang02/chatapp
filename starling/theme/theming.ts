import { Platform, StatusBar } from 'react-native'

import { useThemeContext } from '@starlingtech/element'

import colorDark from './color/dark'
import colorDefault from './color/light'
import { fonts } from './fonts'
import { sizes } from './sizes'

const UI_WIDTH = 375
const UI_HEIGHT = 812

export { sizes, fonts, UI_WIDTH, UI_HEIGHT, colorDefault, colorDark }
export type ColorScheme = typeof colorDefault

export function handlerStatusBar(mode: 'dark' | 'light') {
  if (mode === 'light') {
    StatusBar.setBarStyle('dark-content')
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true)
      StatusBar.setBackgroundColor('transparent')
      // StatusBar.setBackgroundColor('#FFFFFF')
    }
  } else {
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true)
      StatusBar.setBackgroundColor('transparent')
      // StatusBar.setBackgroundColor('#000000')
    }
    StatusBar.setBarStyle('light-content')
  }
}

export const useAppTheme = () => {
  return useThemeContext()
}

export const useAppColor = () => {
  return useThemeContext().colors
}
