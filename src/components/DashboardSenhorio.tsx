import { useState } from 'react';
import { Building2, Megaphone, Users, Wallet, MessageSquare, Search, Bell } from 'lucide-react';

// IMPORTAÇÃO DE TODOS OS COMPONENTES MODULARES
import Anuncios from './Anuncios';
import Propriedades from './Propriedades';
import PainelRendas from './PainelRendas';
import PainelCandidaturas from './PainelCandidaturas';
import PainelMensagens from './PainelMensagens';

const menuItems = [
  { name: 'Propriedades', icon: Building2 },
  { name: 'Anúncios', icon: Megaphone },
  { name: 'Candidaturas', icon: Users },
  { name: 'Rendas', icon: Wallet },
  { name: 'Mensagens', icon: MessageSquare },
];

export default function DashboardSenhorio() {
  const [activeTab, setActiveTab] = useState('Anúncios');

  // FUNÇÃO QUE RENDERIZA O COMPONENTE CORRETO
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
        
        <nav className="flex-1 px-4 mt-6">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all mb-2 font-medium ${
                activeTab === item.name 
                ? 'bg-sky-600 text-white shadow-md' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold">JS</div>
            <div>
              <p className="text-sm font-bold text-white">João Silva</p>
              <p className="text-xs text-sky-400 font-medium">Senhorio Pro</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar propriedades, inquilinos..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all" 
            />
          </div>
          <button className="p-2.5 text-gray-500 hover:bg-slate-100 rounded-xl relative transition-colors">
            <Bell size={22} />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </header>

        {/* ÁREA DINÂMICA (Renderiza o componente selecionado no menu) */}
        <div className="flex-1 overflow-y-auto p-8">
          {renderContent()}
        </div>
        
      </main>
    </div>
  );
}