import { ReactNode } from 'react'
import { Languages, Theme, Mode, CustomTheme, CustomAvatarProps } from 'connectkit/build/types'

export type ConnectKitOptions = {
  language?: Languages
  hideTooltips?: boolean
  hideQuestionMarkCTA?: boolean
  hideNoWalletCTA?: boolean
  walletConnectCTA?: 'modal' | 'link' | 'both'
  avoidLayoutShift?: boolean // Avoids layout shift when the ConnectKit modal is open by adding padding to the body
  embedGoogleFonts?: boolean // Automatically embeds Google Font of the current theme. Does not work with custom themes
  truncateLongENSAddress?: boolean
  walletConnectName?: string
  reducedMotion?: boolean
  disclaimer?: ReactNode | string
  bufferPolyfill?: boolean
  customAvatar?: React.FC<CustomAvatarProps>
  initialChainId?: number
}

export type ConnectKitProviderProps = {
  children?: React.ReactNode
  theme?: Theme
  mode?: Mode
  customTheme?: CustomTheme
  options?: ConnectKitOptions
}

export enum ProviderStatus {
  SuccessConnect = 'SuccessConnect',
  ErrorConnect = 'ErrorConnect',
  SuccessDisconnect = 'SuccessDisconnect',
  ErrorDisconnect = 'ErrorDisconnect',
  SuccessSwitchNetwork = 'SuccessSwitchNetwork',
  ErrorSwitchNetwork = 'ErrorSwitchNetwork',
  SuccessWalletSign = 'SuccessWalletSign',
  ErrorWalletSign = 'ErrorWalletSign',
}

export interface DataStatus {
  message: unknown
  status: ProviderStatus
}
