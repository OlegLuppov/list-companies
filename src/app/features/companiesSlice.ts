import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { getApiResourse } from '../shared/utils/network'
import { URLS_COMPANIES } from '../shared/utils/urls'
import { ICompanies, TRange } from '../interfaces'

interface IInitialState {
	data: ICompanies[]
	isLoading: boolean
	checkEndData: boolean
	isSelectedAll: boolean
}

const initialState: IInitialState = {
	data: [],
	isLoading: true,
	checkEndData: false,
	isSelectedAll: false,
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

	reducers: {
		changeSelectedCompany(state, action: PayloadAction<{ id: string; selected: boolean }>) {
			if (!action.payload) return

			const findSelected = state.data.find((company) => company.id === action.payload.id)

			if (!findSelected) return

			findSelected.selected = action.payload.selected
		},

		changeSelectedAllCompanies(state, action: PayloadAction<boolean>) {
			if (action === null || action === undefined) return

			state.isSelectedAll = action.payload
			state.data.forEach((company) => (company.selected = action.payload))
		},
	},

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

			if (state.isSelectedAll) {
				action.payload.forEach((company) => (company.selected = state.isSelectedAll))
			}
			state.data = [...state.data, ...action.payload]
		})
	},
})

export const { changeSelectedCompany, changeSelectedAllCompanies } = companiesSlice.actions

export default companiesSlice.reducer
