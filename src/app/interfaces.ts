export interface ICompanies {
	id: string
	name?: string
	quantityEmpl?: number
	address: string
	selected: boolean
}

export interface IEmployees {
	id: string
	companyId?: string
	fullName: TName
	position?: string
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

export interface IOptionsForGetCompanie extends TRange {
	checkEndData: boolean
}

export interface IRowCompaniesProps {
	company: ICompanies
}
