export interface ICompanies {
	id: string
	name?: string
	quantityEmpl?: number
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
