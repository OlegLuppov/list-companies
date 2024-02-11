import { useState } from 'react'
import { TRange } from '../../interfaces'

export function useRange(args: TRange | null) {
	const [range, setRange] = useState<TRange | null>(args)

	function increaseRange(increase: number) {
		setRange((prev) => {
			if (!prev || !increase) return prev

			const newRange = {
				start: (prev.start += increase),
				limit: (prev.limit += increase),
			}
			return newRange
		})
	}

	return {
		range,
		setRange,
		increaseRange,
	}
}
