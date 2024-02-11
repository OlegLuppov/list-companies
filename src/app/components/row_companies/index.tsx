import './style.scss'
import { IRowCompaniesProps } from '../../interfaces'

import cl from 'classnames'
import { useAppDispatch } from '../../store/hooks'
import { changeSelectedCompany } from '../../features/companiesSlice'
import { useState } from 'react'

function RowCompanies({ company }: IRowCompaniesProps) {
	const [isEditName, setIsEditName] = useState<boolean>(false)
	const [isEditAddress, setIsEditAddress] = useState<boolean>(false)
	const [name, setName] = useState(company.name)
	const [address, setaddress] = useState(company.name)
	const dispatch = useAppDispatch()

	function handlerSelectCopmpany(e: React.ChangeEvent<HTMLInputElement>) {
		dispatch(changeSelectedCompany({ id: company.id, selected: e.target.checked }))
	}

	function handlerDoubleClickName() {
		setIsEditName(true)
	}

	function handlerDoubleClickAddress() {
		setIsEditAddress(true)
	}

	function handlerChangeName(e: React.ChangeEvent<HTMLInputElement>) {
		setName((prev) => {
			if (prev === e.target.value) return prev
			prev = e.target.value
			return prev
		})
	}

	function handlerChangeAddress(e: React.ChangeEvent<HTMLInputElement>) {
		setaddress((prev) => {
			if (prev === e.target.value) return prev
			prev = e.target.value
			return prev
		})
	}

	function handlerEnterPressName(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.code !== 'Enter') return
		setIsEditName(false)
	}

	function handlerEnterPressAddress(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.code !== 'Enter') return
		setIsEditAddress(false)
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
			{isEditName && company.selected ? (
				<input
					onKeyDown={(e) => handlerEnterPressName(e)}
					onChange={(e) => handlerChangeName(e)}
					value={name}
					className='t-companies__td t-companies__td--name'
				></input>
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
			{isEditAddress && company.selected ? (
				<input
					onKeyDown={(e) => handlerEnterPressAddress(e)}
					onChange={(e) => handlerChangeAddress(e)}
					value={address}
					className='t-companies__td t-companies__td--address'
				></input>
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
