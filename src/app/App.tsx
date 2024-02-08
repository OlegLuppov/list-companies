import './app.scss'
import { useAppDispatch } from './store/hooks'
import { getCompanies } from './features/companiesSlice'
import { useEffect } from 'react'
import Companies from './components/companies_table'

function App() {
	const dispatch = useAppDispatch()

	useEffect(() => {
		const range = { start: 0, limit: 10 }
		dispatch(getCompanies(range))
	}, [])

	return (
		<div className='container'>
			<Companies />
		</div>
	)
}

export default App
