import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Shield, FileText, LogOut, ArrowLeft } from 'lucide-react';

// 1. DEFINIR QUE O COMPONENTE RECEBE A FUNÇÃO 'onBack'
interface PerfilProps {
  onBack: () => void;
}

// 2. PASSAR O 'onBack' PARA DENTRO DA FUNÇÃO
export default function PerfilSenhorio({ onBack }: PerfilProps) {
  const navigate = useNavigate();

  // Dados adaptados para o Senhorio
  const user = {
    nome: 'João Silva',
    email: 'joao.silva@arrendai.com',
    telefone: '+351 912 345 678',
    tipo: 'Senhorio Pro',
    membroDesde: 'Janeiro 2024',
    documentos: [
      { nome: 'Cartão de Cidadão', estado: 'Verificado', cor: 'text-green-600 bg-green-50' },
      { nome: 'Registo Predial', estado: 'Verificado', cor: 'text-green-600 bg-green-50' },
      { nome: 'Certificado Energético', estado: 'Pendente', cor: 'text-amber-600 bg-amber-50' },
    ]
  };

  const terminarSessao = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-16 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 mb-8 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={onBack} // <-- AQUI USAMOS A FUNÇÃO PARA VOLTAR SEM RECARREGAR A PÁGINA
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-sky-600 transition-colors bg-slate-50 px-4 py-2 rounded-lg"
          >
            <ArrowLeft size={16} /> Voltar ao Painel
          </button>
          <h1 className="font-bold text-slate-800">Definições de Conta</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* COLUNA ESQUERDA: AVATAR E AÇÕES */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm text-center">
              <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center text-sky-700 font-bold text-3xl mx-auto mb-4 border-4 border-white shadow-sm">
                JS
              </div>
              <h2 className="text-xl font-bold text-slate-900">{user.nome}</h2>
              <p className="text-sm font-bold text-sky-600 mb-4">{user.tipo}</p>
              <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold border border-green-100">
                <Shield size={12} /> Conta Verificada
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
              <button className="w-full flex items-center justify-between p-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                Editar Perfil
              </button>
              <button className="w-full flex items-center justify-between p-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                Alterar Password
              </button>
              <button className="w-full flex items-center justify-between p-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                Dados de Faturação
              </button>
              <div className="h-px bg-gray-100 my-2"></div>
              <button 
                onClick={terminarSessao}
                className="w-full flex items-center gap-2 p-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={16} /> Terminar Sessão
              </button>
            </div>
          </div>

          {/* COLUNA DIREITA: INFORMAÇÕES E DOCUMENTOS */}
          <div className="md:col-span-2 space-y-8">
            
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Informação Pessoal</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Nome Completo</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <User size={18} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-900">{user.nome}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Email</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <Mail size={18} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-900">{user.email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Telefone</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <Phone size={18} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-900">{user.telefone}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">Meus Documentos</h3>
                <button className="text-sm font-medium text-sky-600 hover:text-sky-700 bg-sky-50 px-3 py-1.5 rounded-lg">Adicionar Novo</button>
              </div>
              
              <div className="space-y-3">
                {user.documentos.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-400 border border-slate-200 shadow-sm">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{doc.nome}</p>
                        <p className="text-xs text-slate-500">Submetido a 12 Mar 2024</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${doc.cor}`}>
                      {doc.estado}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-500 leading-relaxed bg-sky-50 text-sky-700 p-3 rounded-lg border border-sky-100">
                Estes documentos são utilizados pela equipa do ArrendAI para validar a sua identidade e os imóveis que regista. Anúncios com documentação verificada têm mais visibilidade na plataforma.
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}