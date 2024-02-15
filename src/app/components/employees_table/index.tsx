import './style.scss'
import './style.scss'
import { v4 } from 'uuid'
import Notification from '../../../ui/notification'
import Preloader from '../../../ui/preloader'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import React, { useEffect, useRef, useState } from 'react'
import {
	changeSelectedAllCompanies,
	deleteCompanies,
	deleteCompaniesFetch,
	getCompaniesFetch,
	postCompaniesFetch,
} from '../../features/companiesSlice'
import { useRange } from '../../shared/hooks/hooks'
import ButtonAdd from '../../../ui/buttons/button_add'
import ButtonDelete from '../../../ui/buttons/button_delete'
import cl from 'classnames'
import ButtonClose from '../../../ui/buttons/button_close'
import { getEmployeesFetch } from '../../features/employeesSlice'
import RowEmployees from '../row_employees'

function Employees() {
	const { range, increaseRange } = useRange({ start: 0, limit: 10 })
	const scrollbar = useRef<HTMLInputElement>(null)
	const [showPreloader, setShowPreloader] = useState<boolean>(false)
	const [showForm, setShowForm] = useState<boolean>(false)
	const [formName, setFormName] = useState<string>('')
	const [formAddress, setFormAddress] = useState<string>('')

	const checkEndData = useAppSelector((state) => state.employees.checkEndData)
	const data = useAppSelector((state) => state.employees.data)
	const currentCompanies = useAppSelector((state) => state.employees.currentEmployees)

	const dispatch = useAppDispatch()

	const idForLabelInpAll = v4()

	// start get data
	useEffect(() => {
		if (!range) return
		setShowPreloader(true)
		dispatch(getEmployeesFetch(range)).finally(() => setShowPreloader(false))
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

	return (
		<div className='t-employees'>
			<div
				className={cl('form-bg', {
					'form-bg--show': showForm,
				})}
			>
				{/* <form
					onSubmit={(e) => handlerSubmit(e)}
					className={cl('form', { 'form--show': showForm })}
					action=''
				>
					<ButtonClose title='Закрыть' callback={hendlerAdd} />
					<h2 className={cl('form__title', { 'form__title--show': showForm })}>Заполните данные</h2>

					<div className='form__field-wrapper'>
						<input
							onChange={(e) => handlerFormName(e)}
							className='form__field-inp'
							type='text'
							name='name'
							id='name'
							value={formName}
							required
						/>
						<label className='form__field-lbl' htmlFor='name'>
							Название компании
						</label>
					</div>
					<div className='form__field-wrapper'>
						<input
							onChange={(e) => handlerFormAddres(e)}
							className='form__field-inp'
							type='text'
							name='address'
							id='addres'
							value={formAddress}
							required
						/>
						<label className='form__field-lbl' htmlFor='addres'>
							Адрес
						</label>
					</div>

					<div className={cl('form__submit-wrapper', { 'form__submit-wrapper--show': showForm })}>
						<input className='form__submit-btn' type='submit' value='Сохранить' name='Сохранить' />
					</div>
				</form> */}
			</div>
			<div className='t-employees__th'>
				<div className='t-employees__tr t-employees__tr--inp'>
					<div className='t-employees__inp-all-wrapper'>
						<input
							// onChange={(e) => selectedAllCompanies(e)}
							className='t-employees__inp-all'
							id={idForLabelInpAll}
							type='checkbox'
						/>
						<label className='t-employees__inp-label' htmlFor={idForLabelInpAll}>
							Выделить все
						</label>
					</div>
					<div className='t-employees__btn-wrapper'>
						{/* <ButtonAdd
							title='Добавить сотрудника'
							show={true}
							name='+ Сотрудник'
							callback={hendlerAdd}
						/> */}
						{/* <ButtonDelete
							title='Удалить сотрудника'
							show={!currentCompanies.length ? false : true}
							callback={handlerDelete}
						/> */}
					</div>
				</div>
				<div className='t-employees__tr t-employees__tr--titles'>
					<div className='t-employees__td t-employees__td--select'>
						<span>Чекбокс</span>
					</div>
					<div className='t-employees__td t-employees__td--name'>
						<span>Фамилия</span>
					</div>
					<div className='t-employees__td t-employees__td--num'>
						<span>Имя</span>
					</div>
					<div className='t-employees__td t-employees__td--address'>
						<span>Должность</span>
					</div>
				</div>
			</div>
			<div
				ref={scrollbar}
				onScroll={scrollHandler}
				onWheel={(e) => wheelHandler(e)}
				className={'t-employees__tb'}
			>
				<Preloader
					show={showPreloader}
					description='Идет загрузка данных'
					styles={{ top: '60px', height: 'calc(100% - 60px)' }}
				/>
				{data && data.length ? (
					<ul className='t-employees__tb-list'>
						{data.map((employee) => (
							<RowEmployees key={v4()} employee={employee} />
						))}
					</ul>
				) : (
					<Notification name='Сотрудники не найдены' />
				)}
			</div>
		</div>
	)
}

export default Employees
