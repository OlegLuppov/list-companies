import { IButton } from '../../interfaces'
import './style.scss'
import cl from 'classnames'

function ButtonAdd({ name, callback, title, show }: IButton) {
	return (
		<button
			title={title}
			className={cl('btn-add', {
				'btn-add--hide': !show,
			})}
			onClick={(e) => callback(e)}
		>
			{name}
		</button>
	)
}

export default ButtonAdd
