import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Shield, FileText, LogOut, ArrowLeft, X, Upload, CreditCard } from 'lucide-react';

interface PerfilProps {
  onBack: () => void;
}

export default function PerfilSenhorio({ onBack }: PerfilProps) {
  const navigate = useNavigate();

  // ESTADOS DOS MODAIS
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [isDocOpen, setIsDocOpen] = useState(false);

  // ESTADO DO UTILIZADOR REAL (Vindo da API)
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ESTADOS PARA O FORMULÁRIO DE EDIÇÃO
  const [editUsername, setEditUsername] = useState('');
  const [editTelefone, setEditTelefone] = useState('');

  // DADOS DE TESTE PARA DESIGN
  const telefoneTemporario = '+351 912 345 678';
  const documentosTeste = [
    { nome: 'Cartão de Cidadão', estado: 'Verificado', cor: 'text-green-600 bg-green-50 border-green-100' },
    { nome: 'Registo Predial', estado: 'Verificado', cor: 'text-green-600 bg-green-50 border-green-100' },
    { nome: 'Certificado Energético', estado: 'Pendente', cor: 'text-amber-600 bg-amber-50 border-amber-100' },
  ];

  // LÓGICA PARA CARREGAR OS DADOS DO BACKEND
  useEffect(() => {
    const carregarPerfil = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const res = await fetch('http://127.0.0.1:8000/api/users/me/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const dados = await res.json();
          setUser(dados);
        } else {
          terminarSessao();
        }
      } catch (e) {
        console.error("Erro ao carregar perfil:", e);
      } finally {
        setLoading(false);
      }
    };
    carregarPerfil();
  }, [navigate]);

  // FUNÇÃO PARA ATUALIZAR O PERFIL NO DJANGO
  const atualizarPerfil = async () => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    
    const dadosAtualizados = {
        username: editUsername,
        // O telefone não vai para o backend porque o teu Django não tem esse campo, 
        // mas o nome de utilizador já vai!
    };

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/users/${user.id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dadosAtualizados)
        });

        if (response.ok) {
            const dadosNovos = await response.json();
            alert('Perfil atualizado com sucesso!');
            setUser(dadosNovos); // Atualiza o ecrã instantaneamente
            setIsEditOpen(false); // Fecha o modal
        } else {
            const erro = await response.json();
            console.error('Erro ao atualizar:', erro);
            alert('Erro ao atualizar o perfil. Verifica a consola.');
        }
    } catch (error) {
        console.error('Erro de rede:', error);
    }
  };

  const terminarSessao = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">A carregar o teu perfil...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-16 animate-in fade-in duration-500 relative">
      
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-8 py-6 mb-8 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-sky-600 transition-colors bg-slate-50 px-4 py-2 rounded-xl"
          >
            <ArrowLeft size={18} /> Voltar ao Dashboard
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
              <div className="w-28 h-28 bg-sky-100 rounded-full flex items-center justify-center text-sky-700 font-bold text-4xl mx-auto mb-6 border-4 border-white shadow-md uppercase">
                {user?.username ? user?.username.charAt(0) : '?'}
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{user?.username}</h2>
              <p className="text-slate-500 font-medium text-sm mb-6">Senhorio</p>
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold border border-emerald-100">
                <Shield size={14} /> Proprietário Verificado
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 p-4 shadow-sm">
              <button 
                onClick={() => {
                  setEditUsername(user?.username || '');
                  setEditTelefone(telefoneTemporario);
                  setIsEditOpen(true);
                }}
                className="w-full text-left p-4 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors"
              >
                Editar Perfil
              </button>
              <button 
                onClick={() => setIsPasswordOpen(true)}
                className="w-full text-left p-4 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors"
              >
                Alterar Password
              </button>
              <button 
                onClick={() => setIsBillingOpen(true)} 
                className="w-full text-left p-4 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors"
              >
                Dados de Faturação
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

          {/* INFORMAÇÕES E DOCUMENTOS */}
          <div className="md:col-span-2 space-y-8">
            
            <div className="bg-white rounded-3xl border border-gray-200 p-10 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                <User size={20} className="text-sky-500" /> Informação Pessoal
              </h3>
              
              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nome de Utilizador</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <User size={18} className="text-slate-400" />
                    <span className="text-sm font-bold text-slate-800">{user?.username}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Email Profissional</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <Mail size={18} className="text-slate-400" />
                    <span className="text-sm font-bold text-slate-800">{user?.email || 'Sem email registado'}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Telefone de Contacto</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <Phone size={18} className="text-slate-400" />
                    <span className="text-sm font-bold text-slate-800">{telefoneTemporario}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 p-10 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FileText size={20} className="text-sky-500" /> Documentação Legal
                </h3>
                <button 
                  onClick={() => setIsDocOpen(true)}
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-4 py-2.5 rounded-full transition-colors"
                >
                  Adicionar Novo
                </button>
              </div>
              
              <div className="space-y-4">
                {documentosTeste.map((doc, index) => (
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
              <p className="mt-6 text-xs text-slate-500 leading-relaxed bg-sky-50 text-sky-700 p-4 rounded-xl border border-sky-100">
                Estes documentos são utilizados pela equipa do ArrendAI para validar a sua identidade e os imóveis que regista. Anúncios com documentação verificada têm mais visibilidade na plataforma.
              </p>
            </div>

          </div>
        </div>
      </main>

      
      {/* MODAL EDITAR PERFIL */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">Editar Perfil</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Nome de Utilizador</label>
                <input 
                  type="text" 
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-sky-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Telefone de Contacto</label>
                <input 
                  type="text" 
                  value={editTelefone}
                  onChange={(e) => setEditTelefone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-sky-500 outline-none" 
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button onClick={() => setIsEditOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancelar</button>
              <button onClick={atualizarPerfil} className="px-5 py-2.5 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors">Guardar Alterações</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ALTERAR PASSWORD */}
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
              <button onClick={() => setIsPasswordOpen(false)} className="px-5 py-2.5 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors">Atualizar Password</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DADOS DE FATURAÇÃO */}
      {isBillingOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><CreditCard size={20} className="text-sky-500" /> Dados de Faturação</h3>
              <button onClick={() => setIsBillingOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">NIF (Número de Identificação Fiscal)</label>
                <input type="text" defaultValue={user?.nif || ''} placeholder="Ex: 212 345 678" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-sky-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">IBAN (Para receber rendas)</label>
                <input type="text" placeholder="PT50 ..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-sky-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Morada Fiscal</label>
                <input type="text" placeholder="Morada completa" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-sky-500 outline-none" />
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button onClick={() => setIsBillingOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancelar</button>
              <button onClick={() => setIsBillingOpen(false)} className="px-5 py-2.5 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors">Guardar Dados</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ADICIONAR DOCUMENTO */}
      {isDocOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">Adicionar Documento Legal</h3>
              <button onClick={() => setIsDocOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Tipo de Documento</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-sky-500 outline-none">
                  <option>Registo Predial (Certidão Permanente)</option>
                  <option>Caderneta Predial Urbana</option>
                  <option>Certificado Energético</option>
                  <option>Outro</option>
                </select>
              </div>
              
              <div className="border-2 border-dashed border-sky-200 bg-sky-50 rounded-2xl p-8 text-center hover:bg-sky-100 transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 text-sky-500 group-hover:scale-110 transition-transform shadow-sm">
                  <Upload size={20} />
                </div>
                <p className="text-sm font-bold text-sky-700 mb-1">Clica para fazer upload</p>
                <p className="text-xs text-sky-600/70">PDF, JPG ou PNG (Máx 10MB)</p>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button onClick={() => setIsDocOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancelar</button>
              <button onClick={() => setIsDocOpen(false)} className="px-5 py-2.5 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors">Submeter Verificação</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}