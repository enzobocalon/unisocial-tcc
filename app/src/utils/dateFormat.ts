export function formatDateWithTime(isoString: string): string {
  // Garantir que a data seja tratada como UTC
  const date = new Date(isoString);

  // Formatar a data considerando o fuso horário local do dispositivo
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  return formatter.format(date).replace(',', ' às');
}

export function dateFormat(date: string) {
  const dateObj = new Date(date);
  const now = new Date();
  const diff = now.getTime() - dateObj.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `${years} ano(s)`;
  }
  if (months > 0) {
    return `${months} mes(es)`;
  }
  if (days > 0) {
    return `${days} dia(s)`;
  }
  if (hours > 0) {
    return `${hours} hora(s)`;
  }
  if (minutes > 0) {
    return `${minutes} minuto(s)`;
  }

  return `${seconds <= 0 ? 'Agora' : `${seconds} segundo(s)`}`;
}

export function formatToExactDate(date: string): string {
  const inputDate = new Date(date);
  const currentDate = new Date();

  const formatDate = (d: Date): string => {
    const formatter = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });

    return formatter.format(d);
  };

  const getDayOfWeek = (d: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
    };
    return d.toLocaleDateString('pt-BR', options);
  };

  // Checa se é no mesmo dia
  if (
    inputDate.getDate() === currentDate.getDate() &&
    inputDate.getMonth() === currentDate.getMonth() &&
    inputDate.getFullYear() === currentDate.getFullYear()
  ) {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    return inputDate.toLocaleTimeString(undefined, options);
  }

  // Checa se é no dia anterior
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);
  if (
    inputDate.getDate() === yesterday.getDate() &&
    inputDate.getMonth() === yesterday.getMonth() &&
    inputDate.getFullYear() === yesterday.getFullYear()
  ) {
    return 'Ontem';
  }

  // Checa se está dentro de uma semana
  const oneWeekAgo = new Date(currentDate);
  oneWeekAgo.setDate(currentDate.getDate() - 7);
  if (inputDate > oneWeekAgo) {
    return getDayOfWeek(inputDate);
  }

  return formatDate(inputDate);
}
