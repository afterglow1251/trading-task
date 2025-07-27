export function ensureValidNumber(value: any, fallback: number = 1): number {
  const num = Number(value);
  return isNaN(num) || value === null ? fallback : num;
}
