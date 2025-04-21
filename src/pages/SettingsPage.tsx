
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

const SettingsPage = () => {
  // Institution settings
  const [institution, setInstitution] = useState({
    name: 'Instituto Federal do Pará',
    abbreviation: 'IFPA',
    campus: 'Campus Belém',
    department: 'Departamento de Informática',
    logo: null as File | null,
  });

  // Certificate settings
  const [certificate, setCertificate] = useState({
    headerText: 'INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA DO PARÁ',
    footerText: 'Documento gerado pelo sistema Acta Academica',
    signature: 'Coordenador(a) do Curso',
    workloadPerMeeting: 2,
    showInstitutionLogo: true,
  });

  // Meeting settings
  const [meeting, setMeeting] = useState({
    defaultType: 'ordinaria',
    defaultDuration: 120, // minutes
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setInstitution({
        ...institution,
        logo: e.target.files[0],
      });
    }
  };

  const handleInstitutionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInstitution({
      ...institution,
      [name]: value,
    });
  };

  const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCertificate({
      ...certificate,
      [name]: value,
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setCertificate({
      ...certificate,
      showInstitutionLogo: checked,
    });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setCertificate({
        ...certificate,
        [name]: numValue,
      });
    }
  };

  const handleSaveSettings = (tab: string) => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Configurações salvas com sucesso!');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-academic-primary dark:text-academic-secondary">Configurações</h1>

        <Tabs defaultValue="institution">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="institution">Instituição</TabsTrigger>
            <TabsTrigger value="certificates">Declarações</TabsTrigger>
            <TabsTrigger value="meetings">Reuniões</TabsTrigger>
          </TabsList>

          <TabsContent value="institution">
            <Card>
              <CardHeader>
                <CardTitle>Dados da Instituição</CardTitle>
                <CardDescription>
                  Configure as informações da instituição que serão exibidas em documentos e relatórios.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Instituição</Label>
                  <Input
                    id="name"
                    name="name"
                    value={institution.name}
                    onChange={handleInstitutionChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="abbreviation">Sigla</Label>
                  <Input
                    id="abbreviation"
                    name="abbreviation"
                    value={institution.abbreviation}
                    onChange={handleInstitutionChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="campus">Campus</Label>
                  <Input
                    id="campus"
                    name="campus"
                    value={institution.campus}
                    onChange={handleInstitutionChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento/Curso</Label>
                  <Input
                    id="department"
                    name="department"
                    value={institution.department}
                    onChange={handleInstitutionChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Logo da Instituição</Label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Arraste o logo aqui ou clique para selecionar
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      id="logo-upload"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="logo-upload">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="mt-2"
                      >
                        Selecionar Logo
                      </Button>
                    </label>
                    {institution.logo && (
                      <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                        Logo selecionado: {institution.logo.name}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button 
                    onClick={() => handleSaveSettings('institution')}
                    className="bg-academic-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Salvando...' : 'Salvar Configurações'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificates">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Declarações</CardTitle>
                <CardDescription>
                  Personalize o formato e conteúdo das declarações de participação.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="headerText">Texto do Cabeçalho</Label>
                  <Textarea
                    id="headerText"
                    name="headerText"
                    value={certificate.headerText}
                    onChange={handleCertificateChange}
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="footerText">Texto do Rodapé</Label>
                  <Input
                    id="footerText"
                    name="footerText"
                    value={certificate.footerText}
                    onChange={handleCertificateChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signature">Nome do Assinante</Label>
                  <Input
                    id="signature"
                    name="signature"
                    value={certificate.signature}
                    onChange={handleCertificateChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="workloadPerMeeting">Carga Horária por Reunião (horas)</Label>
                  <Input
                    id="workloadPerMeeting"
                    name="workloadPerMeeting"
                    type="number"
                    min="1"
                    max="8"
                    value={certificate.workloadPerMeeting}
                    onChange={handleNumberChange}
                  />
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="show-logo"
                    checked={certificate.showInstitutionLogo}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="show-logo">Exibir logo da instituição</Label>
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button 
                    onClick={() => handleSaveSettings('certificates')}
                    className="bg-academic-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Salvando...' : 'Salvar Configurações'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meetings">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Reuniões</CardTitle>
                <CardDescription>
                  Defina as configurações padrão para novas reuniões.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultType">Tipo de Reunião Padrão</Label>
                  <Select 
                    value={meeting.defaultType} 
                    onValueChange={(value) => setMeeting({...meeting, defaultType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo padrão" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ordinaria">Ordinária</SelectItem>
                      <SelectItem value="extraordinaria">Extraordinária</SelectItem>
                      <SelectItem value="colegiado">Colegiado</SelectItem>
                      <SelectItem value="comissao">Comissão</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="defaultDuration">Duração Padrão (minutos)</Label>
                  <Input
                    id="defaultDuration"
                    type="number"
                    min="30"
                    step="30"
                    value={meeting.defaultDuration}
                    onChange={(e) => setMeeting({...meeting, defaultDuration: parseInt(e.target.value) || 120})}
                  />
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button 
                    onClick={() => handleSaveSettings('meetings')}
                    className="bg-academic-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Salvando...' : 'Salvar Configurações'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
