import './style.scss'
import cl from 'classnames'
import { TPreloaderProps } from '../interfaces'

function Preloader({ show, description, styles }: TPreloaderProps) {
	return (
		<div
			style={styles ? styles : {}}
			className={cl('loader', {
				'loader--show': show,
			})}
		>
			<div className='loader__spinner'></div>
			{description && <p className='loader__message'>{description}</p>}
		</div>
	)
}

export default Preloader
