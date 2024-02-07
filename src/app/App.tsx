import { useAppDispatch, useAppSelector } from './store/hooks'
import { getCompanies } from './features/companiesSlice'
import { useEffect, useState } from 'react'
import { getEmployees } from './features/employeesSlice'

function App() {
	const dataCompanies = useAppSelector((state) => state.companies.data)
	const dispatch = useAppDispatch()

	useEffect(() => {
		dispatch(getCompanies())
		dispatch(getEmployees())
	}, [])

	return (
		<>
			<div>{dataCompanies && dataCompanies.length ? dataCompanies[0].name : ''}</div>
		</>
	)
}

export default App
