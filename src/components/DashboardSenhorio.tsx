import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Megaphone, Users, Wallet, MessageSquare, Search, Bell, ShieldCheck, AlertCircle, LogOut, User } from 'lucide-react';

// IMPORTAÇÃO DOS COMPONENTES
import Anuncios from './Anuncios';
import Propriedades from './Propriedades';
import PainelRendas from './PainelRendas';
import PainelCandidaturas from './PainelCandidaturas';
import PainelMensagens from './PainelMensagens';
import PerfilSenhorio from './PerfilSenhorio';
import PlanosSubscricao from './PlanosSubscricao';

const menuItems = [
  { name: 'Propriedades', icon: Building2 },
  { name: 'Anúncios', icon: Megaphone },
  { name: 'Candidaturas', icon: Users },
  { name: 'Rendas', icon: Wallet },
  { name: 'Mensagens', icon: MessageSquare },
  { name: 'Meu Plano', icon: ShieldCheck },
];

export default function DashboardSenhorio() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Anúncios');
  const [user, setUser] = useState<any>(null); 
  
  // ESTADOS DAS NOTIFICAÇÕES REAIS
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificacoes, setNotificacoes] = useState<any[]>([]);
  const naoLidas = notificacoes.filter(n => !n.lida).length;

  // ESTADO DO MODAL DE LOGOUT
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // 1. CARREGAR UTILIZADOR
  useEffect(() => {
    const carregarDados = async () => {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      if (!token) return;

      try {
        const res = await fetch('http://127.0.0.1:8000/api/users/me/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const dados = await res.json();
          setUser(dados);
        }
      } catch (e) { console.error("Erro ao carregar utilizador:", e); }
    };
    carregarDados();
  }, [activeTab]); // Recarrega sempre que muda de aba, para apanhar as mudanças que fizeste no Perfil

  // 2. CARREGAR NOTIFICAÇÕES (Em Tempo Real)
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
    // Atualiza sozinho a cada 30 segundos
    const intervalo = setInterval(carregarNotificacoes, 30000);
    return () => clearInterval(intervalo);
  }, []);

  // 3. MARCAR NOTIFICAÇÕES COMO LIDAS AO ABRIR O SINO
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

  // VERIFICAR SE O PERFIL ESTÁ INCOMPLETO
  const isPerfilIncompleto = user && (!user.telefone || !user.nif || !user.iban);

  // Lógica inteligente para mostrar o Nome Completo ou o Username
  const nomeExibicao = (user?.first_name ? `${user.first_name} ${user.last_name}`.trim() : user?.nome_completo) || user?.username || 'Utilizador';
  
  // NOVO: Tradutor do ID do Plano para Nome
  const traduzirPlano = (plano: any) => {
    if (!plano) return '';
    if (plano.nome) return plano.nome; // Caso o backend já envie o nome
    if (plano === 1 || plano === '1') return 'Básico';
    if (plano === 2 || plano === '2') return 'PRO';
    if (plano === 3 || plano === '3') return 'Premium';
    return `Plano ${plano}`; // Prevenção para outros números
  };

  // FUNÇÕES DE LOGOUT
  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmarLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    navigate('/login');
  };

  if (activeTab === 'Perfil') {
    return <PerfilSenhorio onBack={() => setActiveTab('Anúncios')} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Anúncios': return <Anuncios />;
      case 'Propriedades': return (
        <Propriedades 
          onMudarParaAnuncios={() => setActiveTab('Anúncios')} 
          onMudarParaMensagens={() => setActiveTab('Mensagens')}
        />
      );
      case 'Candidaturas': return <PainelCandidaturas />;
      case 'Rendas': return <PainelRendas />;
      case 'Mensagens': return <PainelMensagens />;
      case 'Meu Plano': return <PlanosSubscricao />;
      default: return <Anuncios />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-slate-900 relative">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 z-10">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-sky-500/20">A</div>
          <span className="text-xl font-bold tracking-tight">ArrendAI</span>
        </div>
        
        <nav className="flex-1 px-4 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-1 font-medium ${
                activeTab === item.name 
                ? 'bg-sky-600 text-white' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium text-sm">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* PERFIL DINÂMICO */}
        <div className="p-4 border-t border-slate-800">
          <div 
            onClick={() => setActiveTab('Perfil')}
            className="flex items-center gap-3 px-2 py-2 cursor-pointer hover:bg-slate-800 rounded-lg transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold uppercase shrink-0">
              {user ? nomeExibicao.charAt(0) : '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate w-full">
                {user ? nomeExibicao : 'A carregar...'}
              </p>
              
             {/* SECÇÃO DO CARGO + PLANO */}
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>{user?.role === 'landlord' ? 'Senhorio' : 'Inquilino'}</span>
                
                {/* Se for senhorio e tiver plano, mostra a etiqueta traduzida */}
                {user?.role === 'landlord' && user?.plano && (
                  <span className="bg-sky-500/20 text-sky-400 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider">
                    {traduzirPlano(user.plano)}
                  </span>
                )}
              </p>
            </div>
            {/* Bolinha vermelha no perfil se faltarem dados */}
            {isPerfilIncompleto && (
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0"></div>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 relative z-20">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Pesquisar propriedades, inquilinos..." className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all" />
          </div>
          
          {/* GRUPO DA DIREITA: SINO E PERFIL */}
          <div className="flex items-center gap-4">
            
            {/* SININHO E DROPDOWN */}
            <div className="relative">
              <button 
                onClick={handleToggleNotificacoes}
                className={`p-2 rounded-full relative transition-colors ${showNotifications ? 'bg-sky-50 text-sky-600' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <Bell size={20} />
                {naoLidas > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
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

            {/* ÍCONE DE PERFIL DIRETO */}
            <div 
              onClick={() => setActiveTab('Perfil')}
              className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold text-sm uppercase shrink-0 cursor-pointer hover:ring-2 hover:ring-sky-200 transition-all shadow-sm"
              title="Ir para o Perfil"
            >
              {user ? nomeExibicao.charAt(0) : <User size={18} />}
            </div>
            
          </div>
        </header>

        {/* ALERTA INTELIGENTE (ONBOARDING) */}
        {isPerfilIncompleto && (
          <div className="bg-amber-50 border-b border-amber-200 px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 text-amber-800">
              <AlertCircle size={18} className="text-amber-500" />
              <p className="text-sm font-medium">Atenção: O teu perfil está incompleto (falta NIF, IBAN ou Telefone). Não poderás receber pagamentos.</p>
            </div>
            <button 
              onClick={() => setActiveTab('Perfil')}
              className="text-xs font-bold bg-amber-200 text-amber-800 px-4 py-1.5 rounded-lg hover:bg-amber-300 transition-colors"
            >
              Completar Agora
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
          {renderContent()}
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
                Vai sair da sua conta de Senhorio e voltar para a página inicial. Terá de inserir a sua password para voltar a entrar.
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
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-rose-500/20"
                >
                  Sim, Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}