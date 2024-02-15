import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { getApiResourse, updateApiResourse } from '../shared/utils/network'
import { URLS_COMPANIES } from '../shared/utils/urls'
import { IChangeEmployee, IEmployees, TRange } from '../interfaces'

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

export const getEmployeesFetch = createAsyncThunk('getEmployees', async (range: TRange) => {
	const { start, limit } = range
	const URL = `${URLS_COMPANIES.BASE_URL}${URLS_COMPANIES.EMPLOYEES}?_start=${start}&_end=${limit}`
	const employees = await getApiResourse(URL)

	return employees
})

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
	},
})

export const { changeSelectedEmployee, changeEmployee } = employeesSlice.actions

export default employeesSlice.reducer
