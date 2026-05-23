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
