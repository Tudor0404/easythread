export function intToU8Int(num: number) {
	if (num > 12.7 || num < -12.7) {
		throw new Error(
			"out of range, from -12.7 to 12.7 allowed, given:" + num
		);
	} else {
		return Math.round(num * 10);
	}
}
