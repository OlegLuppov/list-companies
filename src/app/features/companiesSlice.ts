import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {
	deleteApiResourse,
	getApiResourse,
	postApiResourse,
	updateApiResourse,
} from '../shared/utils/network'
import { URLS_COMPANIES } from '../shared/utils/urls'
import { IChangeCompany, ICompanies, TRange } from '../interfaces'

interface IInitialState {
	data: ICompanies[]
	isLoading: boolean
	checkEndData: boolean
	isSelectedAll: boolean
	currentCompanies: string[]
}

const initialState: IInitialState = {
	data: [],
	isLoading: true,
	checkEndData: false,
	isSelectedAll: false,
	currentCompanies: [],
}

export const getCompaniesFetch = createAsyncThunk('getCompanies', async (range: TRange) => {
	const { start, limit } = range
	const URL = `${URLS_COMPANIES.BASE_URL}${URLS_COMPANIES.COMPANIES}?_start=${start}&_end=${limit}`
	const companies = await getApiResourse(URL)

	return companies
})

export const postCompaniesFetch = createAsyncThunk(
	'postCompanies',
	async (data: IChangeCompany) => {
		const URL = `${URLS_COMPANIES.BASE_URL}${URLS_COMPANIES.COMPANIES}`

		const result = await postApiResourse(URL, data)

		return result
	}
)

export const updateCompaniesFetch = createAsyncThunk(
	'updateCompanies',
	async (data: IChangeCompany) => {
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

		// так потому что !data.quantityEmp = 0, а может приходить и 0
		if (data.quantityEmp !== undefined && data.quantityEmp !== null) {
			body = {
				quantityEmp: data.quantityEmp,
			}
		}

		const result = await updateApiResourse(URL, body)

		return result
	}
)

export const deleteCompaniesFetch = createAsyncThunk('deleteCompanies', async (ids: string[]) => {
	if (!ids || !ids.length) return
	/*
		Важный момент, json-server не позволяет удалять сотрудников по query параметрам,
		дла тествого задания пойдет, но в реальности Сервис должен обеспечивать такие вещи, либо проставлять 
		элементам свойства deletedAt:true, но опять же по каким-либо query параметрам.
		Хранить в сущности Компании id сотрудников тоже не стал их может быть со временем более 10000,
		такой json получaть через api не прокатит, запрос может упасть.
		Поэтому в сущности сотрудников в поле companyId при удалении компании проставляется null, они просто не подтянуться при запросе.
		 */

	const urls = ids.map((id) => {
		return `${URLS_COMPANIES.BASE_URL}${URLS_COMPANIES.COMPANIES}/${id}`
	})

	await deleteApiResourse(urls)
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

			if (action.payload.selected) {
				state.currentCompanies.push(action.payload.id)
			} else {
				state.currentCompanies = state.currentCompanies.filter((id) => id !== action.payload.id)
			}
		},

		changeSelectedAllCompanies(state, action: PayloadAction<boolean>) {
			if (action === null || action === undefined) return

			state.isSelectedAll = action.payload
			state.data.forEach((company) => {
				company.selected = action.payload
			})

			if (action.payload) {
				state.currentCompanies = state.data.map((company) => company.id)
			} else {
				state.currentCompanies = []
			}
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

			// так потому что !action.payload.quantityEmp = 0, а может приходить и 0
			if (action.payload.quantityEmp !== undefined && action.payload.quantityEmp !== null) {
				findCompany.quantityEmp = action.payload.quantityEmp
			}
		},

		deleteCompanies(state) {
			if (!state.currentCompanies || !state.currentCompanies.length) return

			state.data = state.data.filter((company) => {
				const findCurrId = state.currentCompanies.find((id) => id === company.id)

				if (findCurrId) return false
				return true
			})

			state.currentCompanies = []
		},
	},

	extraReducers: (builder) => {
		// get companies
		builder.addCase(getCompaniesFetch.pending, (state) => {
			state.isLoading = true
		})

		builder.addCase(
			getCompaniesFetch.fulfilled,
			(state, action: PayloadAction<ICompanies[] | undefined>) => {
				state.isLoading = false
				if (!action.payload || !action.payload.length) {
					state.checkEndData = true
					return
				}

				action.payload.forEach((company) => {
					const findCompany = state.data.find((c) => c.id === company.id)
					if (findCompany) return

					if (state.isSelectedAll) {
						company.selected = state.isSelectedAll
					}
					state.data.push(company)
				})

				if (state.isSelectedAll) {
					state.currentCompanies = [
						...state.currentCompanies,
						...action.payload.map((company) => company.id),
					]
				}
			}
		)

		//update copmpanies
		builder.addCase(updateCompaniesFetch.pending, (state) => {
			state.isLoading = true
		})

		builder.addCase(updateCompaniesFetch.fulfilled, (state, action: PayloadAction<any>) => {
			state.isLoading = false
			if (!action) return
		})

		//delete copmpanies
		builder.addCase(deleteCompaniesFetch.pending, (state) => {
			state.isLoading = true
		})

		builder.addCase(deleteCompaniesFetch.fulfilled, (state) => {
			state.isLoading = false
		})

		//post copmpanies
		builder.addCase(postCompaniesFetch.pending, (state) => {
			state.isLoading = true
		})

		builder.addCase(postCompaniesFetch.fulfilled, (state, action: PayloadAction<ICompanies>) => {
			state.isLoading = false
			if (!action.payload) return
			action.payload.selected = state.isSelectedAll
			state.data.push(action.payload)
		})
	},
})

export const { changeSelectedCompany, changeSelectedAllCompanies, changeCompany, deleteCompanies } =
	companiesSlice.actions

export default companiesSlice.reducer
