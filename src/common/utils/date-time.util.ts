export function getFormattedDateTime(): string {
  const now = new Date();

  const time = now.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Formato 24h
  });

  const date = now.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return `${time} ${date}`;
}
