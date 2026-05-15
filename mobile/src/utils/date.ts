export function formatDate(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return 'Brak daty';
  }

  const textValue = String(value).trim();
  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(textValue);

  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    return `${day}.${month}.${year}`;
  }

  const date = new Date(textValue);

  if (Number.isNaN(date.getTime())) {
    return 'Brak daty';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

export function isDateField(key: string): boolean {
  const normalizedKey = key.toLowerCase();

  return (
    normalizedKey.includes('date') ||
    normalizedKey.includes('createdat') ||
    normalizedKey.includes('closedat') ||
    normalizedKey.endsWith('atutc')
  );
}
