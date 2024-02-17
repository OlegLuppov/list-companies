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
import RowCompanies from '../row_companies'
import ButtonAdd from '../../../ui/buttons/button_add'
import ButtonDelete from '../../../ui/buttons/button_delete'
import cl from 'classnames'
import ButtonClose from '../../../ui/buttons/button_close'

function Companies() {
	const { range, increaseRange } = useRange({ start: 0, limit: 10 })
	const scrollbar = useRef<HTMLInputElement>(null)
	const [showPreloader, setShowPreloader] = useState<boolean>(false)
	const [showForm, setShowForm] = useState<boolean>(false)
	const [formName, setFormName] = useState<string>('')
	const [formAddress, setFormAddress] = useState<string>('')

	const checkEndData = useAppSelector((state) => state.companies.checkEndData)
	const data = useAppSelector((state) => state.companies.data)
	const currentCompanies = useAppSelector((state) => state.companies.currentCompanies)

	const dispatch = useAppDispatch()

	const idForLabelInpAll = v4()

	// start get data
	useEffect(() => {
		if (!range) return
		setShowPreloader(true)
		dispatch(getCompaniesFetch(range)).finally(() => setShowPreloader(false))
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

	function handlerDelete() {
		console.log('delete')
		dispatch(deleteCompanies())
		dispatch(deleteCompaniesFetch(currentCompanies))
	}

	function hendlerAdd(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault()
		setShowForm((prev) => !prev)
		setFormName((prev) => {
			if (prev === '') return prev
			return ''
		})
		setFormAddress((prev) => {
			if (prev === '') return prev
			return ''
		})
	}

	//handlerForm
	function handlerFormInput(e: React.ChangeEvent<HTMLInputElement>, field: string) {
		switch (field) {
			case 'name':
				setFormName(e.target.value)
				break

			case 'address':
				setFormAddress(e.target.value)
				break

			default:
				break
		}
	}

	function handlerSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()

		const dataCompany = {
			id: v4(),
			name: formName,
			address: formAddress,
			quantityEmp: 0,
			selected: false,
		}

		dispatch(postCompaniesFetch(dataCompany))

		setShowForm((prev) => !prev)
	}

	function onKeyDownForm(e: React.KeyboardEvent<HTMLFormElement>) {
		if (e.code === 'Enter') {
			e.preventDefault()
		}
	}

	return (
		<div className='t-companies'>
			<div
				className={cl('form-bg', {
					'form-bg--show': showForm,
				})}
			>
				<form
					onKeyDown={(e) => onKeyDownForm(e)}
					onSubmit={(e) => handlerSubmit(e)}
					className={cl('form', { 'form--show': showForm })}
					action=''
				>
					<ButtonClose title='Закрыть' callback={hendlerAdd} />
					<h2 className={cl('form__title', { 'form__title--show': showForm })}>Заполните данные</h2>

					<div className='form__field-wrapper'>
						<input
							onChange={(e) => handlerFormInput(e, 'name')}
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
							onChange={(e) => handlerFormInput(e, 'address')}
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
				</form>
			</div>
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
					<div className='t-companies__btn-wrapper'>
						<ButtonAdd
							title='Добавить компанию'
							show={true}
							name='+ Компания'
							callback={hendlerAdd}
						/>
						<ButtonDelete
							title='Удалить компанию'
							show={!currentCompanies.length ? false : true}
							callback={handlerDelete}
						/>
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
				{data && data.length ? (
					<ul className='t-companies__tb-list'>
						{data.map((com) => (
							<RowCompanies key={v4()} company={com} />
						))}
					</ul>
				) : (
					<Notification name='Компании не найдены' />
				)}
			</div>
		</div>
	)
}

export default Companies
