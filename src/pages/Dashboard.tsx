
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/components/AppLayout';
import { Calendar, Users, FileText, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import NewMeetingForm from '@/components/NewMeetingForm';

// Mock data for our dashboard
const recentMeetings = [
  { id: 1, title: 'Reunião Ordinária do Colegiado', date: '2024-04-15', type: 'Ordinária', participants: 12 },
  { id: 2, title: 'Reunião Extraordinária - Ajuste Curricular', date: '2024-04-10', type: 'Extraordinária', participants: 8 },
  { id: 3, title: 'Comissão de TCC', date: '2024-04-05', type: 'Comissão', participants: 5 },
];

const upcomingMeetings = [
  { id: 4, title: 'Reunião de Planejamento Semestral', date: '2024-04-25', type: 'Ordinária', participants: 15 },
  { id: 5, title: 'Comissão de Avaliação', date: '2024-04-28', type: 'Comissão', participants: 6 },
];

// Stats for the dashboard cards
const stats = [
  { title: 'Reuniões', value: 24, icon: <Calendar className="h-8 w-8 text-academic-primary" /> },
  { title: 'Professores', value: 32, icon: <Users className="h-8 w-8 text-academic-secondary" /> },
  { title: 'Declarações', value: 48, icon: <FileText className="h-8 w-8 text-academic-accent" /> },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };
  
  const handleViewMeeting = (id: number) => {
    navigate(`/meetings/${id}`);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-academic-primary dark:text-academic-secondary">Dashboard</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-academic-primary">
                <Plus className="h-4 w-4 mr-2" />
                Nova Reunião
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Nova Reunião</DialogTitle>
                <DialogDescription>
                  Preencha os dados para agendar uma nova reunião.
                </DialogDescription>
              </DialogHeader>
              <NewMeetingForm onComplete={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat, index) => (
            <Card key={index} className="card-academic">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className="rounded-full p-3 bg-gray-100 dark:bg-gray-800">
                  {stat.icon}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Meetings Tabs */}
        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="recent">Reuniões Recentes</TabsTrigger>
            <TabsTrigger value="upcoming">Próximas Reuniões</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentMeetings.map((meeting) => (
                <Card key={meeting.id} className="card-academic hover:border-academic-primary">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">{meeting.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Data:</span>
                        <span>{formatDate(meeting.date)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Tipo:</span>
                        <span>{meeting.type}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Participantes:</span>
                        <span>{meeting.participants}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full mt-2 border-academic-primary text-academic-primary"
                        onClick={() => handleViewMeeting(meeting.id)}
                      >
                        Ver Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="upcoming">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingMeetings.map((meeting) => (
                <Card key={meeting.id} className="card-academic hover:border-academic-secondary">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">{meeting.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Data:</span>
                        <span>{formatDate(meeting.date)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Tipo:</span>
                        <span>{meeting.type}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Participantes:</span>
                        <span>{meeting.participants}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full mt-2 border-academic-secondary text-academic-secondary"
                        onClick={() => handleViewMeeting(meeting.id)}
                      >
                        Ver Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
