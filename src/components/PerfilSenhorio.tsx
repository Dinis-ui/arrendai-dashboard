import { User, Mail, Phone, Shield, FileText, LogOut, ArrowLeft } from 'lucide-react';

interface PerfilProps {
  onBack: () => void;
}

export default function PerfilSenhorio({ onBack }: PerfilProps) {
  // Dados adaptados para o Senhorio
  const user = {
    nome: 'João Silva',
    email: 'joao.silva@arrendai.com',
    telefone: '+351 912 345 678',
    tipo: 'Senhorio Pro',
    membroDesde: 'Janeiro 2024',
    documentos: [
      { nome: 'Cartão de Cidadão', estado: 'Verificado', cor: 'text-green-600 bg-green-50' },
      { nome: 'Registo Predial (Apt. Lisboa)', estado: 'Verificado', cor: 'text-green-600 bg-green-50' },
    ]
  };

  const terminarSessao = () => {
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Botão Voltar */}
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-sky-600 transition-colors"
        >
          <ArrowLeft size={18} /> Voltar ao Painel
        </button>
      </div>

      <main className="max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* COLUNA ESQUERDA: AVATAR E ACOES */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm text-center">
              <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center text-sky-700 font-bold text-3xl mx-auto mb-4 border-4 border-white shadow-sm">
                JS
              </div>
              <h2 className="text-xl font-bold text-slate-900">{user.nome}</h2>
              <p className="text-sm text-sky-600 font-bold mb-4">{user.tipo}</p>
              <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                <Shield size={12} /> Identidade Verificada
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
              <button className="w-full text-left p-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                Editar Perfil
              </button>
              <button className="w-full text-left p-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                Definições de Faturação
              </button>
              <div className="h-px bg-gray-100 my-2"></div>
              <button 
                onClick={terminarSessao}
                className="w-full flex items-center gap-2 p-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={16} /> Terminar Sessão
              </button>
            </div>
          </div>

          {/* COLUNA DIREITA: INFORMACOES */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Informação da Conta</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Nome Completo</label>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-medium text-slate-700">
                    {user.nome}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Email Profissional</label>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-medium text-slate-700">
                    {user.email}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Telefone de Contacto</label>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-medium text-slate-700">
                    {user.telefone}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Documentação de Verificação</h3>
              <div className="space-y-3">
                {user.documentos.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-slate-50 rounded-xl bg-slate-50/30">
                    <div className="flex items-center gap-3">
                      <FileText className="text-slate-400" size={20} />
                      <span className="font-bold text-slate-700 text-sm">{doc.nome}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${doc.cor}`}>
                      {doc.estado}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}