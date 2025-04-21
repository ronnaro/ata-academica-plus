
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { SemesterForm } from '@/components/semesters/SemesterForm';
import { SemesterList } from '@/components/semesters/SemesterList';
import RequireAuth from '@/components/RequireAuth';

const SemesterPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <RequireAuth requireCoordinator>
      <AppLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-academic-primary dark:text-academic-secondary">
              Semestres Letivos
            </h1>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-academic-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Semestre
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Semestre</DialogTitle>
                  <DialogDescription>
                    Cadastre um novo semestre letivo no sistema.
                  </DialogDescription>
                </DialogHeader>
                <SemesterForm onComplete={() => setIsDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          <SemesterList />
        </div>
      </AppLayout>
    </RequireAuth>
  );
};

export default SemesterPage;
