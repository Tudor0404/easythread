export function intToU8Int(num: number) {
	if (num > 12.7 || num < -12.7) {
		throw new Error("out of range, from -127 to 127 allowed, given:" + num);
	} else {
		return Math.round(num * 10);
	}
}
