import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Users, Home, CreditCard, Activity, 
  CheckCircle, XCircle, Search, FileText, Bell, LogOut, MapPin, Edit3, Save, X
} from 'lucide-react';

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Visão Geral');
  
  // STATS E DADOS DO DJANGO
  const [stats, setStats] = useState({
    totalUsers: 0, senhoriosPendentes: 0, propriedadesPendentes: 0, receitaMensal: '0€'
  });
  const [senhoriosPendentes, setSenhoriosPendentes] = useState<any[]>([]);
  const [imoveisPendentes, setImoveisPendentes] = useState<any[]>([]);
  const [planos, setPlanos] = useState<any[]>([]);

  // ESTADO PARA EDIÇÃO DE PLANOS
  const [editingPlano, setEditingPlano] = useState<any | null>(null);

  const carregarDados = async () => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (!token) { navigate('/login'); return; }

    try {
      const res = await fetch('https://arrendai-dashboard.onrender.com](https://arrendai-dashboard.onrender.com/api/users/admin/dashboard/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setSenhoriosPendentes(data.senhorios);
        setImoveisPendentes(data.imoveis);
        setPlanos(data.planos);
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
    { name: 'Moderar Propriedades', icon: Home, badge: stats.propriedadesPendentes },
    { name: 'Gestão de Planos', icon: CreditCard },
  ];

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  // --- AÇÕES REAIS PARA SENHORIOS ---
  const lidarComSenhorio = async (id: number, acao: 'aprovado' | 'rejeitado') => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (!window.confirm(`Tem a certeza que deseja ${acao} este senhorio?`)) return;

    try {
      const res = await fetch(`https://arrendai-dashboard.onrender.com](https://arrendai-dashboard.onrender.com/api/users/admin/senhorio/${id}/`, {
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

  // --- AÇÕES REAIS PARA PROPRIEDADES ---
  const lidarComImovel = async (id: number, acao: 'aprovado' | 'rejeitado') => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (!window.confirm(`Tem a certeza que deseja ${acao} esta propriedade?`)) return;

    try {
      const res = await fetch(`https://arrendai-dashboard.onrender.com](https://arrendai-dashboard.onrender.com/api/users/admin/imovel/${id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ acao: acao })
      });

      if (res.ok) {
        setImoveisPendentes(prev => prev.filter(i => i.id !== id));
        setStats(prev => ({ ...prev, propriedadesPendentes: prev.propriedadesPendentes - 1 }));
      }
    } catch (e) { alert('Erro de ligação.'); }
  };

  // --- LÓGICA DE SALVAR O PLANO EDITADO ---
  const salvarPlano = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    try {
      const res = await fetch(`https://arrendai-dashboard.onrender.com](https://arrendai-dashboard.onrender.com/api/users/planos/${editingPlano.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(editingPlano)
      });
      if (res.ok) {
        alert("Plano atualizado com sucesso!");
        setEditingPlano(null);
        carregarDados(); // Recarrega os dados com os novos preços
      } else {
        alert("Erro ao atualizar o plano.");
      }
    } catch (e) { alert("Erro de ligação."); }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-slate-900">
      
      {/* SIDEBAR */}
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

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER */}
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

        {/* ÁREA DE CONTEÚDO */}
        <div className="flex-1 p-8 overflow-y-auto">
          
          {/* ABA 1: VISÃO GERAL */}
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
                  <p className="text-slate-500 text-sm font-semibold uppercase mb-1">Casas por Moderar</p>
                  <p className="text-3xl font-black text-slate-800">{stats.propriedadesPendentes}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-emerald-400">
                  <p className="text-slate-500 text-sm font-semibold uppercase mb-1">Receita MRR</p>
                  <p className="text-3xl font-black text-slate-800">{stats.receitaMensal}</p>
                </div>
              </div>
            </div>
          )}

          {/* ABA 2: APROVAR SENHORIOS */}
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

          {/* ABA 3: MODERAR PROPRIEDADES */}
          {activeTab === 'Moderar Propriedades' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in">
              <div className="p-6 border-b border-gray-100 bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-800">Moderação de Propriedades</h2>
                <p className="text-sm text-slate-500">Analise os detalhes das propriedades submetidas antes de estas poderem ser anunciadas.</p>
              </div>
              <div className="divide-y divide-gray-100">
                {imoveisPendentes.length === 0 ? (
                  <p className="text-center py-12 text-slate-400 text-sm">Nenhuma propriedade pendente de moderação.</p>
                ) : (
                  imoveisPendentes.map((imovel) => (
                    <div key={imovel.id} className="p-6 flex flex-col xl:flex-row xl:items-start justify-between gap-6 hover:bg-slate-50/50 transition-colors">
                      <div className="flex-1">
                        
                        {/* Cabeçalho da Propriedade */}
                        <div className="flex items-center gap-3 mb-3">
                          <span className="bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider">{imovel.tipo}</span>
                          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                            <MapPin size={16} className="text-slate-400" /> {imovel.morada}
                          </h3>
                        </div>
                        
                        {/* Grelha de Detalhes Técnicos */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 bg-white border border-gray-100 p-4 rounded-xl">
                          <div>
                            <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Senhorio</p>
                            <p className="text-sm font-bold text-slate-800">{imovel.senhorio}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Área Total</p>
                            <p className="text-sm font-bold text-slate-800">{imovel.area} m²</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Valor Estimado</p>
                            <p className="text-sm font-bold text-slate-800">{imovel.preco}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Data de Registo</p>
                            <p className="text-sm font-bold text-slate-800">{imovel.data}</p>
                          </div>
                        </div>

                        {/* Descrição e Comodidades */}
                        <div className="space-y-3">
                          <div>
                            <span className="text-xs font-bold text-slate-500 uppercase">Descrição:</span>
                            <p className="text-sm text-slate-600 mt-1 line-clamp-2">{imovel.descricao || 'Sem descrição fornecida.'}</p>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-500 uppercase">Comodidades:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {imovel.comodidades ? imovel.comodidades.split(',').map((comodidade: string, index: number) => (
                                <span key={index} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md font-medium">
                                  {comodidade.trim()}
                                </span>
                              )) : <span className="text-sm text-slate-400">Nenhuma comodidade listada.</span>}
                            </div>
                          </div>
                        </div>

                      </div>
                      
                      {/* Botões de Ação */}
                      <div className="flex flex-row xl:flex-col items-center xl:items-end gap-3 shrink-0 pt-2 xl:pt-0 border-t xl:border-t-0 border-gray-100">
                        <button 
                          onClick={() => lidarComImovel(imovel.id, 'aprovado')} 
                          className="w-full xl:w-auto px-6 py-2.5 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={16} /> Aprovar Propriedade
                        </button>
                        <button 
                          onClick={() => lidarComImovel(imovel.id, 'rejeitado')} 
                          className="w-full xl:w-auto px-6 py-2.5 text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                          <XCircle size={16} /> Rejeitar e Apagar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ABA 4: GESTÃO DE PLANOS */}
          {activeTab === 'Gestão de Planos' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-slate-50/50">
                  <h2 className="text-lg font-bold text-slate-800">Planos de Subscrição</h2>
                  <p className="text-sm text-slate-500">Edite os preços e limites de cada nível de conta.</p>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {planos.length === 0 ? (
                    <div className="col-span-3 text-center py-8 text-slate-400">Ainda não existem planos criados na base de dados.</div>
                  ) : (
                    planos.map(plano => (
                      <div key={plano.id} className="border border-slate-200 rounded-2xl p-6 bg-white hover:border-indigo-300 transition-all relative group shadow-sm">
                        <button 
                          onClick={() => setEditingPlano(plano)}
                          className="absolute top-4 right-4 p-2 bg-slate-100 text-slate-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-600 hover:text-white"
                        >
                          <Edit3 size={16} />
                        </button>
                        <h3 className="text-xl font-black text-slate-800 mb-4">{plano.nome}</h3>
                        <div className="space-y-3">
                          <p className="text-sm text-slate-600 flex justify-between"><span>Preço:</span> <span className="font-bold text-indigo-600">{plano.preco}€</span></p>
                          <p className="text-sm text-slate-600 flex justify-between"><span>Máx. Propriedades:</span> <span className="font-bold">{plano.max_propriedades}</span></p>
                          <p className="text-sm text-slate-600 flex justify-between"><span>Máx. Anúncios:</span> <span className="font-bold">{plano.max_anuncios}</span></p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* MODAL: FORMULÁRIO DE EDIÇÃO */}
              {editingPlano && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-50/50">
                      <h3 className="text-xl font-bold text-indigo-900">Editar Plano: {editingPlano.nome}</h3>
                      <button onClick={() => setEditingPlano(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                    </div>
                    <form onSubmit={salvarPlano} className="p-8 space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nome do Plano</label>
                          <input type="text" value={editingPlano.nome} onChange={e => setEditingPlano({...editingPlano, nome: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none" required />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Preço Mensal (€)</label>
                          <input type="number" step="0.01" value={editingPlano.preco} onChange={e => setEditingPlano({...editingPlano, preco: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none" required />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Limite Casas</label>
                          <input type="number" value={editingPlano.max_propriedades} onChange={e => setEditingPlano({...editingPlano, max_propriedades: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none" required />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Limite Anúncios</label>
                          <input type="number" value={editingPlano.max_anuncios} onChange={e => setEditingPlano({...editingPlano, max_anuncios: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none" required />
                        </div>
                      </div>
                      <div className="pt-4 flex gap-3">
                        <button type="button" onClick={() => setEditingPlano(null)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl transition-all">Cancelar</button>
                        <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"><Save size={18} /> Salvar Alterações</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}