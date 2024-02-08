import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { Action, PayloadAction } from '@reduxjs/toolkit'
import { getApiResourse } from '../utils/network'
import { URLS_COMPANIES } from '../utils/urls'
import { ICompanies } from '../interfaces'

interface IInitialState {
	data: ICompanies[]
	isLoading: boolean
	checkEndData: boolean
}

const initialState: IInitialState = {
	data: [],
	isLoading: true,
	checkEndData: false,
}

type TRange = {
	start: number
	limit: number
}

export const getCompanies = createAsyncThunk('companies', async (range: TRange) => {
	const { start, limit } = range
	const URL = `${URLS_COMPANIES.BASE_URL}${URLS_COMPANIES.COMPANIES}?_start=${start}&_end=${limit}`
	const companies = await getApiResourse(URL)

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

		builder.addCase(getCompanies.fulfilled, (state, action: PayloadAction<ICompanies[]>) => {
			state.isLoading = false
			if (!action.payload || !action.payload.length) {
				state.checkEndData = true
				return
			}
			state.data = [...state.data, ...action.payload]
		})
	},
})

export const {} = companiesSlice.actions

export default companiesSlice.reducer
