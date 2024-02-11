import './style.scss'
import { TNotificationProps } from '../interfaces'

function Notification({ name }: TNotificationProps) {
	return (
		<div className='notification__wrp'>
			<p className='notification__description'>{name}</p>
		</div>
	)
}

export default Notification
