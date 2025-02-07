import React, { useState, useEffect } from 'react';
import { FileText, LogOut, Upload, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CoordinatorDashboardProps {
  onLogout: () => void;
}

interface File {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
  created_at: string;
}

function CoordinatorDashboard({ onLogout }: CoordinatorDashboardProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar arquivos:', error);
      return;
    }

    setFiles(data || []);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    try {
      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = await supabase.storage
        .from('files')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase.from('files').insert([
        {
          name: file.name,
          type: file.type,
          size: file.size,
          url: urlData.publicUrl,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        },
      ]);

      if (dbError) {
        throw dbError;
      }

      fetchFiles();
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error);
      alert('Erro ao enviar arquivo!');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (id: string) => {
    try {
      const { error } = await supabase.from('files').delete().eq('id', id);
      if (error) throw error;
      setFiles(files.filter((file) => file.id !== id));
    } catch (error) {
      console.error('Erro ao excluir arquivo:', error);
      alert('Erro ao excluir arquivo!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <FileText className="w-6 h-6 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                Painel do Coordenador
              </span>
            </div>
            <button
              onClick={onLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Gerenciar Arquivos</h2>
            <label className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Enviar Novo Arquivo
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {files.map((file) => (
                <li key={file.id}>
                  <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          {file.name}
                        </a>
                      </div>
                      <div className="flex items-center">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {(parseInt(file.size) / 1024 / 1024).toFixed(2)} MB
                        </span>
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className="ml-4 text-red-600 hover:text-red-800"
                          title="Excluir arquivo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CoordinatorDashboard;