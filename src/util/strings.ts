export function extractOnlyNumbers(value: string) {
	return value.replace(/\D/g, '').trim();
}
