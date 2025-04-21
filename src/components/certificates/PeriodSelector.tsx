
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Period } from '@/types/certificate';

interface PeriodSelectorProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  periods: Period[];
}

export const PeriodSelector = ({ selectedPeriod, onPeriodChange, periods }: PeriodSelectorProps) => {
  return (
    <div className="w-full sm:w-64">
      <label htmlFor="period-select" className="text-sm font-medium block mb-2">
        Período
      </label>
      <Select value={selectedPeriod} onValueChange={onPeriodChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione o período" />
        </SelectTrigger>
        <SelectContent>
          {periods.map((period) => (
            <SelectItem key={period.value} value={period.value}>
              {period.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
