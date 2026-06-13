import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Shield, FileText, LogOut, ArrowLeft, Lock, CreditCard, Bell, MapPin, Building, CheckCircle, Upload, Loader2 } from 'lucide-react';

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

  // ESTADOS DE NOTIFICAÇÕES
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificacoes, setNotificacoes] = useState<any[]>([]);
  const naoLidas = notificacoes.filter(n => !n.lida).length;

  // ESTADOS DOS DOCUMENTOS LEGAIS (INTERATIVOS)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [docAtivo, setDocAtivo] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<string | null>(null);

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
        alert("Dados guardados com sucesso!");
      } else {
        alert('Erro ao guardar os dados no servidor. Verifica se os dados estão corretos.');
      }
    } catch (error) {
      console.error('Erro de rede:', error);
    }
  };

  // 5. ALTERAR PASSWORD
  const handleAlterarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("A nova password e a confirmação não coincidem!");
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
        alert("Password atualizada com sucesso! Por favor, faz login novamente.");
        terminarSessao();
      } else {
        const erro = await response.json();
        alert(erro.error || 'Erro: Password atual incorreta.');
      }
    } catch (error) {
      console.error('Erro ao mudar password:', error);
    }
  };

  const terminarSessao = () => {
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
      // Muda o estado do documento para "Por Verificar"
      setDocumentos(prev => prev.map(doc => 
        doc.id === docAtivo 
        ? { ...doc, estado: 'Por Verificar', cor: 'text-amber-600 bg-amber-50 border-amber-200' } 
        : doc
      ));
    }
    // Reseta o input
    if (fileInputRef.current) fileInputRef.current.value = '';
    setDocAtivo(null);
  };

  const handleVerificarDoc = (id: string) => {
    setIsVerifying(id);
    
    // Simula uma chamada à API de verificação (demora 2 segundos)
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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-16 relative">
      
      {/* INPUT INVISÍVEL PARA ARQUIVOS */}
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        accept=".pdf,.jpg,.jpeg,.png" 
        onChange={handleUploadFile} 
      />

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
          
          {/* COLUNA ESQUERDA: AVATAR E MENU DE ABAS */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-white rounded-[2rem] border border-slate-200 p-10 shadow-sm text-center">
              <div className="w-32 h-32 bg-sky-100 rounded-full flex items-center justify-center text-sky-700 font-bold text-5xl mx-auto mb-6 shadow-inner uppercase">
                {nomeExibicao.charAt(0)}
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-1">{nomeExibicao}</h2>
              <p className="text-slate-500 font-medium mb-6">Senhorio</p>
              
              {/* Crachá muda consoante os documentos todos estarem verificados */}
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
                
                <div className="h-px bg-slate-100 my-2 mx-4"></div>
                
                <button onClick={terminarSessao} className="w-full flex items-center gap-3 p-4 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                  <LogOut size={18} /> Terminar Sessão
                </button>
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
      </main>

    </div>
  );
}