import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Users, Home, CreditCard, Activity, 
  CheckCircle, XCircle, Search, FileText, Bell, LogOut 
} from 'lucide-react';

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Visão Geral');
  
  // STATS REAIS DO DJANGO
  const [stats, setStats] = useState({
    totalUsers: 0, senhoriosPendentes: 0, anunciosPendentes: 0, receitaMensal: '0€'
  });
  const [senhoriosPendentes, setSenhoriosPendentes] = useState<any[]>([]);
  const [imoveisPendentes, setImoveisPendentes] = useState<any[]>([]);

  const carregarDados = async () => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (!token) { navigate('/login'); return; }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/users/admin/dashboard/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setSenhoriosPendentes(data.senhorios);
        setImoveisPendentes(data.imoveis);
      } else {
        alert("Acesso Negado: Apenas administradores.");
        navigate('/');
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const menuItems = [
    { name: 'Visão Geral', icon: Activity },
    { name: 'Aprovar Senhorios', icon: Users, badge: stats.senhoriosPendentes },
    { name: 'Moderar Anúncios', icon: Home, badge: stats.anunciosPendentes },
    { name: 'Gestão de Planos', icon: CreditCard },
  ];

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  // AÇÕES REAIS PARA SENHORIOS
  const lidarComSenhorio = async (id: number, acao: 'aprovado' | 'rejeitado') => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (!window.confirm(`Tem a certeza que deseja ${acao} este senhorio?`)) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/users/admin/senhorio/${id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ acao: acao })
      });

      if (res.ok) {
        setSenhoriosPendentes(prev => prev.filter(s => s.id !== id));
        setStats(prev => ({ ...prev, senhoriosPendentes: prev.senhoriosPendentes - 1 }));
      }
    } catch (e) { alert('Erro de ligação.'); }
  };

  // AÇÕES REAIS PARA IMÓVEIS
  const lidarComImovel = async (id: number, acao: 'aprovado' | 'rejeitado') => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (!window.confirm(`Tem a certeza que deseja ${acao} este imóvel?`)) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/users/admin/imovel/${id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ acao: acao })
      });

      if (res.ok) {
        setImoveisPendentes(prev => prev.filter(i => i.id !== id));
        setStats(prev => ({ ...prev, anunciosPendentes: prev.anunciosPendentes - 1 }));
      }
    } catch (e) { alert('Erro de ligação.'); }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-slate-900">
      <aside className="w-64 bg-slate-950 text-white flex flex-col shrink-0 z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Admin Portal</span>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                activeTab === item.name
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} />
                <span className="font-medium text-sm">{item.name}</span>
              </div>
              {item.badge > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-rose-500 hover:text-white transition-all font-medium text-sm">
            <LogOut size={20} /> Terminar Sessão
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm">
          <h1 className="text-lg font-bold text-slate-800">{activeTab}</h1>
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-indigo-600 relative">
              <Bell size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">AD</div>
              <span className="text-sm font-semibold text-slate-700">Administrador</span>
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          
          {/* VISÃO GERAL */}
          {activeTab === 'Visão Geral' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-slate-500 text-sm font-semibold uppercase mb-1">Utilizadores Ativos</p>
                  <p className="text-3xl font-black text-slate-800">{stats.totalUsers}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-amber-400">
                  <p className="text-slate-500 text-sm font-semibold uppercase mb-1">Senhorios por Aprovar</p>
                  <p className="text-3xl font-black text-slate-800">{stats.senhoriosPendentes}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-sky-400">
                  <p className="text-slate-500 text-sm font-semibold uppercase mb-1">Anúncios por Moderar</p>
                  <p className="text-3xl font-black text-slate-800">{stats.anunciosPendentes}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-emerald-400">
                  <p className="text-slate-500 text-sm font-semibold uppercase mb-1">Receita MRR</p>
                  <p className="text-3xl font-black text-slate-800">{stats.receitaMensal}</p>
                </div>
              </div>
            </div>
          )}

          {/* APROVAR SENHORIOS */}
          {activeTab === 'Aprovar Senhorios' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Senhorios a aguardar verificação</h2>
                  <p className="text-sm text-slate-500">Verifique os documentos antes de permitir que publiquem imóveis.</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs">
                    <tr>
                      <th className="px-6 py-4">Utilizador / Email</th>
                      <th className="px-6 py-4">NIF</th>
                      <th className="px-6 py-4">Data Registo</th>
                      <th className="px-6 py-4">Documentos</th>
                      <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {senhoriosPendentes.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-8 text-slate-400">Sem registos pendentes de momento.</td></tr>
                    ) : (
                      senhoriosPendentes.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-800">{s.nome}</p>
                            <p className="text-slate-500 text-xs">{s.email}</p>
                          </td>
                          <td className="px-6 py-4 font-mono text-slate-600">{s.nif}</td>
                          <td className="px-6 py-4 text-slate-500">{s.data}</td>
                          <td className="px-6 py-4">
                            {s.docs ? (
                              <a href={s.docs} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-indigo-600 w-fit bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 font-medium transition-colors">
                                <FileText size={14} /> Ver Ficheiro
                              </a>
                            ) : (
                              <span className="text-slate-400 italic">Sem ficheiro</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => lidarComSenhorio(s.id, 'aprovado')} className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors" title="Aprovar">
                                <CheckCircle size={18} />
                              </button>
                              <button onClick={() => lidarComSenhorio(s.id, 'rejeitado')} className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors" title="Rejeitar">
                                <XCircle size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MODERAR ANÚNCIOS */}
          {activeTab === 'Moderar Anúncios' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-slate-800">Moderação de Imóveis</h2>
                <p className="text-sm text-slate-500">Imóveis criados por senhorios que requerem aprovação para ficarem públicos.</p>
              </div>
              <div className="divide-y divide-gray-100">
                {imoveisPendentes.length === 0 ? (
                  <p className="text-center py-8 text-slate-400 text-sm">Nenhum anúncio pendente.</p>
                ) : (
                  imoveisPendentes.map((imovel) => (
                    <div key={imovel.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold uppercase">{imovel.tipo}</span>
                          <h3 className="font-bold text-slate-800 text-base">{imovel.morada}</h3>
                        </div>
                        <p className="text-sm text-slate-500 mb-2">Preço: <span className="font-bold text-slate-700">{imovel.preco}</span> • Senhorio: <span className="font-semibold text-slate-700">{imovel.senhorio}</span></p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <button onClick={() => lidarComImovel(imovel.id, 'rejeitado')} className="px-4 py-2 text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors">Rejeitar</button>
                        <button onClick={() => lidarComImovel(imovel.id, 'aprovado')} className="px-4 py-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors shadow-sm shadow-emerald-500/20">Aprovar Anúncio</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'Gestão de Planos' && (
            <div className="flex items-center justify-center h-64 text-slate-400">
              Esta funcionalidade será integrada brevemente com a API de faturação.
            </div>
          )}

        </div>
      </main>
    </div>
  );
}