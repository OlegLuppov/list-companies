import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {
	deleteApiResourse,
	getApiResourse,
	postApiResourse,
	updateApiResourse,
} from '../shared/utils/network'
import { URLS_COMPANIES } from '../shared/utils/urls'
import { IChangeEmployee, IEmployees, IGetEmployees } from '../interfaces'

interface IInitialState {
	data: IEmployees[]
	isLoading: boolean
	checkEndData: boolean
	isSelectedAll: boolean
	currentEmployees: string[]
}

const initialState: IInitialState = {
	isLoading: true,
	data: [],
	checkEndData: false,
	isSelectedAll: false,
	currentEmployees: [],
}

export const getEmployeesFetch = createAsyncThunk(
	'getEmployees',
	async (optionsfetch: IGetEmployees) => {
		const { start, limit, companyId } = optionsfetch
		const URL = `${URLS_COMPANIES.BASE_URL}${URLS_COMPANIES.EMPLOYEES}?companyId=${companyId}&_start=${start}&_end=${limit}`
		const employees = await getApiResourse(URL)

		return employees
	}
)

export const updateEmployeesFetch = createAsyncThunk(
	'updateEmployees',
	async (data: IChangeEmployee) => {
		const URL = `${URLS_COMPANIES.BASE_URL}${URLS_COMPANIES.EMPLOYEES}/${data.id}`
		let body
		if (data.fullName) {
			body = {
				fullName: data.fullName,
			}
		}

		if (data.position) {
			body = {
				position: data.position,
			}
		}

		const result = await updateApiResourse(URL, body)

		return result
	}
)

export const deleteEmployeesFetch = createAsyncThunk('deleteEmployees', async (ids: string[]) => {
	if (!ids || !ids.length) return

	const urls = ids.map((id) => {
		return `${URLS_COMPANIES.BASE_URL}${URLS_COMPANIES.EMPLOYEES}/${id}`
	})

	await deleteApiResourse(urls)
})

export const postEmployeesFetch = createAsyncThunk('postEmployees', async (data: IEmployees) => {
	const URL = `${URLS_COMPANIES.BASE_URL}${URLS_COMPANIES.EMPLOYEES}`

	const result = await postApiResourse(URL, data)

	return result
})

export const employeesSlice = createSlice({
	name: 'employees',
	initialState,

	reducers: {
		changeSelectedEmployee(state, action: PayloadAction<{ id: string; selected: boolean }>) {
			if (!action.payload) return

			const findSelected = state.data.find((employee) => employee.id === action.payload.id)

			if (!findSelected) return

			findSelected.selected = action.payload.selected

			if (action.payload.selected) {
				state.currentEmployees.push(action.payload.id)
			} else {
				state.currentEmployees = state.currentEmployees.filter((id) => id !== action.payload.id)
			}
		},

		changeEmployee(state, action: PayloadAction<IChangeEmployee>) {
			if (!action.payload) return

			const findCompany = state.data.find((employee) => employee.id === action.payload.id)

			if (!findCompany) return

			if (action.payload.fullName) {
				findCompany.fullName = action.payload.fullName
			}

			if (action.payload.position) {
				findCompany.position = action.payload.position
			}
		},

		deleteEmployees(state) {
			if (!state.currentEmployees || !state.currentEmployees.length) {
				return
			}

			state.data = state.data.filter((employee) => {
				const findCurrId = state.currentEmployees.find((id) => id === employee.id)

				if (findCurrId) {
					return false
				}
				return true
			})

			state.currentEmployees = []
		},

		changeSelectedAllEmployees(state, action: PayloadAction<boolean>) {
			if (action === null || action === undefined) return

			state.isSelectedAll = action.payload
			state.data.forEach((employee) => {
				employee.selected = action.payload
			})

			if (action.payload) {
				state.currentEmployees = state.data.map((employee) => employee.id)
			} else {
				state.currentEmployees = []
			}
		},

		resetEmployees(state) {
			state.data = []
			state.currentEmployees = []
			state.checkEndData = false
		},
	},

	extraReducers: (builder) => {
		// get employees
		builder.addCase(getEmployeesFetch.pending, (state) => {
			state.isLoading = true
		})

		builder.addCase(
			getEmployeesFetch.fulfilled,
			(state, action: PayloadAction<IEmployees[] | undefined>) => {
				state.isLoading = false
				if (!action.payload || !action.payload.length) {
					state.checkEndData = true
					return
				}

				action.payload.forEach((employee) => {
					const findCompany = state.data.find((e) => e.id === employee.id)
					if (findCompany) return

					if (state.isSelectedAll) {
						employee.selected = state.isSelectedAll
					}
					state.data.push(employee)
				})

				if (state.isSelectedAll) {
					state.currentEmployees = [
						...state.currentEmployees,
						...action.payload.map((company) => company.id),
					]
				}
			}
		)

		//update employees
		builder.addCase(updateEmployeesFetch.pending, (state) => {
			state.isLoading = true
		})

		builder.addCase(updateEmployeesFetch.fulfilled, (state) => {
			state.isLoading = false
		})

		//delete employees
		builder.addCase(deleteEmployeesFetch.pending, (state) => {
			state.isLoading = true
		})

		builder.addCase(deleteEmployeesFetch.fulfilled, (state) => {
			state.isLoading = false
		})

		//post employees
		builder.addCase(postEmployeesFetch.pending, (state) => {
			state.isLoading = true
		})

		builder.addCase(postEmployeesFetch.fulfilled, (state, action: PayloadAction<IEmployees>) => {
			state.isLoading = false
			if (!action.payload) return
			action.payload.selected = state.isSelectedAll
			state.data.push(action.payload)
		})
	},
})

export const {
	changeSelectedEmployee,
	changeEmployee,
	deleteEmployees,
	changeSelectedAllEmployees,
	resetEmployees,
} = employeesSlice.actions

export default employeesSlice.reducer
