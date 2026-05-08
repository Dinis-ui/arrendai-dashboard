import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Shield, FileText, LogOut, ArrowLeft } from 'lucide-react';

export default function Perfil() {
  const navigate = useNavigate();

  
  const user = {
    nome: 'Maria Ferreira',
    email: 'maria.ferreira@email.com',
    telefone: '+351 912 345 678',
    tipo: 'Inquilina',
    membroDesde: 'Janeiro 2024',
    documentos: [
      { nome: 'Cartao de Cidadao', estado: 'Verificado', cor: 'text-green-600 bg-green-50' },
      { nome: 'Recibos de Vencimento', estado: 'Pendente', cor: 'text-amber-600 bg-amber-50' },
    ]
  };

  const terminarSessao = () => {
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
   
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-16">
      
      
      <header className="bg-white border-b border-gray-200 px-8 py-4 mb-8 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/portal')}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-sky-500 transition-colors"
          >
            <ArrowLeft size={16} /> Voltar ao Portal
          </button>
          <h1 className="font-bold text-slate-800">Definicoes de Conta</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
        
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm text-center">
              <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center text-sky-700 font-bold text-3xl mx-auto mb-4">
                {user.nome.substring(0, 2).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-slate-900">{user.nome}</h2>
              <p className="text-sm text-slate-500 mb-4">{user.tipo}</p>
              <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold">
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
              <div className="h-px bg-gray-100 my-2"></div>
              <button 
                onClick={terminarSessao}
                className="w-full flex items-center gap-2 p-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={16} /> Terminar Sessao
              </button>
            </div>
          </div>

          
          <div className="md:col-span-2 space-y-8">
            
            
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Informacao Pessoal</h3>
              
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
                <button className="text-sm font-medium text-sky-600 hover:text-sky-700">Adicionar Novo</button>
              </div>
              
              <div className="space-y-3">
                {user.documentos.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
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
              <p className="mt-4 text-xs text-slate-500 leading-relaxed">
                Estes documentos sao utilizados para validar a tua identidade junto dos senhorios. Mantem-nos atualizados para aumentar a probabilidade de as tuas candidaturas serem aceites.
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}