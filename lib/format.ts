export function formatHeight(heightCm: number) {
  return `${(heightCm / 100).toFixed(2).replace(".", ",")}m`;
}

export function normalizeName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function toCardName(firstName: string, lastName: string) {
  const name = `${normalizeName(firstName)} ${normalizeName(lastName)}`.trim();
  return name.toLocaleUpperCase("pt-BR");
}

export function toTeamName(team: string) {
  return normalizeName(team).toLocaleUpperCase("pt-BR");
}

const BIRTH_DATE_PATTERN = /^(\d{2})-(\d{2})-(\d{4})$/;

export function formatBirthDate(day: string, month: string, year: string) {
  const d = day.padStart(2, "0");
  const m = month.padStart(2, "0");
  const y = year.padStart(4, "0");

  if (!/^\d{2}$/.test(d) || !/^\d{2}$/.test(m) || !/^\d{4}$/.test(y)) {
    return "";
  }

  return `${d}-${m}-${y}`;
}

export function isValidBirthDate(value: string) {
  const match = BIRTH_DATE_PATTERN.exec(value);

  if (!match) {
    return false;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  if (month < 1 || month > 12) {
    return false;
  }

  if (year < 1900 || year > new Date().getUTCFullYear() + 1) {
    return false;
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}
