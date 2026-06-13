import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Shield, FileText, LogOut, ArrowLeft, X, Upload, CreditCard, Bell } from 'lucide-react';

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

  // ESTADOS PARA OS FORMULÁRIOS
  const [editUsername, setEditUsername] = useState('');
  const [editTelefone, setEditTelefone] = useState(''); 
  const [editNif, setEditNif] = useState('');
  const [editIban, setEditIban] = useState('');
  const [editMorada, setEditMorada] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // ESTADOS DE NOTIFICAÇÕES (REAIS)
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificacoes, setNotificacoes] = useState<any[]>([]);
  const naoLidas = notificacoes.filter(n => !n.lida).length;

  // DADOS ESTÁTICOS / TESTE
  const documentosTeste = [
    { nome: 'Cartão de Cidadão', estado: 'Verificado', cor: 'text-green-600 bg-green-50 border-green-100' },
    { nome: 'Registo Predial', estado: 'Verificado', cor: 'text-green-600 bg-green-50 border-green-100' },
    { nome: 'Certificado Energético', estado: 'Pendente', cor: 'text-amber-600 bg-amber-50 border-amber-100' },
  ];

  // CARREGAR PERFIL INICIAL
  useEffect(() => {
    const carregarPerfil = async () => {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      if (!token) { navigate('/login'); return; }
      try {
        const res = await fetch('http://127.0.0.1:8000/api/users/me/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const dados = await res.json();
          setUser(dados);
          setEditUsername(dados.username || '');
          setEditTelefone(dados.telefone || ''); 
          setEditNif(dados.nif || '');
          setEditIban(dados.iban || '');
          setEditMorada(dados.morada_fiscal || '');
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

  // CARREGAR NOTIFICAÇÕES DO SENHORIO
  const carregarNotificacoes = async () => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (!token) return;
    try {
      const res = await fetch('http://127.0.0.1:8000/api/users/notificacoes/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setNotificacoes(await res.json());
      }
    } catch (error) {
      console.error("Erro a carregar notificações:", error);
    }
  };

  useEffect(() => {
    carregarNotificacoes();
    // Atualiza automaticamente de 30 em 30 segundos
    const intervalo = setInterval(carregarNotificacoes, 30000);
    return () => clearInterval(intervalo);
  }, []);

  // MARCAR COMO LIDAS AO ABRIR O SINO
  const handleToggleNotificacoes = async () => {
    const newState = !showNotifications;
    setShowNotifications(newState);

    if (newState && naoLidas > 0) {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      try {
        await fetch('http://127.0.0.1:8000/api/users/notificacoes/lidas/', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })));
      } catch (error) {
        console.error("Erro a marcar notificações como lidas", error);
      }
    }
  };

  // ATUALIZAÇÃO SILENCIOSA (PATCH)
  const executarAtualizacao = async (dadosParaEnviar: object, fecharModal: () => void) => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/me/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dadosParaEnviar)
      });

      if (response.ok) {
        const dadosNovos = await response.json();
        setUser(dadosNovos); // Atualiza os dados instantaneamente na interface
        fecharModal();       // Fecha o modal
      } else {
        const erro = await response.json();
        console.error("Erro do servidor:", erro);
        alert('Erro ao guardar os dados no servidor. Verifica se os dados estão corretos.');
      }
    } catch (error) {
      console.error('Erro de rede:', error);
    }
  };

  // ATUALIZAR PERFIL COM TELEFONE E USERNAME
  const atualizarPerfil = async () => {
    await executarAtualizacao({ 
      username: editUsername, 
      telefone: editTelefone 
    }, () => setIsEditOpen(false));
  };

  const atualizarFaturacao = async () => {
    await executarAtualizacao(
      { nif: editNif, iban: editIban, morada_fiscal: editMorada }, 
      () => setIsBillingOpen(false)
    );
  };

  // MUDANÇA DE PASSWORD (DIRETO PARA LOGIN)
  const handleAlterarPassword = async () => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/change-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
      });

      if (response.ok) {
        localStorage.clear();
        sessionStorage.clear();
        navigate('/login');
      } else {
        const erro = await response.json();
        alert(erro.error || 'Erro: Password atual incorreta.');
      }
    } catch (error) {
      console.error('Erro ao mudar password:', error);
    }
  };

  const terminarSessao = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">A carregar...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-16 relative">
      
      {/* BARRA SUPERIOR NAV */}
      <header className="px-8 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-sky-600 transition-colors bg-white border border-slate-200 px-6 py-2.5 rounded-xl shadow-sm"
          >
            <ArrowLeft size={18} /> Voltar ao Dashboard
          </button>
          
          <div className="flex items-center gap-6">
            <h1 className="text-sm font-bold text-slate-800 uppercase tracking-widest hidden md:block">Definições de Conta</h1>
            
            {/* DROPDOWN DE NOTIFICAÇÕES */}
            <div className="relative">
              <button 
                onClick={handleToggleNotificacoes}
                className={`p-2 rounded-full relative transition-colors ${showNotifications ? 'bg-sky-50 text-sky-600' : 'bg-white border border-slate-200 text-gray-500 hover:bg-gray-50 shadow-sm'}`}
              >
                <Bell size={18} />
                {naoLidas > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800 text-sm">Notificações</h3>
                    {naoLidas > 0 && <span className="text-xs bg-sky-100 text-sky-600 font-bold px-2 py-1 rounded-full">{naoLidas} novas</span>}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notificacoes.length === 0 ? (
                      <div className="p-6 text-center text-slate-500 text-sm">
                        <Bell size={24} className="mx-auto text-slate-300 mb-2" />
                        Nenhuma notificação por agora.
                      </div>
                    ) : (
                      notificacoes.map(notif => (
                        <div key={notif.id} className={`p-4 border-b border-gray-50 transition-colors ${!notif.lida ? 'bg-sky-50/40' : 'hover:bg-slate-50'}`}>
                          <p className="font-bold text-sm text-slate-800 mb-1">{notif.titulo}</p>
                          <p className="text-xs text-slate-500 mb-2 leading-relaxed">{notif.mensagem}</p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {new Date(notif.criada_em).toLocaleDateString('pt-PT')} às {new Date(notif.criada_em).toLocaleTimeString('pt-PT', {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* COLUNA ESQUERDA: AVATAR E MENU */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-white rounded-[2rem] border border-slate-200 p-10 shadow-sm text-center">
              <div className="w-32 h-32 bg-sky-100 rounded-full flex items-center justify-center text-sky-700 font-bold text-5xl mx-auto mb-6 shadow-inner uppercase">
                {user?.username ? user?.username.charAt(0) : '?'}
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-1">{user?.username}</h2>
              <p className="text-slate-500 font-medium mb-6">Senhorio</p>
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-5 py-2 rounded-full text-xs font-bold border border-emerald-100">
                <Shield size={14} /> Proprietário Verificado
              </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 p-4 shadow-sm">
              <button 
                onClick={() => {
                  setEditUsername(user?.username || '');
                  setEditTelefone(user?.telefone || ''); // <-- Carrega no modal
                  setIsEditOpen(true);
                }} 
                className="w-full text-left p-4 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors"
              >
                Editar Perfil
              </button>
              
              <button 
                onClick={() => {
                  setOldPassword('');
                  setNewPassword('');
                  setIsPasswordOpen(true);
                }} 
                className="w-full text-left p-4 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors"
              >
                Alterar Password
              </button>

              <button 
                onClick={() => {
                  setEditNif(user?.nif || '');
                  setEditIban(user?.iban || '');
                  setEditMorada(user?.morada_fiscal || '');
                  setIsBillingOpen(true);
                }} 
                className="w-full text-left p-4 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors"
              >
                Dados de Faturação
              </button>
              
              <div className="h-px bg-slate-100 my-2 mx-4"></div>
              
              <button onClick={terminarSessao} className="w-full flex items-center gap-3 p-4 text-sm font-bold text-red-600 hover:bg-red-50 rounded-2xl transition-colors">
                <LogOut size={18} /> Terminar Sessão
              </button>
            </div>
          </div>

          {/* COLUNA DIREITA: INFO PESSOAL E DOCS */}
          <div className="md:col-span-8 space-y-8">
            
            {/* INFORMAÇÃO PESSOAL CARD */}
            <div className="bg-white rounded-[2rem] border border-slate-200 p-10 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 mb-10 flex items-center gap-3">
                <User size={24} className="text-sky-500" /> Informação Pessoal
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome de Utilizador</label>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
                    <User size={18} className="text-slate-400" />
                    <span className="font-bold text-slate-800">{user?.username}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Telefone de Contacto</label>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
                    <Phone size={18} className="text-slate-400" />
                    <span className="font-bold text-slate-800">{user?.telefone || '---'}</span> 
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Profissional</label>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
                    <Mail size={18} className="text-slate-400" />
                    <span className="font-bold text-slate-800 truncate">{user?.email}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NIF Associado</label>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
                    <CreditCard size={18} className="text-slate-400" />
                    <span className="font-bold text-slate-800">{user?.nif || '---'}</span>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">IBAN para Recebimentos</label>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
                    <CreditCard size={18} className="text-slate-400" />
                    <span className="font-bold text-slate-800">{user?.iban || '---'}</span>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Morada Fiscal Cadastrada</label>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-start gap-3">
                    <FileText size={18} className="text-slate-400 mt-1" />
                    <span className="font-bold text-slate-800 whitespace-pre-line">{user?.morada_fiscal || '---'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* DOCUMENTAÇÃO LEGAL CARD */}
            <div className="bg-white rounded-[2rem] border border-slate-200 p-10 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <FileText size={24} className="text-sky-500" /> Documentação Legal
                </h3>
                <button className="text-xs font-bold text-sky-600 bg-sky-50 px-5 py-2.5 rounded-full hover:bg-sky-100 transition-colors">Adicionar Novo</button>
              </div>
              
              <div className="space-y-4">
                {documentosTeste.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-6 border border-slate-100 rounded-[1.5rem] bg-slate-50/30">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                        <FileText size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{doc.nome}</p>
                        <p className="text-xs text-slate-400 mt-1">Submetido a 12 Mar 2024</p>
                      </div>
                    </div>
                    <span className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase border ${doc.cor}`}>
                      {doc.estado}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* --- MODAIS (LÓGICA FUNCIONAL) --- */}

      {/* 1. EDITAR PERFIL */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl">Editar Perfil</h3>
              <button onClick={() => setIsEditOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Nome de Utilizador</label>
                <input type="text" value={editUsername} onChange={e => setEditUsername(e.target.value)} className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-sky-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Telemóvel</label>
                <input type="text" value={editTelefone} onChange={e => setEditTelefone(e.target.value)} className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-sky-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setIsEditOpen(false)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl">Cancelar</button>
              <button onClick={atualizarPerfil} className="flex-1 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold shadow-lg shadow-sky-200 transition-colors">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. ALTERAR PASSWORD */}
      {isPasswordOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl">Alterar Password</h3>
              <button onClick={() => setIsPasswordOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
            </div>
            <div className="space-y-4">
              <input type="password" placeholder="Password Atual" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none" />
              <input type="password" placeholder="Nova Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none" />
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setIsPasswordOpen(false)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl">Cancelar</button>
              <button onClick={handleAlterarPassword} className="flex-1 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold shadow-lg shadow-sky-200 transition-colors">Atualizar Password</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. DADOS DE FATURAÇÃO */}
      {isBillingOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl">Dados de Faturação</h3>
              <button onClick={() => setIsBillingOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="NIF" value={editNif} onChange={e => setEditNif(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none" />
              <input type="text" placeholder="IBAN" value={editIban} onChange={e => setEditIban(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none" />
              <textarea placeholder="Morada Fiscal" value={editMorada} onChange={e => setEditMorada(e.target.value)} className="w-full h-28 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none resize-none" />
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setIsBillingOpen(false)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl">Cancelar</button>
              <button onClick={atualizarFaturacao} className="flex-1 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold shadow-lg shadow-sky-200 transition-colors">Guardar Dados</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}