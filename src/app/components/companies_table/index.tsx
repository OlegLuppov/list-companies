import './style.scss'
import { v4 } from 'uuid'
import Notification from '../../../ui/notification'
import Preloader from '../../../ui/preloader'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { useEffect, useRef, useState } from 'react'
import { changeSelectedAllCompanies, getCompanies } from '../../features/companiesSlice'
import { useRange } from '../../shared/hooks/hooks'
import RowCompanies from '../row_companies'

function Companies() {
	const { range, increaseRange } = useRange({ start: 0, limit: 10 })
	const scrollbar = useRef<HTMLInputElement>(null)
	const [showPreloader, setShowPreloader] = useState<boolean>(false)

	const checkEndData = useAppSelector((state) => state.companies.checkEndData)
	const data = useAppSelector((state) => state.companies.data)

	const dispatch = useAppDispatch()

	const idForLabelInpAll = v4()

	// start get data
	useEffect(() => {
		if (!range) return
		setShowPreloader(true)
		dispatch(getCompanies(range)).finally(() => setShowPreloader(false))
	}, [range])

	// if is scroll
	function scrollHandler() {
		if (checkEndData) return

		const endPositionScrop = Math.ceil(
			scrollbar.current?.scrollTop! + scrollbar.current?.clientHeight!
		)

		if (endPositionScrop !== scrollbar.current?.scrollHeight) return

		increaseRange(10)
	}

	// if no scroll
	function wheelHandler(e: React.MouseEvent<HTMLElement>) {
		e.stopPropagation()

		if (scrollbar.current?.scrollHeight! > scrollbar.current?.offsetHeight! || checkEndData) return // Проверка если скрол есть

		increaseRange(10)
	}

	function selectedAllCompanies(e: React.ChangeEvent<HTMLInputElement>) {
		dispatch(changeSelectedAllCompanies(e.target.checked))
	}

	return (
		<div className='t-companies'>
			<div className='t-companies__th'>
				<div className='t-companies__tr t-companies__tr--inp'>
					<div className='t-companies__inp-all-wrapper'>
						<input
							onChange={(e) => selectedAllCompanies(e)}
							className='t-companies__inp-all'
							id={idForLabelInpAll}
							type='checkbox'
						/>
						<label className='t-companies__inp-label' htmlFor={idForLabelInpAll}>
							Выделить все
						</label>
					</div>
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
			</div>
			<div
				ref={scrollbar}
				onScroll={scrollHandler}
				onWheel={(e) => wheelHandler(e)}
				className={'t-companies__tb'}
			>
				<Preloader
					show={showPreloader}
					description='Идет загрузка данных'
					styles={{ top: '60px', height: 'calc(100% - 60px)' }}
				/>
				<ul className='t-companies__tb-list'>
					{data && data.length ? (
						data.map((com) => <RowCompanies key={v4()} company={com} />)
					) : (
						<Notification name='Компании не найдены' />
					)}
				</ul>
			</div>
		</div>
	)
}

export default Companies
