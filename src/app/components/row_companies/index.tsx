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

	// handlerEnterPress
	function handlerEnterPress(e: React.KeyboardEvent<HTMLInputElement>, field: string) {
		if (e.code !== 'Enter') return
		switch (field) {
			case 'name': {
				setIsEditName(false)

				if (name === company.name) break

				const newDataCompany = {
					id: company.id,
					name: name ? name : 'Не заполнено',
				}

				dispatch(changeCompany(newDataCompany))
				dispatch(updateCompaniesFetch(newDataCompany))
				break
			}
			case 'address': {
				setIsEditAddress(false)

				if (address === company.address) break

				const newDataCompany = {
					id: company.id,
					address: address ? address : 'Не заполнено',
				}

				dispatch(changeCompany(newDataCompany))
				dispatch(updateCompaniesFetch(newDataCompany))
				break
			}
			default:
				break
		}
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
						onKeyDown={(e) => handlerEnterPress(e, 'name')}
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
						onKeyDown={(e) => handlerEnterPress(e, 'address')}
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
