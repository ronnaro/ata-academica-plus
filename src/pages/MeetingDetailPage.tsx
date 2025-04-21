
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Calendar, Clock, MapPin, Users, FileText, Download, Edit, Save } from 'lucide-react';

// Mock data for a meeting
const mockMeeting = {
  id: 1,
  title: 'Reunião Ordinária do Colegiado',
  date: '2024-04-15',
  time: '14:00',
  location: 'Sala de Reuniões do Campus Belém',
  type: 'Ordinária',
  status: 'Concluída',
  participants: [
    { id: 1, name: 'Ana Silva', present: true },
    { id: 2, name: 'Carlos Oliveira', present: true },
    { id: 3, name: 'Mariana Santos', present: false },
    { id: 4, name: 'Ricardo Lima', present: true },
    { id: 5, name: 'Juliana Costa', present: true },
  ],
  agenda: `1. Aprovação da ata da reunião anterior
2. Análise dos processos de alunos
3. Planejamento para o próximo semestre
4. Informes gerais`,
  minutes: `Aos quinze dias do mês de abril de dois mil e vinte e quatro, às quatorze horas, na sala de reuniões do Campus Belém do Instituto Federal do Pará, reuniram-se os membros do Colegiado do Curso de Informática para a reunião ordinária conforme convocação.

Estiveram presentes os professores: Ana Silva, Carlos Oliveira, Ricardo Lima e Juliana Costa. Ausente justificadamente: Mariana Santos.

A reunião foi presidida pela coordenadora Ana Silva, que iniciou agradecendo a presença de todos e apresentando a pauta do dia.

1. A ata da reunião anterior foi lida e aprovada por unanimidade.
2. Foram analisados 5 processos de alunos referentes a aproveitamento de estudos, sendo 4 deferidos e 1 indeferido por falta de documentação.
3. Foi discutido o planejamento para o próximo semestre, com atenção especial à distribuição de disciplinas.
4. Nos informes gerais, a coordenadora comunicou sobre os prazos do calendário acadêmico.

Nada mais havendo a tratar, a reunião foi encerrada às dezesseis horas, e eu, Carlos Oliveira, lavrei a presente ata.`,
  decisions: `1. Aprovação da ata da reunião anterior por unanimidade.
2. Deferimento de 4 processos de aproveitamento de estudos e indeferimento de 1 processo.
3. Definição preliminar de distribuição de disciplinas para o próximo semestre.`,
  attachments: [
    { id: 1, name: 'pauta_reuniao.pdf', size: '245 KB' },
    { id: 2, name: 'ata_anterior.pdf', size: '310 KB' },
  ],
};

const MeetingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meeting] = useState(mockMeeting);
  const [editingMinutes, setEditingMinutes] = useState(false);
  const [editingDecisions, setEditingDecisions] = useState(false);
  const [minutes, setMinutes] = useState(meeting.minutes);
  const [decisions, setDecisions] = useState(meeting.decisions);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const handleSaveMinutes = () => {
    // Simulate saving
    setTimeout(() => {
      toast.success('Ata salva com sucesso');
      setEditingMinutes(false);
    }, 500);
  };

  const handleSaveDecisions = () => {
    // Simulate saving
    setTimeout(() => {
      toast.success('Deliberações salvas com sucesso');
      setEditingDecisions(false);
    }, 500);
  };

  const handleGeneratePDF = () => {
    toast.success('Gerando PDF da ata...');
    // In a real app, this would generate and download a PDF
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-academic-primary dark:text-academic-secondary">
                {meeting.title}
              </h1>
              <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                {meeting.status}
              </Badge>
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Reunião #{meeting.id} • {meeting.type}
            </p>
          </div>
          
          <Button onClick={handleGeneratePDF} className="bg-academic-primary">
            <FileText className="h-4 w-4 mr-2" />
            Gerar PDF
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Meeting details */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="card-academic">
              <CardHeader>
                <CardTitle className="text-xl">Detalhes da Reunião</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-academic-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Data</p>
                    <p className="text-gray-600 dark:text-gray-400">{formatDate(meeting.date)}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-academic-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Horário</p>
                    <p className="text-gray-600 dark:text-gray-400">{meeting.time}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-academic-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Local</p>
                    <p className="text-gray-600 dark:text-gray-400">{meeting.location}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <p className="font-medium mb-2">Pauta</p>
                  <div className="text-gray-600 dark:text-gray-400 whitespace-pre-line text-sm">
                    {meeting.agenda}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <p className="font-medium mb-2">Anexos</p>
                  {meeting.attachments.length > 0 ? (
                    <div className="space-y-2">
                      {meeting.attachments.map(attachment => (
                        <div key={attachment.id} className="flex items-center justify-between text-sm p-2 rounded-md border">
                          <span>{attachment.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500">{attachment.size}</span>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Download">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Nenhum anexo disponível</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="card-academic">
              <CardHeader>
                <CardTitle className="text-xl">Participantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-academic-primary mr-2" />
                    <span className="font-medium">{meeting.participants.filter(p => p.present).length} presentes</span>
                  </div>
                  <span className="text-gray-500 text-sm">{meeting.participants.length} total</span>
                </div>
                
                <div className="space-y-3">
                  {meeting.participants.map(participant => (
                    <div key={participant.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>{participant.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span>{participant.name}</span>
                      </div>
                      <Badge variant={participant.present ? "default" : "outline"} className={participant.present ? "bg-green-500" : ""}>
                        {participant.present ? 'Presente' : 'Ausente'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Meeting minutes and decisions */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="minutes">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="minutes">Ata da Reunião</TabsTrigger>
                <TabsTrigger value="decisions">Deliberações</TabsTrigger>
              </TabsList>
              
              <TabsContent value="minutes">
                <Card className="card-academic">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xl">Ata</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        if (editingMinutes) {
                          handleSaveMinutes();
                        } else {
                          setEditingMinutes(true);
                        }
                      }}
                    >
                      {editingMinutes ? (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Salvar
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </>
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {editingMinutes ? (
                      <Textarea
                        value={minutes}
                        onChange={(e) => setMinutes(e.target.value)}
                        className="min-h-[400px] font-mono text-sm"
                      />
                    ) : (
                      <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                        {minutes}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="decisions">
                <Card className="card-academic">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xl">Deliberações</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        if (editingDecisions) {
                          handleSaveDecisions();
                        } else {
                          setEditingDecisions(true);
                        }
                      }}
                    >
                      {editingDecisions ? (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Salvar
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </>
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {editingDecisions ? (
                      <Textarea
                        value={decisions}
                        onChange={(e) => setDecisions(e.target.value)}
                        className="min-h-[300px] font-mono text-sm"
                      />
                    ) : (
                      <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                        {decisions}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default MeetingDetailPage;
