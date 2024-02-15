import './style.scss'

import './style.scss'
import { IRowEmployeesProps } from '../../interfaces'

import cl from 'classnames'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useState } from 'react'
import {
	changeEmployee,
	changeSelectedEmployee,
	updateEmployeesFetch,
} from '../../features/employeesSlice'

function RowEmployees({ employee }: IRowEmployeesProps) {
	const [isEditName, setIsEditName] = useState<boolean>(false)
	const [isEditLastName, setIsEditLastName] = useState<boolean>(false)
	const [isEditPosition, setIsEditPosition] = useState<boolean>(false)

	const [firstName, setFirstName] = useState(employee.fullName.firstName)
	const [lastName, setLastName] = useState(employee.fullName.lastName)
	const [position, setPosition] = useState(employee.position)

	const isSelectedAll = useAppSelector((state) => state.employees.isSelectedAll)
	const currentEmployees = useAppSelector((state) => state.employees.currentEmployees)
	const dispatch = useAppDispatch()

	function handlerSelectEmpmloyee(e: React.ChangeEvent<HTMLInputElement>) {
		dispatch(changeSelectedEmployee({ id: employee.id, selected: e.target.checked }))
	}
	// LastName
	function handlerDoubleClickLastName() {
		setIsEditLastName(true)
		setIsEditPosition(false)
		setIsEditName(false)

		setPosition(employee.position)
		setFirstName(employee.fullName.firstName)
	}

	function handlerChangeLastName(e: React.ChangeEvent<HTMLInputElement>) {
		setLastName((prev) => {
			if (prev === e.target.value) return prev
			prev = e.target.value
			return prev
		})
	}

	function handlerEnterPresslastName(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.code !== 'Enter') return
		setIsEditLastName(false)

		if (lastName === employee.fullName.lastName) return

		const newDataEmployee = {
			id: employee.id,
			fullName: {
				firstName: employee.fullName.firstName,
				lastName: lastName ? lastName : 'Не заполнено',
				secondName: employee.fullName.secondName,
			},
		}

		dispatch(changeEmployee(newDataEmployee))
		dispatch(updateEmployeesFetch(newDataEmployee))
	}

	// Name
	function handlerDoubleClickFirstName() {
		setIsEditName(true)
		setIsEditLastName(false)
		setIsEditPosition(false)

		setPosition(employee.position)
		setLastName(employee.fullName.lastName)
	}

	function handlerChangeFirstName(e: React.ChangeEvent<HTMLInputElement>) {
		setFirstName((prev) => {
			if (prev === e.target.value) return prev
			prev = e.target.value
			return prev
		})
	}
	function handlerEnterPressFirstName(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.code !== 'Enter') return
		setIsEditName(false)

		if (name === employee.fullName.firstName) return

		const newDataEmployee = {
			id: employee.id,
			fullName: {
				firstName: firstName ? firstName : 'Не заполнено',
				lastName: employee.fullName.lastName,
				secondName: employee.fullName.secondName,
			},
		}

		dispatch(changeEmployee(newDataEmployee))
		dispatch(updateEmployeesFetch(newDataEmployee))
	}

	// Position
	function handlerDoubleClickPosition() {
		setIsEditPosition(true)
		setIsEditName(false)
		setIsEditLastName(false)

		setFirstName(employee.fullName.firstName)
		setLastName(employee.fullName.lastName)
	}

	function handlerChangePosition(e: React.ChangeEvent<HTMLInputElement>) {
		setPosition((prev) => {
			if (prev === e.target.value) return prev
			prev = e.target.value
			return prev
		})
	}
	function handlerEnterPressPosition(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.code !== 'Enter') return
		setIsEditPosition(false)

		if (position === employee.position) return

		const newDataEmployee = {
			id: employee.id,
			position: position ? position : 'Не заполнено',
		}

		dispatch(changeEmployee(newDataEmployee))
		dispatch(updateEmployeesFetch(newDataEmployee))
	}

	return (
		<li
			className={cl('t-employees__tr', {
				't-employees__tr--selected': employee.selected,
			})}
		>
			<div className='t-employees__td t-employees__td--select'>
				<input
					checked={employee.selected}
					onChange={(e) => handlerSelectEmpmloyee(e)}
					className='t-employees__inp'
					type='checkbox'
				/>
			</div>
			{isEditLastName && employee.selected && !isSelectedAll && currentEmployees.length === 1 ? (
				<div className='t-employees__td t-employees__td--lastname'>
					<input
						autoFocus
						onKeyDown={(e) => handlerEnterPresslastName(e)}
						onChange={(e) => handlerChangeLastName(e)}
						value={lastName}
						className='t-employees__td-inp'
					></input>
				</div>
			) : (
				<div
					onDoubleClick={handlerDoubleClickLastName}
					className='t-employees__td t-employees__td--lastname'
				>
					<p>{lastName}</p>
				</div>
			)}

			{isEditName && employee.selected && !isSelectedAll && currentEmployees.length === 1 ? (
				<div className='t-employees__td t-employees__td--firsname'>
					<input
						autoFocus
						onKeyDown={(e) => handlerEnterPressFirstName(e)}
						onChange={(e) => handlerChangeFirstName(e)}
						value={firstName}
						className='t-employees__td-inp'
					></input>
				</div>
			) : (
				<div
					onDoubleClick={handlerDoubleClickFirstName}
					className='t-employees__td t-employees__td--firsname'
				>
					<p>{firstName}</p>
				</div>
			)}

			{isEditPosition && !isSelectedAll && currentEmployees.length === 1 ? (
				<div
					onDoubleClick={(e) => {
						e.stopPropagation()
					}}
					className='t-employees__td t-employees__td--position'
				>
					<input
						autoFocus
						onKeyDown={(e) => handlerEnterPressPosition(e)}
						onChange={(e) => handlerChangePosition(e)}
						value={position}
						className='t-employees__td-inp'
					></input>
				</div>
			) : (
				<div
					onDoubleClick={handlerDoubleClickPosition}
					className='t-employees__td t-employees__td--position'
				>
					<p>{position}</p>
				</div>
			)}
		</li>
	)
}

export default RowEmployees
