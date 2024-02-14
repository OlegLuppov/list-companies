export async function getApiResourse(url: string) {
	try {
		const resp = await fetch(url, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		})

		const data = await resp.json()

		return data
	} catch (err: any) {
		console.error(`Not get companies: ${err.message}`)
		return
	}
}

export async function updateApiResourse(url: string, body: any) {
	try {
		const resp = await fetch(url, {
			method: 'PATCH',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		})

		const result = await resp.text()

		return result
	} catch (err: any) {
		console.error(`No PATCH companies: ${err.message}`)
	}
}

export async function postApiResourse(url: string, body: any) {
	try {
		const resp = await fetch(url, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		})

		const result = await resp.json()
		return result
	} catch (err: any) {
		console.error(`No POST companies: ${err.message}`)
	}
}

// Метод DELETE у json-server не позволяет удалять сразу несколько компаний это не есть good, поэтому только Promise.all
export async function deleteApiResourse(urls: string[]) {
	try {
		const delFetch = urls.map((url) => {
			return fetch(url, {
				method: 'DELETE',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
			})
		})

		const result = await Promise.all(delFetch)
		return result
	} catch (err: any) {
		console.error(`No DELETE companies: ${err.message}`)
	}
}
