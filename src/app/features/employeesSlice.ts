import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { getApiResourse } from '../utils/network'
import { URLS_COMPANIES } from '../utils/urls'
import { IEmployees } from '../interfaces'

interface IInitialState {
	data?: IEmployees[]
	isLoading: boolean
}

const initialState: IInitialState = {
	isLoading: true,
	data: [],
}

export const getEmployees = createAsyncThunk('employees', async () => {
	const companies = await getApiResourse(`${URLS_COMPANIES.BASE_URL}${URLS_COMPANIES.EMPLOYEES}`)

	return companies
})

export const employeesSlice = createSlice({
	name: 'employees',
	initialState,

	reducers: {},

	extraReducers: (builder) => {
		// get employees
		builder.addCase(getEmployees.pending, (state) => {
			state.isLoading = true
		})

		builder.addCase(getEmployees.fulfilled, (state, action) => {
			state.isLoading = false
			state.data = action.payload
		})
	},
})

export const {} = employeesSlice.actions

export default employeesSlice.reducer
