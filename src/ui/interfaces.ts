export interface TNotificationProps {
	name: string
}

interface IpreloaderStyles {
	top?: string
	height?: string
}

export interface TPreloaderProps {
	show: boolean
	description?: string
	styles?: IpreloaderStyles
}

export interface IButton {
	name?: string
	callback: (e: React.MouseEvent<HTMLButtonElement>) => void
	show?: boolean
	title?: string
	disabled?: boolean
}
