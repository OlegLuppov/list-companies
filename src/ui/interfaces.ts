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
