import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AdminNewsManager } from './AdminNewsManager';
import { AdminJobsManager } from './AdminJobsManager';

export function AdminNewsPage() {
  const [activeTab, setActiveTab] = useState('news');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="mb-3">Administración de Contenido</h1>
          <p>Gestiona noticias y ofertas laborales del portal</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="news">Noticias</TabsTrigger>
            <TabsTrigger value="jobs">Trabajos</TabsTrigger>
          </TabsList>

          <TabsContent value="news" className="mt-6">
            <AdminNewsManager />
          </TabsContent>

          <TabsContent value="jobs" className="mt-6">
            <AdminJobsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
