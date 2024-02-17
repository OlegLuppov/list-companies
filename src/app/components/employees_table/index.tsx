import './style.scss'
import './style.scss'
import { v4 } from 'uuid'
import Notification from '../../../ui/notification'
import Preloader from '../../../ui/preloader'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import React, { useEffect, useRef, useState } from 'react'
import { useRange } from '../../shared/hooks/hooks'
import ButtonAdd from '../../../ui/buttons/button_add'
import ButtonDelete from '../../../ui/buttons/button_delete'
import cl from 'classnames'
import ButtonClose from '../../../ui/buttons/button_close'
import {
	changeSelectedAllEmployees,
	deleteEmployees,
	deleteEmployeesFetch,
	getEmployeesFetch,
	postEmployeesFetch,
	resetEmployees,
} from '../../features/employeesSlice'
import RowEmployees from '../row_employees'
import { changeCompany, updateCompaniesFetch } from '../../features/companiesSlice'

function Employees() {
	const { range, increaseRange, resetRange } = useRange({ start: 0, limit: 10 })
	const scrollbar = useRef<HTMLInputElement>(null)
	const [showPreloader, setShowPreloader] = useState<boolean>(false)
	const [showForm, setShowForm] = useState<boolean>(false)
	const [formLastName, setFormLastName] = useState<string>('')
	const [formFirstname, setFormFirstName] = useState<string>('')
	const [formPosition, setFormPosition] = useState<string>('')
	const [notificationMessage, setNotificationMessage] = useState<string>('')

	const checkEndData = useAppSelector((state) => state.employees.checkEndData)
	const data = useAppSelector((state) => state.employees.data)
	const companies = useAppSelector((state) => state.companies.data)
	const currentEmployees = useAppSelector((state) => state.employees.currentEmployees)
	const currentCompanies = useAppSelector((state) => state.companies.currentCompanies)

	const dispatch = useAppDispatch()

	const idForLabelInpAll = v4()

	useEffect(() => {
		dispatch(resetEmployees()) // reset data employees if change company
		resetRange() // Сброс диапазона для fetch запросов
	}, [currentCompanies])

	// start get data
	useEffect(() => {
		if (!currentCompanies || !currentCompanies.length) {
			setNotificationMessage('')
			return
		}

		if (!range || currentCompanies.length !== 1) {
			setNotificationMessage('Для отображения сотрудников должна быть выбрана только одна компания')
			return
		}

		setShowPreloader(true)

		const optionsfetch = {
			companyId: currentCompanies[0],
			start: range.start,
			limit: range.limit,
		}

		dispatch(getEmployeesFetch(optionsfetch)).finally(() => {
			setShowPreloader(false)
			if (!data || !data.length) {
				setNotificationMessage('Сотрудники не найдены')
			} else {
				setNotificationMessage('')
			}
		})
	}, [range, currentCompanies])

	// if is scroll
	function scrollHandler() {
		if (checkEndData || !currentCompanies || currentCompanies.length !== 1) return

		const endPositionScrop = Math.ceil(
			scrollbar.current?.scrollTop! + scrollbar.current?.clientHeight!
		)

		if (endPositionScrop !== scrollbar.current?.scrollHeight) return

		increaseRange(10)
	}

	// if no scroll
	function wheelHandler() {
		if (checkEndData || !currentCompanies || currentCompanies.length !== 1) return

		if (scrollbar.current?.scrollHeight! > scrollbar.current?.offsetHeight! || checkEndData) return // Проверка если скрол есть

		increaseRange(10)
	}

	// delete
	function handlerDelete(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault()
		dispatch(deleteEmployees())
		dispatch(deleteEmployeesFetch(currentEmployees))

		const findCurrentCompany = companies.find((company) => company.id === currentCompanies[0])
		const quantitySelectedEmpl = currentEmployees.length

		if (findCurrentCompany) {
			const newDataCompany = {
				id: currentCompanies[0],
				quantityEmp: findCurrentCompany.quantityEmp! - quantitySelectedEmpl,
			}
			dispatch(updateCompaniesFetch(newDataCompany))
			dispatch(changeCompany(newDataCompany))
		}
	}

	//selectedAll
	function selectedAllEmployees(e: React.ChangeEvent<HTMLInputElement>) {
		dispatch(changeSelectedAllEmployees(e.target.checked))
	}

	//hendlerAddEmployee
	function hendlerAdd(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault()
		setShowForm((prev) => !prev)
		setFormLastName((prev) => {
			if (prev === '') return prev
			return ''
		})
		setFormFirstName((prev) => {
			if (prev === '') return prev
			return ''
		})
		setFormPosition((prev) => {
			if (prev === '') return prev
			return ''
		})
	}

	//handlerForm
	function handlerFormInput(e: React.ChangeEvent<HTMLInputElement>, field: string) {
		switch (field) {
			case 'lastName':
				setFormLastName(e.target.value)
				break

			case 'firstName':
				setFormFirstName(e.target.value)
				break

			case 'position':
				setFormPosition(e.target.value)
				break

			default:
				break
		}
	}

	//handlerSubmit
	function handlerSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const dataEmployee = {
			id: v4(),
			companyId: currentCompanies[0],
			fullName: {
				firstName: formFirstname ? formFirstname : 'Не заполнено',
				lastName: formLastName ? formLastName : 'Не заполнено',
				secondName: 'Не предусмотрено по ТЗ',
			},
			position: formPosition ? formPosition : 'Не заполнено',
			selected: false,
		}

		dispatch(postEmployeesFetch(dataEmployee))

		const findCurrentCompany = companies.find((company) => company.id === currentCompanies[0])
		if (findCurrentCompany) {
			const newDataCompany = {
				id: currentCompanies[0],
				quantityEmp: findCurrentCompany.quantityEmp! + 1,
			}
			dispatch(updateCompaniesFetch(newDataCompany))
			dispatch(changeCompany(newDataCompany))
		}

		setShowForm((prev) => !prev)
	}

	function onKeyDownForm(e: React.KeyboardEvent<HTMLFormElement>) {
		if (e.code === 'Enter') {
			e.preventDefault()
		}
	}

	return (
		<div
			className={cl('t-employees', {
				't-employees--hide': !currentCompanies || !currentCompanies.length,
			})}
		>
			<div
				className={cl('form-bg', {
					'form-bg--show': showForm,
				})}
			>
				{
					<form
						onKeyDown={(e) => onKeyDownForm(e)}
						onSubmit={(e) => handlerSubmit(e)}
						className={cl('form', { 'form--show': showForm })}
						action=''
					>
						<ButtonClose title='Закрыть' callback={hendlerAdd} />
						<h2 className={cl('form__title', { 'form__title--show': showForm })}>
							Заполните данные
						</h2>

						<div className='form__field-wrapper'>
							<input
								onChange={(e) => handlerFormInput(e, 'lastName')}
								className='form__field-inp'
								type='text'
								name='lastName'
								id='lastName'
								value={formLastName}
								required
							/>
							<label className='form__field-lbl' htmlFor='lastName'>
								Фамилия
							</label>
						</div>
						<div className='form__field-wrapper'>
							<input
								onChange={(e) => handlerFormInput(e, 'firstName')}
								className='form__field-inp'
								type='text'
								name='firstName'
								id='firstName'
								value={formFirstname}
								required
							/>
							<label className='form__field-lbl' htmlFor='firstName'>
								Имя
							</label>
						</div>
						<div className='form__field-wrapper'>
							<input
								onChange={(e) => handlerFormInput(e, 'position')}
								className='form__field-inp'
								type='text'
								name='position'
								id='position'
								value={formPosition}
								required
							/>
							<label className='form__field-lbl' htmlFor='position'>
								Должность
							</label>
						</div>

						<div className={cl('form__submit-wrapper', { 'form__submit-wrapper--show': showForm })}>
							<input
								className='form__submit-btn'
								type='submit'
								value='Сохранить'
								name='Сохранить'
							/>
						</div>
					</form>
				}
			</div>
			<div className='t-employees__th'>
				<div className='t-employees__tr t-employees__tr--inp'>
					<div className='t-employees__inp-all-wrapper'>
						<input
							onChange={(e) => selectedAllEmployees(e)}
							className='t-employees__inp-all'
							id={idForLabelInpAll}
							type='checkbox'
						/>
						<label className='t-employees__inp-label' htmlFor={idForLabelInpAll}>
							Выделить все
						</label>
					</div>
					<div className='t-employees__btn-wrapper'>
						{
							<ButtonAdd
								disabled={!currentCompanies || currentCompanies.length !== 1 ? true : false}
								title='Добавить сотрудника'
								show={true}
								name='+ Сотрудник'
								callback={hendlerAdd}
							/>
						}
						{
							<ButtonDelete
								title='Удалить сотрудника'
								show={!currentEmployees.length ? false : true}
								callback={handlerDelete}
							/>
						}
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
				onWheel={wheelHandler}
				className={'t-employees__tb'}
			>
				<Preloader
					show={showPreloader}
					description='Идет загрузка данных'
					styles={{ top: '60px', height: 'calc(100% - 60px)' }}
				/>
				{data && data.length && currentCompanies && currentCompanies.length === 1 ? (
					<ul className='t-employees__tb-list'>
						{data.map((employee) => (
							<RowEmployees key={v4()} employee={employee} />
						))}
					</ul>
				) : (
					<Notification name={notificationMessage} />
				)}
			</div>
		</div>
	)
}

export default Employees
