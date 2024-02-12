import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { getApiResourse, setApiResourse } from '../shared/utils/network'
import { URLS_COMPANIES } from '../shared/utils/urls'
import { IChangeCompany, ICompanies, TRange } from '../interfaces'

interface IInitialState {
	data: ICompanies[]
	isLoading: boolean
	checkEndData: boolean
	isSelectedAll: boolean
	isSelectedSeveral: boolean
}

const initialState: IInitialState = {
	data: [],
	isLoading: true,
	checkEndData: false,
	isSelectedAll: false,
	isSelectedSeveral: false,
}

export const getCompanies = createAsyncThunk('setCompanies', async (range: TRange) => {
	const { start, limit } = range
	const URL = `${URLS_COMPANIES.BASE_URL}${URLS_COMPANIES.COMPANIES}?_start=${start}&_end=${limit}`
	const companies = await getApiResourse(URL)

	return companies
})

export const setCompanies = createAsyncThunk('getCompanies', async (data: IChangeCompany) => {
	const URL = `${URLS_COMPANIES.BASE_URL}${URLS_COMPANIES.COMPANIES}/${data.id}`
	let body
	if (data.name) {
		body = {
			name: data.name,
		}
	}

	if (data.address) {
		body = {
			address: data.address,
		}
	}

	const companies = await setApiResourse(URL, body)

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

			const quantitySelected = state.data.filter((company) => company.selected).length
			if (quantitySelected > 1) {
				state.isSelectedSeveral = true
			} else {
				state.isSelectedSeveral = false
			}
		},

		changeSelectedAllCompanies(state, action: PayloadAction<boolean>) {
			if (action === null || action === undefined) return

			state.isSelectedAll = action.payload
			state.data.forEach((company) => (company.selected = action.payload))
		},

		changeCompany(state, action: PayloadAction<IChangeCompany>) {
			if (!action.payload) return

			const findCompany = state.data.find((company) => company.id === action.payload.id)

			if (!findCompany) return

			if (action.payload.name) {
				findCompany.name = action.payload.name
			}

			if (action.payload.address) {
				findCompany.address = action.payload.address
			}
		},
	},

	extraReducers: (builder) => {
		// get companies
		builder.addCase(getCompanies.pending, (state) => {
			state.isLoading = true
		})

		builder.addCase(
			getCompanies.fulfilled,
			(state, action: PayloadAction<ICompanies[] | undefined>) => {
				state.isLoading = false
				if (!action.payload || !action.payload.length) {
					state.checkEndData = true
					return
				}

				if (state.isSelectedAll) {
					action.payload.forEach((company) => (company.selected = state.isSelectedAll))
				}
				state.data = [...state.data, ...action.payload]
			}
		)

		//set copmpanies
		builder.addCase(setCompanies.pending, (state) => {
			state.isLoading = true
		})

		builder.addCase(setCompanies.fulfilled, (state) => {
			state.isLoading = false
		})
	},
})

export const { changeSelectedCompany, changeSelectedAllCompanies, changeCompany } =
	companiesSlice.actions

export default companiesSlice.reducer
