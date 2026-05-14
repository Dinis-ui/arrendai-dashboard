import { useState } from 'react';
import { Building2, Megaphone, Users, Wallet, MessageSquare, Search, Bell } from 'lucide-react';


import Anuncios from './Anuncios';
import Propriedades from './Propriedades';

const menuItems = [
  { name: 'Propriedades', icon: Building2 },
  { name: 'Anúncios', icon: Megaphone },
  { name: 'Candidaturas', icon: Users },
  { name: 'Rendas', icon: Wallet },
  { name: 'Mensagens', icon: MessageSquare },
];

export default function DashboardSenhorio() {
  const [activeTab, setActiveTab] = useState('Anúncios');

  const renderContent = () => {
    switch (activeTab) {
      case 'Anúncios': return <Anuncios />;
      case 'Propriedades': return <Propriedades />;
      case 'Mensagens': return <div className="p-10 text-center">Ecrã de Mensagens (Em Construção)</div>;
      case 'Candidaturas': return <div className="p-10 text-center">Ecrã de Candidaturas (Em Construção)</div>;
      case 'Rendas': return <div className="p-10 text-center">Ecrã de Rendas (Em Construção)</div>;
      default: return <Anuncios />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-slate-900">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center font-bold">A</div>
          <span className="text-xl font-bold">ArrendAI</span>
        </div>
        <nav className="flex-1 px-4 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-1 ${activeTab === item.name ? 'bg-sky-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Pesquisar..." className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm outline-none" />
          </div>
          <Bell className="text-gray-400" size={20} />
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}