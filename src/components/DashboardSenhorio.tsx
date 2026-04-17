import { useState } from 'react';
import {
  Building2,
  Megaphone,
  Users,
  Wallet,
  MessageSquare,
  Plus,
  Search,
  Bell,
  MoreVertical,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';

const stats = [
  { label: 'Total de Rendas Recebidas', value: '12.450,00 €', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+12%' },
  { label: 'Unidades Vazias', value: '3', icon: Building2, color: 'text-amber-600', bg: 'bg-amber-50', trend: '2 em preparação' },
  { label: 'Manutenções Pendentes', value: '5', icon: MessageSquare, color: 'text-rose-600', bg: 'bg-rose-50', trend: '2 urgentes' },
];

const properties = [
  { id: 1, address: 'Rua Garrett 12, 1200-203 Lisboa', area: 85, status: 'Alugado', rent: '1.200€' },
  { id: 2, address: 'Av. da Boavista 450, 4100-114 Porto', area: 110, status: 'Vazio', rent: '1.550€' },
  { id: 3, address: 'Rua de Santa Catarina 22, 4000-442 Porto', area: 65, status: 'Alugado', rent: '950€' },
  { id: 4, address: 'Estrada Monumental 150, 9000-098 Funchal', area: 130, status: 'Alugado', rent: '2.100€' },
  { id: 5, address: 'Rua Direita de Baixo 5, 3000-120 Coimbra', area: 95, status: 'Vazio', rent: '850€' },
];

const menuItems = [
  { name: 'Propriedades', icon: Building2 },
  { name: 'Anúncios', icon: Megaphone },
  { name: 'Candidaturas', icon: Users },
  { name: 'Rendas', icon: Wallet },
  { name: 'Mensagens', icon: MessageSquare },
];

export default function DashboardSenhorio() {
  const [activeTab, setActiveTab] = useState('Propriedades');

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-slate-900">

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
            <span className="font-bold text-xl">A</span>
          </div>
          <span className="text-xl font-bold tracking-tight">ArrendAI</span>
        </div>

        <nav className="flex-1 px-4 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-1 ${
                activeTab === item.name
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold">
              JS
            </div>
            <div>
              <p className="text-sm font-medium">João Silva</p>
              <p className="text-xs text-slate-400">Senhorio Pro</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Pesquisar propriedades, inquilinos..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
              <Plus size={18} />
              <span>Adicionar Nova Propriedade</span>
            </button>
          </div>
        </header>

        {/* DASHBOARD BODY */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800">Painel de Gestão</h1>
            <p className="text-slate-500 text-sm">Bem-vindo de volta. Aqui está o resumo do seu portfólio.</p>
          </div>

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className={`${stat.bg} ${stat.color} p-3 rounded-lg`}>
                    <stat.icon size={24} />
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                    <TrendingUp size={12} /> {stat.trend}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* PROPERTIES TABLE */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">As Minhas Propriedades</h2>
              <button className="text-sky-600 hover:text-sky-700 text-sm font-semibold flex items-center gap-1">
                Ver todas <ArrowUpRight size={16} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Morada (ZIP Code)</th>
                    <th className="px-6 py-4 font-semibold">Área (m²)</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Renda Mensal</th>
                    <th className="px-6 py-4 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {properties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800">{prop.address}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{prop.area} m²</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          prop.status === 'Alugado'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {prop.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">{prop.rent}</td>
                      <td className="px-6 py-4">
                        <button className="text-gray-400 hover:text-sky-600 transition-colors">
                          <MoreVertical size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
