import { IButton } from '../../interfaces'
import './style.scss'
import cl from 'classnames'

function ButtonAdd({ name, callback, title, show, disabled }: IButton) {
	return (
		<button
			disabled={disabled !== undefined && disabled !== null ? disabled : false}
			title={title}
			className={cl('btn-add', {
				'btn-add--hide': !show,
				'btn-add--disabled': disabled,
			})}
			onKeyDown={(e) => e.preventDefault()}
			onClick={(e) => callback(e)}
		>
			{name}
		</button>
	)
}

export default ButtonAdd
