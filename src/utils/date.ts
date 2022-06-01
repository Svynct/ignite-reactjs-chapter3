import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (date: string): string => {
  const formattedDate = format(new Date(date), 'dd MMM yyyy', {
    locale: ptBR,
  });
  return formattedDate;
};

export const formatReadingTime = (minutes: number): string => {
  return `${minutes} min`;
};
