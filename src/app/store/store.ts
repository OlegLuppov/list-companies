import { configureStore } from '@reduxjs/toolkit'
import companiesReduser from '../features/companiesSlice'
import employeesSliceReduser from '../features/employeesSlice'

const store = configureStore({
	reducer: {
		companies: companiesReduser,
		employees: employeesSliceReduser,
	},
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
