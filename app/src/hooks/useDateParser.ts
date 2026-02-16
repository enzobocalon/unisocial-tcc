export function useDateParser() {
  const formatDay = (rawDate: Date) => {
    const isValidDate = (date: Date) => !isNaN(new Date(date).getTime());

    // Criar uma nova data considerando o fuso horário local
    const dateStr = isValidDate(rawDate)
      ? new Date(rawDate).toISOString()
      : new Date().toISOString();
    const date = new Date(dateStr);

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isToday) {
      return 'Hoje';
    } else if (isYesterday) {
      return 'Ontem';
    } else {
      // Usar o Intl.DateTimeFormat para garantir que a data seja formatada corretamente
      const formatter = new Intl.DateTimeFormat('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      return formatter.format(date);
    }
  };

  return {
    formatDay,
  };
}
