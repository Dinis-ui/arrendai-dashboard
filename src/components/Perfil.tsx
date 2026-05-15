import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Shield, FileText, LogOut, ArrowLeft, X, Upload } from 'lucide-react';

export default function Perfil() {
  const navigate = useNavigate();

  
  // ESTADOS DOS MODAIS
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isDocOpen, setIsDocOpen] = useState(false);


  // DADOS DO UTILIZADOR
  const user = {
    nome: 'Maria Ferreira',
    email: 'maria.ferreira@email.com',
    telefone: '+351 912 345 678',
    tipo: 'Inquilina',
    membroDesde: 'Janeiro 2024',
    documentos: [
      { nome: 'Cartão de Cidadão', estado: 'Verificado', cor: 'text-green-600 bg-green-50 border-green-100' },
      { nome: 'Recibos de Vencimento', estado: 'Pendente', cor: 'text-amber-600 bg-amber-50 border-amber-100' },
    ]
  };

  const terminarSessao = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-16 animate-in fade-in duration-500 relative">
      
      <header className="bg-white border-b border-gray-200 px-8 py-6 mb-8 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/portal')}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-sky-600 transition-colors bg-slate-50 px-4 py-2 rounded-xl"
          >
            <ArrowLeft size={18} /> Voltar ao Portal
          </button>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-slate-800 tracking-tight">Definições de Conta</h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* AVATAR E AÇÕES */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm text-center">
              <div className="w-28 h-28 bg-sky-100 rounded-full flex items-center justify-center text-sky-700 font-bold text-4xl mx-auto mb-6 border-4 border-white shadow-md">
                MA
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{user.nome}</h2>
              <p className="text-slate-500 font-medium text-sm mb-6">{user.tipo}</p>
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold border border-emerald-100">
                <Shield size={14} /> Conta Verificada
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 p-4 shadow-sm">
              <button 
                onClick={() => setIsEditOpen(true)} // Abre Modal Editar
                className="w-full text-left p-4 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors"
              >
                Editar Perfil
              </button>
              <button 
                onClick={() => setIsPasswordOpen(true)} // Abre Modal Password
                className="w-full text-left p-4 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors"
              >
                Alterar Password
              </button>
              <div className="h-px bg-gray-100 my-2 mx-4"></div>
              <button 
                onClick={terminarSessao}
                className="w-full flex items-center gap-3 p-4 text-sm font-bold text-red-600 hover:bg-red-50 rounded-2xl transition-colors"
              >
                <LogOut size={18} /> Terminar Sessão
              </button>
            </div>
          </div>

          {/* INFORMAÇÃO PESSOAL */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl border border-gray-200 p-10 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                <User size={20} className="text-sky-500" /> Informação Pessoal
              </h3>
              
              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nome Completo</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <User size={18} className="text-slate-400" />
                    <span className="text-sm font-bold text-slate-800">{user.nome}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Email</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <Mail size={18} className="text-slate-400" />
                    <span className="text-sm font-bold text-slate-800">{user.email}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Telefone</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <Phone size={18} className="text-slate-400" />
                    <span className="text-sm font-bold text-slate-800">{user.telefone}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 p-10 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FileText size={20} className="text-sky-500" /> Meus Documentos
                </h3>
                <button 
                  onClick={() => setIsDocOpen(true)} // Abre Modal Adicionar Documento
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-4 py-2.5 rounded-full transition-colors"
                >
                  Adicionar Novo
                </button>
              </div>
              
              <div className="space-y-4">
                {user.documentos.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-5 border border-slate-100 rounded-2xl hover:border-slate-200 transition-colors bg-slate-50/50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{doc.nome}</p>
                        <p className="text-xs text-slate-500 mt-1">Submetido a 12 Mar 2024</p>
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${doc.cor}`}>
                      {doc.estado}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-xs text-slate-500 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                Estes documentos são utilizados para validar a tua identidade junto dos senhorios. Mantém-nos atualizados para aumentar a probabilidade de as tuas candidaturas serem aceites.
              </p>
            </div>

          </div>
        </div>
      </main>

      
      {/* EDITAR PERFIL */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">Editar Perfil</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Nome Completo</label>
                <input type="text" defaultValue={user.nome} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-sky-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Telefone</label>
                <input type="text" defaultValue={user.telefone} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-sky-500 outline-none" />
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button onClick={() => setIsEditOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancelar</button>
              {/* BACKEND: Enviar PUT para atualizar dados do user */}
              <button onClick={() => setIsEditOpen(false)} className="px-5 py-2.5 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors">Guardar Alterações</button>
            </div>
          </div>
        </div>
      )}

      
      {/* ALTERAR PASSWORD */}
      {isPasswordOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">Alterar Password</h3>
              <button onClick={() => setIsPasswordOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Password Atual</label>
                <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-sky-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Nova Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-sky-500 outline-none" />
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button onClick={() => setIsPasswordOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancelar</button>
              {/* BACKEND: Enviar POST para endpoint de change-password */}
              <button onClick={() => setIsPasswordOpen(false)} className="px-5 py-2.5 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors">Atualizar Password</button>
            </div>
          </div>
        </div>
      )}

    
      {/* ADICIONAR DOCUMENTO */}
      {isDocOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">Adicionar Documento</h3>
              <button onClick={() => setIsDocOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Tipo de Documento</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-sky-500 outline-none">
                  <option>IRS (Último ano)</option>
                  <option>Contrato de Trabalho</option>
                  <option>Fiador - Identificação</option>
                  <option>Outro</option>
                </select>
              </div>
              
              <div className="border-2 border-dashed border-sky-200 bg-sky-50 rounded-2xl p-8 text-center hover:bg-sky-100 transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 text-sky-500 group-hover:scale-110 transition-transform shadow-sm">
                  <Upload size={20} />
                </div>
                <p className="text-sm font-bold text-sky-700 mb-1">Clica para fazer upload</p>
                <p className="text-xs text-sky-600/70">PDF, JPG ou PNG (Máx 5MB)</p>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button onClick={() => setIsDocOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancelar</button>
              {/* BACKEND: Enviar multipart/form-data com o ficheiro anexado */}
              <button onClick={() => setIsDocOpen(false)} className="px-5 py-2.5 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors">Submeter</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}