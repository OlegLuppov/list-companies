import './style.scss'
import cl from 'classnames'
import { IButton } from '../../interfaces'

function ButtonDelete({ show, title, callback }: IButton) {
	return (
		<button
			title={title}
			className={cl('btn-delete', {
				'btn-delete--hide': !show,
			})}
			onKeyDown={(e) => e.preventDefault()}
			onClick={callback}
		>
			<div className='btn-delete__i-wrapper'></div>
		</button>
	)
}

export default ButtonDelete
