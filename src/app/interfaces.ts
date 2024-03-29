export interface IChangeCompany {
	id: string
	name?: string
	address?: string
	quantityEmp?: number
}

interface IFullName {
	firstName?: string
	lastName?: string
	secondName?: string
}

export interface IChangeEmployee {
	id: string
	fullName?: IFullName
	position?: string
}

export interface ICompanies extends IChangeCompany {
	quantityEmp?: number
	selected: boolean
}

export interface IEmployees {
	id: string
	companyId?: string
	fullName: TName
	position?: string
	selected: boolean
}

type TName = {
	lastName?: string
	firstName?: string
	secondName?: string
}

export type TRange = {
	start: number
	limit: number
}

export interface IGetEmployees extends TRange {
	companyId: string
}

export interface IOptionsForGetCompanie extends TRange {
	checkEndData: boolean
}

export interface IRowCompaniesProps {
	company: ICompanies
}

export interface IRowEmployeesProps {
	employee: IEmployees
}
