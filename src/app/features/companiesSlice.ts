import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { getApiResourse } from '../utils/network'
import { URLS_COMPANIES } from '../utils/urls'
import { ICompanies, IEmployees } from '../interfaces'

interface IInitialState {
	data?: ICompanies[]
	dataEmployees?: IEmployees[]
	isLoading: boolean
}

const initialState: IInitialState = {
	data: [],
	isLoading: true,
}

export const getCompanies = createAsyncThunk('companies', async () => {
	const companies = await getApiResourse(`${URLS_COMPANIES.BASE_URL}${URLS_COMPANIES.COMPANIES}`)

	return companies
})

export const companiesSlice = createSlice({
	name: 'companies',
	initialState,

	reducers: {},

	extraReducers: (builder) => {
		// get companies
		builder.addCase(getCompanies.pending, (state) => {
			state.isLoading = true
		})

		builder.addCase(getCompanies.fulfilled, (state, action) => {
			state.isLoading = false
			state.data = action.payload
		})
	},
})

export const {} = companiesSlice.actions

export default companiesSlice.reducer
