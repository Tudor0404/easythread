export function intToU8Int(num: number) {
	// bound num to -12.7 and 12.7, since floating numbers can be very slightly off the real value
	return (num < -12.7 ? -12.7 : num > 12.7 ? 12.7 : num) * 10;
}
