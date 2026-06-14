import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, Shield, FileText, LogOut, Lock, 
  CreditCard, Bell, MapPin, Building, CheckCircle, Upload, Loader2,
  CheckCircle2, AlertCircle, X, LayoutDashboard, Settings 
} from 'lucide-react';

interface PerfilProps {
  onBack: () => void;
}

export default function PerfilSenhorio({ onBack }: PerfilProps) {
  const navigate = useNavigate();

  // ESTADO DA ABA ATIVA
  const [profileTab, setProfileTab] = useState('conta');

  // ESTADO DO UTILIZADOR REAL (Vindo da API)
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ESTADOS PARA OS FORMULÁRIOS
  const [editUsername, setEditUsername] = useState('');
  const [editTelefone, setEditTelefone] = useState(''); 
  const [editNif, setEditNif] = useState('');
  const [editIban, setEditIban] = useState('');
  const [editMorada, setEditMorada] = useState('');
  
  // ESTADOS DA PASSWORD
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // ESTADOS DE NOTIFICAÇÕES (Sininho)
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificacoes, setNotificacoes] = useState<any[]>([]);
  const naoLidas = notificacoes.filter(n => !n.lida).length;

  // ESTADOS DOS DOCUMENTOS LEGAIS (INTERATIVOS)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [docAtivo, setDocAtivo] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<string | null>(null);

  // ESTADO DO MODAL DE LOGOUT
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // ESTADOS DOS TOASTS (Avisos de Sucesso e Erro)
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastErro, setToastErro] = useState<{ativo: boolean, mensagem: string}>({ ativo: false, mensagem: '' });

  const mostrarSucesso = (mensagem: string) => {
    setToastMessage(mensagem);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  const mostrarErro = (mensagem: string) => {
    setToastErro({ ativo: true, mensagem });
    setTimeout(() => setToastErro({ ativo: false, mensagem: '' }), 5000);
  };

  const [documentos, setDocumentos] = useState([
    { id: 'cc', nome: 'Cartão de Cidadão', estado: 'Pendente', cor: 'text-slate-500 bg-slate-50 border-slate-200' },
    { id: 'predial', nome: 'Registo Predial', estado: 'Pendente', cor: 'text-slate-500 bg-slate-50 border-slate-200' },
    { id: 'energetico', nome: 'Certificado Energético', estado: 'Pendente', cor: 'text-slate-500 bg-slate-50 border-slate-200' },
  ]);

  // 1. CARREGAR PERFIL INICIAL
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
          setEditMorada(dados.morada_fiscal || dados.morada || '');
        } else {
          confirmarLogout();
        }
      } catch (e) {
        console.error("Erro ao carregar perfil:", e);
      } finally {
        setLoading(false);
      }
    };
    carregarPerfil();
  }, [navigate]);

  // 2. CARREGAR NOTIFICAÇÕES
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
    const intervalo = setInterval(carregarNotificacoes, 30000);
    return () => clearInterval(intervalo);
  }, []);

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
        console.error("Erro a marcar notificações", error);
      }
    }
  };

  // 4. GUARDAR CONTA (Perfil + Faturação)
  const guardarConta = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/me/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: editUsername,
          telefone: editTelefone,
          nif: editNif,
          iban: editIban,
          morada_fiscal: editMorada
        })
      });

      if (response.ok) {
        const dadosNovos = await response.json();
        setUser(dadosNovos); 
        mostrarSucesso("Dados guardados com sucesso!");
      } else {
        mostrarErro('Erro ao guardar os dados no servidor. Verifica se os dados estão corretos.');
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      mostrarErro('Ocorreu um erro na ligação ao servidor.');
    }
  };

  // 5. ALTERAR PASSWORD
  const handleAlterarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      mostrarErro("A nova password e a confirmação não coincidem!");
      return;
    }

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
        mostrarSucesso("Password atualizada com sucesso! A terminar sessão...");
        setTimeout(() => {
          confirmarLogout();
        }, 2500);
      } else {
        const erro = await response.json();
        mostrarErro(erro.error || 'Erro: Password atual incorreta.');
      }
    } catch (error) {
      console.error('Erro ao mudar password:', error);
      mostrarErro('Ocorreu um erro na ligação ao servidor.');
    }
  };

  // 6. LOGOUT
  const handleLogoutClick = () => setIsLogoutModalOpen(true);
  
  const confirmarLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    navigate('/login');
  };

  // --- LÓGICA DOS DOCUMENTOS LEGAIS ---
  const clickAdicionarDoc = (id: string) => {
    setDocAtivo(id);
    fileInputRef.current?.click();
  };

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && docAtivo) {
      setDocumentos(prev => prev.map(doc => 
        doc.id === docAtivo 
        ? { ...doc, estado: 'Por Verificar', cor: 'text-amber-600 bg-amber-50 border-amber-200' } 
        : doc
      ));
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
    setDocAtivo(null);
  };

  const handleVerificarDoc = (id: string) => {
    setIsVerifying(id);
    setTimeout(() => {
      setDocumentos(prev => prev.map(doc => 
        doc.id === id 
        ? { ...doc, estado: 'Verificado', cor: 'text-emerald-600 bg-emerald-50 border-emerald-200' } 
        : doc
      ));
      setIsVerifying(null);
    }, 2000);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">A carregar...</div>;

  const nomeExibicao = user?.username || 'Senhorio';

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-slate-900 relative">
      
      {/* INPUT INVISÍVEL PARA ARQUIVOS */}
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        accept=".pdf,.jpg,.jpeg,.png" 
        onChange={handleUploadFile} 
      />

      {/* SIDEBAR ESCURA */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col z-10 shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
            <span className="font-bold text-xl">A</span>
          </div>
          <span className="text-xl font-bold tracking-tight">ArrendAI</span>
        </div>

        <nav className="flex-1 px-4 mt-4">
          <button 
            onClick={onBack}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <LayoutDashboard size={20} />
            <span className="font-medium text-sm">Dashboard</span>
          </button>
          <button 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-1 bg-sky-600 text-white shadow-md shadow-sky-600/20"
          >
            <Settings size={20} />
            <span className="font-medium text-sm">Definições</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-slate-800">
            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold uppercase shrink-0">
              {nomeExibicao.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{nomeExibicao}</p>
              <p className="text-xs text-slate-400">Senhorio</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* CABEÇALHO */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 relative z-20">
          <div>
            <h1 className="text-lg font-bold text-slate-800">Definições de Conta</h1>
            <p className="text-xs text-slate-400">Gere o teu perfil e documentação legal</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* DROPDOWN DE NOTIFICAÇÕES */}
            <div className="relative">
              <button 
                onClick={handleToggleNotificacoes}
                className={`p-2 rounded-full relative transition-colors ${showNotifications ? 'bg-sky-50 text-sky-600' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <Bell size={20} />
                {naoLidas > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
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

            <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold text-sm uppercase shrink-0">
              {nomeExibicao.charAt(0)}
            </div>
          </div>
        </header>

        {/* CONTEÚDO SCROLLÁVEL */}
        <div className="flex-1 overflow-y-auto bg-slate-50 z-0 relative p-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-in fade-in duration-300">
              
              {/* COLUNA ESQUERDA: AVATAR E MENU DE ABAS */}
              <div className="md:col-span-4 space-y-6">
                <div className="bg-white rounded-[2rem] border border-slate-200 p-10 shadow-sm text-center">
                  <div className="w-32 h-32 bg-sky-100 rounded-full flex items-center justify-center text-sky-700 font-bold text-5xl mx-auto mb-6 shadow-inner uppercase">
                    {nomeExibicao.charAt(0)}
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-1">{nomeExibicao}</h2>
                  <p className="text-slate-500 font-medium mb-6">Senhorio</p>
                  
                  {documentos.every(d => d.estado === 'Verificado') ? (
                    <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-5 py-2 rounded-full text-xs font-bold border border-emerald-100">
                      <Shield size={14} /> Proprietário Verificado
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-5 py-2 rounded-full text-xs font-bold border border-amber-100">
                      <Shield size={14} /> Documentação Incompleta
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-200 p-4 shadow-sm">
                  <nav className="space-y-2">
                    <button 
                      onClick={() => setProfileTab('conta')} 
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                        profileTab === 'conta' 
                          ? 'bg-sky-50 text-sky-700 shadow-sm' 
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                      }`}
                    >
                      <User size={18} /> A Minha Conta
                    </button>
                    <button 
                      onClick={() => setProfileTab('documentos')} 
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                        profileTab === 'documentos' 
                          ? 'bg-sky-50 text-sky-700 shadow-sm' 
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                      }`}
                    >
                      <FileText size={18} /> Documentos Legais
                    </button>
                    <button 
                      onClick={() => setProfileTab('seguranca')} 
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                        profileTab === 'seguranca' 
                          ? 'bg-sky-50 text-sky-700 shadow-sm' 
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                      }`}
                    >
                      <Lock size={18} /> Segurança e Password
                    </button>
                    
                    {/* BOTÃO DE LOGOUT A VERMELHO */}
                    <div className="pt-6 mt-2 border-t border-slate-100">
                      <button 
                        onClick={handleLogoutClick}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm bg-rose-50 text-rose-600 hover:bg-rose-100 shadow-sm border border-rose-100"
                      >
                        <LogOut size={18} /> Terminar Sessão
                      </button>
                    </div>
                  </nav>
                </div>
              </div>

              {/* COLUNA DIREITA: CONTEÚDO DAS ABAS */}
              <div className="md:col-span-8">
                
                {/* ABA: A MINHA CONTA */}
                {profileTab === 'conta' && (
                  <div className="bg-white rounded-[2rem] border border-slate-200 p-10 shadow-sm animate-in fade-in">
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Informação Pessoal e Faturação</h3>
                      <p className="text-sm text-slate-500">Gere os teus dados de contacto e dados necessários para recebimento de rendas.</p>
                    </div>

                    <form onSubmit={guardarConta} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><User size={14}/> Nome de Utilizador</label>
                          <input type="text" value={editUsername} onChange={e => setEditUsername(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors font-bold" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Mail size={14}/> Email Profissional</label>
                          <input type="email" value={user?.email || ''} disabled className="w-full bg-gray-100 border border-gray-200 rounded-2xl px-4 py-4 text-sm text-gray-500 cursor-not-allowed font-bold" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Phone size={14}/> Telefone de Contacto</label>
                          <input type="text" value={editTelefone} onChange={e => setEditTelefone(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors font-bold" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><CreditCard size={14}/> NIF Associado</label>
                          <input type="text" value={editNif} onChange={e => setEditNif(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors font-bold" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Building size={14}/> IBAN para Recebimentos</label>
                          <input type="text" value={editIban} onChange={e => setEditIban(e.target.value)} placeholder="PT50..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors font-bold" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><MapPin size={14}/> Morada Fiscal Cadastrada</label>
                          <textarea value={editMorada} onChange={e => setEditMorada(e.target.value)} rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors resize-none font-bold"></textarea>
                        </div>
                      </div>

                      <div className="pt-8 flex justify-end">
                        <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-4 px-10 rounded-2xl transition-colors shadow-sm">
                          Guardar Alterações
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* ABA: SEGURANÇA */}
                {profileTab === 'seguranca' && (
                  <div className="bg-white rounded-[2rem] border border-slate-200 p-10 shadow-sm animate-in fade-in">
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Segurança e Password</h3>
                      <p className="text-sm text-slate-500">Atualiza a tua password para manteres a conta segura.</p>
                    </div>

                    <form onSubmit={handleAlterarPassword} className="space-y-6 max-w-lg">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Palavra-passe atual</label>
                        <input 
                          type="password" 
                          value={oldPassword} 
                          onChange={e => setOldPassword(e.target.value)}
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nova palavra-passe</label>
                        <input 
                          type="password" 
                          value={newPassword} 
                          onChange={e => setNewPassword(e.target.value)}
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Confirmar nova palavra-passe</label>
                        <input 
                          type="password" 
                          value={confirmPassword} 
                          onChange={e => setConfirmPassword(e.target.value)}
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors" 
                        />
                      </div>

                      <div className="pt-8">
                        <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-4 px-10 rounded-2xl transition-colors shadow-sm w-full md:w-auto">
                          Atualizar Password
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* ABA: DOCUMENTOS LEGAIS */}
                {profileTab === 'documentos' && (
                  <div className="bg-white rounded-[2rem] border border-slate-200 p-10 shadow-sm animate-in fade-in">
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Documentação Legal Obrigatória</h3>
                      <p className="text-sm text-slate-500">De forma a publicar anúncios na plataforma, precisa de verificar os seguintes documentos.</p>
                    </div>
                    
                    <div className="space-y-4">
                      {documentos.map((doc) => (
                        <div key={doc.id} className={`flex items-center justify-between p-6 border rounded-[1.5rem] transition-colors ${doc.cor}`}>
                          <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border bg-white ${doc.estado === 'Verificado' ? 'text-emerald-500 border-emerald-100' : 'text-slate-400 border-slate-200'}`}>
                              {doc.estado === 'Verificado' ? <CheckCircle size={24} /> : <FileText size={24} />}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{doc.nome}</p>
                              <p className="text-xs text-slate-500 mt-1 font-medium">{doc.estado}</p>
                            </div>
                          </div>

                          {/* BOTÕES DINÂMICOS DEPENDENDO DO ESTADO */}
                          {doc.estado === 'Pendente' && (
                            <button 
                              onClick={() => clickAdicionarDoc(doc.id)}
                              className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm"
                            >
                              <Upload size={16} /> Adicionar
                            </button>
                          )}

                          {doc.estado === 'Por Verificar' && (
                            <button 
                              onClick={() => handleVerificarDoc(doc.id)}
                              disabled={isVerifying === doc.id}
                              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm disabled:bg-amber-300"
                            >
                              {isVerifying === doc.id ? (
                                <><Loader2 size={16} className="animate-spin" /> A Analisar...</>
                              ) : (
                                <><Shield size={16} /> Verificar</>
                              )}
                            </button>
                          )}

                          {doc.estado === 'Verificado' && (
                            <span className="px-5 py-2.5 rounded-xl text-sm font-bold text-emerald-700 bg-emerald-100 flex items-center gap-2">
                              <CheckCircle size={16} /> Verificado Legalmente
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL DE CONFIRMAÇÃO DE LOGOUT */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-5 border-[6px] border-white shadow-sm">
                <LogOut size={36} className="ml-1" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Terminar Sessão?</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Vais sair da tua conta de Senhorio e voltar para a página inicial. Terás de inserir a tua password para voltar a entrar.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsLogoutModalOpen(false)} 
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmarLogout} 
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-500/20 transition-colors"
                >
                  Sim, Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST GLOBAL SUCESSO */}
      {showSuccessToast && (
        <div className="fixed bottom-10 right-10 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-50 animate-in fade-in slide-in-from-bottom-6">
          <div className="bg-white/20 p-2 rounded-full"><CheckCircle2 size={24} className="text-white" /></div>
          <div>
            <p className="font-bold text-sm">Sucesso!</p>
            <p className="text-xs text-emerald-100 mt-0.5">{toastMessage}</p>
          </div>
          <button onClick={() => setShowSuccessToast(false)} className="ml-4 text-emerald-200 hover:text-white"><X size={18} /></button>
        </div>
      )}
      
      {/* TOAST DE ERRO VERMELHO */}
      {toastErro.ativo && (
        <div className="fixed bottom-8 right-8 flex items-start gap-4 p-5 w-full max-w-md bg-rose-50 border border-rose-200 rounded-2xl shadow-2xl shadow-rose-900/10 z-[100] animate-in slide-in-from-bottom-8 fade-in duration-300">
          <AlertCircle className="text-rose-600 shrink-0 mt-0.5" size={24} />
          <div>
            <h4 className="text-rose-900 font-bold text-lg mb-1">Ops, algo correu mal</h4>
            <p className="text-rose-700 text-sm font-medium leading-relaxed">{toastErro.mensagem}</p>
          </div>
          <button onClick={() => setToastErro({...toastErro, ativo: false})} className="text-rose-400 hover:text-rose-600 ml-auto transition-colors">
            <X size={20} />
          </button>
        </div>
      )}
      
    </div>
  );
}