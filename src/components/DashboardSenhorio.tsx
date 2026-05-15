import { useState } from 'react';
import { Building2, Megaphone, Users, Wallet, MessageSquare, Search, Bell, Check } from 'lucide-react';

// IMPORTAÇÃO DOS COMPONENTES
import Anuncios from './Anuncios';
import Propriedades from './Propriedades';
import PainelRendas from './PainelRendas';
import PainelCandidaturas from './PainelCandidaturas';
import PainelMensagens from './PainelMensagens';
import PerfilSenhorio from './PerfilSenhorio';

const menuItems = [
  { name: 'Propriedades', icon: Building2 },
  { name: 'Anúncios', icon: Megaphone },
  { name: 'Candidaturas', icon: Users },
  { name: 'Rendas', icon: Wallet },
  { name: 'Mensagens', icon: MessageSquare },
];

export default function DashboardSenhorio() {
  const [activeTab, setActiveTab] = useState('Anúncios');
  
  // NOTIFICAÇÕES
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificacoes, setNotificacoes] = useState([
    { id: 1, titulo: 'Nova Candidatura', desc: 'Ana Martins candidatou-se ao Quarto em Entrecampos.', tempo: 'Há 5 min', lida: false },
    { id: 2, titulo: 'Renda Paga', desc: 'Francisco Silva pagou a renda de Maio.', tempo: 'Há 2 horas', lida: false },
    { id: 3, titulo: 'Aviso do Sistema', desc: 'O seu anúncio T2 Cascais foi aprovado.', tempo: 'Há 1 dia', lida: true },
  ]);

  const naoLidas = notificacoes.filter(n => !n.lida).length;

  // LÓGICA DE ECRÃ INTEIRO PARA O PERFIL
  if (activeTab === 'Perfil') {
    return <PerfilSenhorio onBack={() => setActiveTab('Anúncios')} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Anúncios': return <Anuncios />;
      case 'Propriedades': return <Propriedades />;
      case 'Candidaturas': return <PainelCandidaturas />;
      case 'Rendas': return <PainelRendas />;
      case 'Mensagens': return <PainelMensagens />;
      default: return <Anuncios />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
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

        {/* PERFIL */}
        <div className="p-4 border-t border-slate-800">
          <div 
            onClick={() => setActiveTab('Perfil')}
            className="flex items-center gap-3 px-2 py-2 cursor-pointer hover:bg-slate-800 rounded-lg transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold">
              JS
            </div>
            <div>
              <p className="text-sm font-medium text-white">João Silva</p>
              <p className="text-xs text-slate-400">Senhorio Pro</p>
            </div>
          </div>
        </div>
       

      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 relative z-20">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar propriedades, inquilinos..." 
              className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all" 
            />
          </div>
          
          {/* NOTIFICAÇÕES */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-full relative transition-colors ${showNotifications ? 'bg-sky-50 text-sky-600' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <Bell size={20} />
              {naoLidas > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>

            {/* CAIXA DE DROPDOWN */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h3 className="font-bold text-slate-800">Notificações</h3>
                  {naoLidas > 0 && (
                    <button 
                      onClick={() => setNotificacoes(notificacoes.map(n => ({ ...n, lida: true })))}
                      className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 transition-colors"
                    >
                      <Check size={12} /> Marcar como lidas
                    </button>
                  )}
                </div>

                <div className="max-h-[350px] overflow-y-auto">
                  {notificacoes.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 text-sm">Não tens notificações.</div>
                  ) : (
                    notificacoes.map(notif => (
                      <div 
                        key={notif.id} 
                        className={`p-4 border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50 ${notif.lida ? 'opacity-60' : 'bg-sky-50/20'}`}
                      >
                        <p className={`text-sm font-bold ${notif.lida ? 'text-slate-700' : 'text-slate-900'}`}>{notif.titulo}</p>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">{notif.desc}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wider">{notif.tempo}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-3 text-center border-t border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                  <span className="text-xs font-bold text-slate-500">Ver todo o histórico</span>
                </div>

              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
          {renderContent()}
        </div>
        
      </main>
    </div>
  );
}