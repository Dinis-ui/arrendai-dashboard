import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Megaphone, Users, Wallet, MessageSquare, Search, Bell, ShieldCheck, LogOut } from 'lucide-react';

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
  
  // ESTADO DO MODAL DE LOGOUT
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
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
  }, []);

  const [showNotifications, setShowNotifications] = useState(false);
  const [notificacoes, setNotificacoes] = useState([
    { id: 1, titulo: 'Nova Candidatura', desc: 'Ana Martins candidatou-se ao Quarto em Entrecampos.', tempo: 'Há 5 min', lida: false },
    { id: 2, titulo: 'Renda Paga', desc: 'Francisco Silva pagou a renda de Maio.', tempo: 'Há 2 horas', lida: false },
    { id: 3, titulo: 'Aviso do Sistema', desc: 'O seu anúncio T2 Cascais foi aprovado.', tempo: 'Há 1 dia', lida: true },
  ]);

  const naoLidas = notificacoes.filter(n => !n.lida).length;

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
              <p className="text-sm font-medium text-white truncate">
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
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden z-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 relative z-20">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Pesquisar propriedades, inquilinos..." className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all" />
          </div>
          
          <button onClick={() => setShowNotifications(!showNotifications)} className={`p-2 rounded-full relative transition-colors ${showNotifications ? 'bg-sky-50 text-sky-600' : 'text-gray-500 hover:bg-gray-100'}`}>
            <Bell size={20} />
            {naoLidas > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
          </button>
        </header>

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