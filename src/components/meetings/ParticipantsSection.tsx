
import React from 'react';
import { Professor } from '@/types/meeting';

interface ParticipantsSectionProps {
  professors: Professor[];
  selectedProfessors: number[];
  onToggleProfessor: (id: number) => void;
}

export const ParticipantsSection: React.FC<ParticipantsSectionProps> = ({
  professors,
  selectedProfessors,
  onToggleProfessor,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Participantes *
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border rounded-md p-3 max-h-52 overflow-y-auto">
        {professors.map((professor) => (
          <div key={professor.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`professor-${professor.id}`}
              checked={selectedProfessors.includes(professor.id)}
              onChange={() => onToggleProfessor(professor.id)}
              className="rounded border-gray-300"
            />
            <label htmlFor={`professor-${professor.id}`} className="text-sm">
              {professor.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
