export function getReadableUnit(unit: string, interval: number): string {
  switch (unit) {
    case 'minute':
      return interval === 1 ? 'minute' : 'minutes';
    case 'hour':
      return interval === 1 ? 'hour' : 'hours';
    case 'day':
      return interval === 1 ? 'day' : 'days';
    case 'year':
      return interval === 1 ? 'year' : 'years';
    default:
      return unit;
  }
}
