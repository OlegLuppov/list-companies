import './app.scss'
import Companies from './components/companies_table'
import Employees from './components/employees_table'

function App() {
	return (
		<div className='container'>
			<div className='companies__wrapper'>
				<h2 className='companies__title'>Компании</h2>
				<Companies />
			</div>
			<div className='employees__wrapper'>
				<h2 className='employees__title'>Сотрудники</h2>
				<Employees />
			</div>
		</div>
	)
}

export default App
