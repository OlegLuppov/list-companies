import './style.scss'
import cl from 'classnames'
import { v4 } from 'uuid'
import { Scrollbar } from 'smooth-scrollbar-react'
import { useAppSelector } from '../../store/hooks'

function Companies() {
	const data = useAppSelector((state) => state.companies.data)
	const idForLabel = v4()

	return (
		<div className='t-companies'>
			<div className='t-companies__th'>
				<div className='t-companies__tr t-companies__tr--inp'>
					<input className='t-companies__inp-all' id={idForLabel} type='checkbox' />
					<label className='t-companies__inp-label' htmlFor={idForLabel}>
						Выделить все
					</label>
				</div>
				<div className='t-companies__tr t-companies__tr--titles'>
					<div className='t-companies__td t-companies__td--select'>
						<span>Чекбокс</span>
					</div>
					<div className='t-companies__td t-companies__td--name'>
						<span>Название компании</span>
					</div>
					<div className='t-companies__td t-companies__td--num'>
						<span>Кол-во сотрудников</span>
					</div>
					<div className='t-companies__td t-companies__td--address'>
						<span>Адрес</span>
					</div>
				</div>

				<Scrollbar>
					<div className='t-companies__tb'>
						{data ? (
							data.map((com) => (
								<div className='t-companies__tr' key={v4()}>
									<div className='t-companies__td t-companies__td--select'>
										<input className='t-companies__inp' type='checkbox' />
									</div>
									<div className='t-companies__td t-companies__td--name'>
										<p>{com.name}</p>
									</div>
									<div className='t-companies__td t-companies__td--num'>
										<p>{com.quantityEmpl}</p>
									</div>
									<div className='t-companies__td t-companies__td--address'>
										<p>{com.address}</p>
									</div>
								</div>
							))
						) : (
							<div>Компании не найдены</div>
						)}
					</div>
				</Scrollbar>
			</div>
		</div>
	)
}

export default Companies
