import './style.scss'
import { IRowCompaniesProps } from '../../interfaces'

import cl from 'classnames'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
	changeCompany,
	changeSelectedCompany,
	updateCompaniesFetch,
} from '../../features/companiesSlice'
import { useState } from 'react'

function RowCompanies({ company }: IRowCompaniesProps) {
	const [isEditName, setIsEditName] = useState<boolean>(false)
	const [isEditAddress, setIsEditAddress] = useState<boolean>(false)
	const [name, setName] = useState(company.name)
	const [address, setAddress] = useState(company.address)

	const isSelectedAll = useAppSelector((state) => state.companies.isSelectedAll)
	const currentCompanies = useAppSelector((state) => state.companies.currentCompanies)
	const dispatch = useAppDispatch()

	function handlerSelectCopmpany(e: React.ChangeEvent<HTMLInputElement>) {
		dispatch(changeSelectedCompany({ id: company.id, selected: e.target.checked }))
	}
	// Name
	function handlerDoubleClickName() {
		setIsEditName(true)
		setIsEditAddress(false)

		setAddress(company.address)
	}

	function handlerChangeName(e: React.ChangeEvent<HTMLInputElement>) {
		setName((prev) => {
			if (prev === e.target.value) return prev
			prev = e.target.value
			return prev
		})
	}

	function handlerEnterPressName(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.code !== 'Enter') return
		setIsEditName(false)

		if (name === company.name) return

		const newDataCompany = {
			id: company.id,
			name: name ? name : 'Не заполнено',
		}

		dispatch(changeCompany(newDataCompany))
		dispatch(updateCompaniesFetch(newDataCompany))
	}

	// Address
	function handlerDoubleClickAddress() {
		setIsEditAddress(true)
		setIsEditName(false)

		setName(company.name)
	}

	function handlerChangeAddress(e: React.ChangeEvent<HTMLInputElement>) {
		setAddress((prev) => {
			if (prev === e.target.value) return prev
			prev = e.target.value
			return prev
		})
	}

	function handlerEnterPressAddress(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.code !== 'Enter') return
		setIsEditAddress(false)

		if (address === company.address) return

		const newDataCompany = {
			id: company.id,
			address: address ? address : 'Не заполнено',
		}

		dispatch(changeCompany(newDataCompany))
		dispatch(updateCompaniesFetch(newDataCompany))
	}

	return (
		<li
			className={cl('t-companies__tr', {
				't-companies__tr--selected': company.selected,
			})}
		>
			<div className='t-companies__td t-companies__td--select'>
				<input
					checked={company.selected}
					onChange={(e) => handlerSelectCopmpany(e)}
					className='t-companies__inp'
					type='checkbox'
				/>
			</div>
			{isEditName && company.selected && !isSelectedAll && currentCompanies.length === 1 ? (
				<div className='t-companies__td t-companies__td--name'>
					<input
						autoFocus
						onKeyDown={(e) => handlerEnterPressName(e)}
						onChange={(e) => handlerChangeName(e)}
						value={name}
						className='t-companies__td-inp'
					></input>
				</div>
			) : (
				<div
					onDoubleClick={handlerDoubleClickName}
					className='t-companies__td t-companies__td--name'
				>
					<p>{name}</p>
				</div>
			)}

			<div className='t-companies__td t-companies__td--num'>
				<p>{company.quantityEmpl}</p>
			</div>
			{isEditAddress && company.selected && !isSelectedAll && currentCompanies.length === 1 ? (
				<div className='t-companies__td t-companies__td--address'>
					<input
						autoFocus
						onKeyDown={(e) => handlerEnterPressAddress(e)}
						onChange={(e) => handlerChangeAddress(e)}
						value={address}
						className='t-companies__td-inp'
					></input>
				</div>
			) : (
				<div
					onDoubleClick={handlerDoubleClickAddress}
					className='t-companies__td t-companies__td--address'
				>
					<p>{address}</p>
				</div>
			)}
		</li>
	)
}

export default RowCompanies
