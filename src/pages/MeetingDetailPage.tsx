
import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import RequireAuth from '@/components/RequireAuth';

const MeetingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isCoordinator } = useAuth();
  const [meeting, setMeeting] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [minutes, setMinutes] = useState<string>('');
  const [decisions, setDecisions] = useState<string>('');
  const [editingMinutes, setEditingMinutes] = useState(false);
  const [editingDecisions, setEditingDecisions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchMeetingDetails();
    }
  }, [id]);

  const fetchMeetingDetails = async () => {
    try {
      setIsLoading(true);
      
      // Fetch meeting details
      const { data: meetingData, error: meetingError } = await supabase
        .from('meetings')
        .select('*')
        .eq('id', id)
        .single();

      if (meetingError) throw meetingError;
      setMeeting(meetingData);
      setDecisions(meetingData.deliberations || '');
      
      // Fetch meeting participants
      const { data: participantsData, error: participantsError } = await supabase
        .from('meeting_participants')
        .select(`
          id,
          attendance_status,
          professors (
            id,
            full_name
          )
        `)
        .eq('meeting_id', id);

      if (participantsError) throw participantsError;
      setParticipants(participantsData);
      
      // Fetch meeting attachments
      const { data: attachmentsData, error: attachmentsError } = await supabase
        .from('meeting_attachments')
        .select('*')
        .eq('meeting_id', id);

      if (attachmentsError) throw attachmentsError;
      setAttachments(attachmentsData);
      
      // Fetch meeting minutes
      const { data: minutesData, error: minutesError } = await supabase
        .from('meeting_minutes')
        .select('content')
        .eq('meeting_id', id)
        .maybeSingle();

      if (minutesError) throw minutesError;
      setMinutes(minutesData?.content || '');
      
    } catch (error: any) {
      console.error('Erro ao carregar detalhes da reunião:', error);
      toast.error(`Erro ao carregar dados: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const handleSaveMinutes = async () => {
    if (!user) return;
    
    try {
      // Check if minutes already exist
      const { data, error: checkError } = await supabase
        .from('meeting_minutes')
        .select('id')
        .eq('meeting_id', id)
        .maybeSingle();

      if (checkError) throw checkError;

      let result;
      
      if (data) {
        // Update existing minutes
        result = await supabase
          .from('meeting_minutes')
          .update({ 
            content: minutes,
            updated_at: new Date().toISOString()
          })
          .eq('meeting_id', id);
      } else {
        // Insert new minutes
        result = await supabase
          .from('meeting_minutes')
          .insert({
            meeting_id: id, 
            content: minutes,
            generated_by: user.id
          });
      }

      if (result.error) throw result.error;
      
      toast.success('Ata salva com sucesso');
      setEditingMinutes(false);
    } catch (error: any) {
      console.error('Erro ao salvar ata:', error);
      toast.error(`Erro ao salvar ata: ${error.message}`);
    }
  };

  const handleSaveDecisions = async () => {
    try {
      const { error } = await supabase
        .from('meetings')
        .update({ 
          deliberations: decisions,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Deliberações salvas com sucesso');
      setEditingDecisions(false);
    } catch (error: any) {
      console.error('Erro ao salvar deliberações:', error);
      toast.error(`Erro ao salvar deliberações: ${error.message}`);
    }
  };

  const handleDownloadAttachment = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('meeting_files')
        .download(filePath);

      if (error) throw error;
      
      // Create a download link for the file
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      console.error('Erro ao baixar arquivo:', error);
      toast.error(`Erro ao baixar arquivo: ${error.message}`);
    }
  };

  const handleGeneratePDF = () => {
    toast.success('Gerando PDF da ata...');
    // This would be implemented with a PDF generation library or server-side
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-academic-primary mx-auto"></div>
            <p className="mt-4 text-gray-500">Carregando dados da reunião...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!meeting) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
          <h2 className="text-2xl font-bold mb-4">Reunião não encontrada</h2>
          <p className="text-gray-500 mb-6">A reunião solicitada não existe ou você não tem permissão para acessá-la.</p>
          <Button onClick={() => navigate('/dashboard')}>Voltar para o Dashboard</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <RequireAuth>
      <AppLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-academic-primary dark:text-academic-secondary">
                  {meeting.title}
                </h1>
                <Badge variant="outline" className={`ml-2 
                  ${meeting.status === 'realizada' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 
                  meeting.status === 'agendada' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' : 
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'}`
                }>
                  {meeting.status === 'realizada' ? 'Concluída' : 
                   meeting.status === 'agendada' ? 'Agendada' : 'Cancelada'}
                </Badge>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                Reunião #{meeting.id.substring(0, 8)} • {
                  meeting.meeting_type === 'ordinaria' ? 'Ordinária' :
                  meeting.meeting_type === 'extraordinaria' ? 'Extraordinária' :
                  meeting.meeting_type === 'colegiado' ? 'Colegiado' :
                  meeting.meeting_type === 'comissao' ? 'Comissão' : 'Outros'
                }
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
                      <p className="text-gray-600 dark:text-gray-400">{formatDate(meeting.meeting_date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-academic-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Horário</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {new Date(meeting.meeting_date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-academic-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Local</p>
                      <p className="text-gray-600 dark:text-gray-400">{meeting.location || 'Não especificado'}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <p className="font-medium mb-2">Pauta</p>
                    <div className="text-gray-600 dark:text-gray-400 whitespace-pre-line text-sm">
                      {meeting.agenda || 'Sem pauta registrada'}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <p className="font-medium mb-2">Anexos</p>
                    {attachments.length > 0 ? (
                      <div className="space-y-2">
                        {attachments.map(attachment => (
                          <div key={attachment.id} className="flex items-center justify-between text-sm p-2 rounded-md border">
                            <span>{attachment.filename}</span>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0" 
                                aria-label="Download"
                                onClick={() => handleDownloadAttachment(attachment.file_path, attachment.filename)}
                              >
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
                      <span className="font-medium">
                        {participants.filter(p => p.attendance_status).length} presentes
                      </span>
                    </div>
                    <span className="text-gray-500 text-sm">{participants.length} total</span>
                  </div>
                  
                  <div className="space-y-3">
                    {participants.map(participant => (
                      <div key={participant.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>
                              {participant.professors.full_name.split(' ')
                                .map((n: string) => n[0])
                                .join('')
                                .substring(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span>{participant.professors.full_name}</span>
                        </div>
                        <Badge 
                          variant={participant.attendance_status ? "default" : "outline"} 
                          className={participant.attendance_status ? "bg-green-500" : ""}
                        >
                          {participant.attendance_status ? 'Presente' : 'Ausente'}
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
                      {isCoordinator && (
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
                      )}
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
                          {minutes || 'Ata ainda não redigida'}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="decisions">
                  <Card className="card-academic">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-xl">Deliberações</CardTitle>
                      {isCoordinator && (
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
                      )}
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
                          {decisions || 'Não há deliberações registradas'}
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
    </RequireAuth>
  );
};

export default MeetingDetailPage;
