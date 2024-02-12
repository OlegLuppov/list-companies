export async function getApiResourse(url: string) {
	try {
		const resp = await fetch(url, {
			method: 'GET',
		})

		const data = await resp.json()

		return data
	} catch (err: any) {
		console.error(`Not get companies: ${err.message}`)
		return
	}
}

export async function setApiResourse(url: string, body: any) {
	try {
		const resp = await fetch(url, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		})

		const result = await resp.text()

		return result
	} catch (err: any) {
		console.error(`No set companies: ${err.message}`)
	}
}
