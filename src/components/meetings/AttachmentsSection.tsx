
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface AttachmentsSectionProps {
  attachments: FileList | null;
  onAttachmentsChange: (files: FileList | null) => void;
}

export const AttachmentsSection: React.FC<AttachmentsSectionProps> = ({
  attachments,
  onAttachmentsChange,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Anexos
      </label>
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6">
        <input
          type="file"
          id="attachments"
          className="hidden"
          multiple
          onChange={(e) => onAttachmentsChange(e.target.files)}
        />
        <label htmlFor="attachments" className="cursor-pointer">
          <div className="text-center">
            <Upload className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Arraste arquivos aqui ou clique para selecionar
            </p>
            <Button type="button" variant="outline" className="mt-2">
              Selecionar Arquivos
            </Button>
          </div>
        </label>
        {attachments && attachments.length > 0 && (
          <div className="mt-4 space-y-2">
            {Array.from(attachments).map((file, index) => (
              <div key={index} className="text-sm text-gray-500">
                {file.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
