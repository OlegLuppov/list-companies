import { IButton } from '../../interfaces'
import './style.scss'

function ButtonClose({ callback, title }: IButton) {
	return (
		<button
			title={title}
			className='btn__clouse'
			onKeyDown={(e) => e.preventDefault()}
			onClick={(e) => callback(e)}
		></button>
	)
}

export default ButtonClose
