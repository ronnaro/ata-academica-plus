
import { Period, Professor } from '@/types/certificate';

export const professors: Professor[] = [
  { id: 1, name: 'Ana Silva', siape: '1234567', department: 'Informática', meetingsAttended: 12 },
  { id: 2, name: 'Carlos Oliveira', siape: '2345678', department: 'Matemática', meetingsAttended: 8 },
  { id: 3, name: 'Mariana Santos', siape: '3456789', department: 'Biologia', meetingsAttended: 15 },
  { id: 4, name: 'Ricardo Lima', siape: '4567890', department: 'Física', meetingsAttended: 10 },
  { id: 5, name: 'Juliana Costa', siape: '5678901', department: 'Língua Portuguesa', meetingsAttended: 7 },
];

export const periods: Period[] = [
  { value: '2024.1', label: '2024.1 (Jan-Jun)' },
  { value: '2023.2', label: '2023.2 (Jul-Dez)' },
  { value: '2023.1', label: '2023.1 (Jan-Jun)' },
  { value: '2022.2', label: '2022.2 (Jul-Dez)' },
];
