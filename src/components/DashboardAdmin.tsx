import { useState } from 'react';
import { 
  LayoutDashboard, Users, Megaphone, CreditCard, Search, Bell, 
  Shield, CheckCircle, XCircle, BarChart, User
} from 'lucide-react';

// DADOS DE SIMULAÇÃO
const dadosSenhoriosPendentes = [
  { id: 1, nome: 'António Costa', email: 'antonio.costa@email.com', data: '10 Jun 2024', doc: 'Cartão de Cidadão' },
  { id: 2, nome: 'Beatriz Silva', email: 'beatriz.silva@email.com', data: '11 Jun 2024', doc: 'Passaporte' }
];

const dadosAnunciosPendentes = [
  { id: 1, titulo: 'T2 no Chiado', senhorio: 'Carlos M.', preco: '1400€', data: 'Hoje' },
  { id: 2, titulo: 'Quarto Privado - Polo Universitário', senhorio: 'Diana F.', preco: '400€', data: 'Ontem' }
];

const planosIniciais = [
  { id: 1, nome: 'Básico', preco: 'Gratuito', limite: '1 Anúncio', destaque: false },
  { id: 2, nome: 'Premium', preco: '19.99€/mês', limite: 'Anúncios Ilimitados', destaque: true }
];

const menuItems = [
  { name: 'Visão Geral', icon: LayoutDashboard },
  { name: 'Senhorios', icon: Shield },
  { name: 'Anúncios', icon: Megaphone },
  { name: 'Planos', icon: CreditCard }
];

export default function DashboardAdmin() {
  const [activeTab, setActiveTab] = useState('Visão Geral');
  const [senhorios, setSenhorios] = useState(dadosSenhoriosPendentes);
  const [anuncios, setAnuncios] = useState(dadosAnunciosPendentes);
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const mostrarAviso = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const aprovarSenhorio = (id: number) => {
    setSenhorios(senhorios.filter(s => s.id !== id));
    mostrarAviso('Senhorio aprovado com sucesso!');
  };

  const rejeitarSenhorio = (id: number) => {
    setSenhorios(senhorios.filter(s => s.id !== id));
    mostrarAviso('Pedido de senhorio rejeitado.');
  };

  const aprovarAnuncio = (id: number) => {
    setAnuncios(anuncios.filter(a => a.id !== id));
    mostrarAviso('Anúncio aprovado e publicado na plataforma!');
  };

  const rejeitarAnuncio = (id: number) => {
    setAnuncios(anuncios.filter(a => a.id !== id));
    mostrarAviso('Anúncio rejeitado.');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Visão Geral':
        return (
          <div className="animate-in fade-in duration-500 space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Estado da Plataforma</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-sky-50 flex items-center justify-center text-sky-600"><Users size={24} /></div>
                <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Utilizadores</p><p className="text-2xl font-black text-slate-800">1,245</p></div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><Megaphone size={24} /></div>
                <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Anúncios</p><p className="text-2xl font-black text-slate-800">342</p></div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-amber-600"><Shield size={24} /></div>
                <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pendentes</p><p className="text-2xl font-black text-slate-800">{senhorios.length}</p></div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"><BarChart size={24} /></div>
                <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Receita Mensal</p><p className="text-2xl font-black text-slate-800">2,450€</p></div>
              </div>
            </div>
          </div>
        );
      
      case 'Senhorios':
        return (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Aprovação de Senhorios</h2>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Nome</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Documento Anexado</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Data de Registo</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {senhorios.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">Nenhum senhorio pendente.</td></tr>
                  ) : (
                    senhorios.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-5">
                          <p className="font-bold text-slate-800">{s.nome}</p>
                          <p className="text-xs text-slate-400">{s.email}</p>
                        </td>
                        <td className="px-6 py-5 text-sm font-medium text-slate-600">{s.doc}</td>
                        <td className="px-6 py-5 text-sm font-medium text-slate-600">{s.data}</td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => rejeitarSenhorio(s.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Rejeitar"><XCircle size={20} /></button>
                            <button onClick={() => aprovarSenhorio(s.id)} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors" title="Aprovar"><CheckCircle size={20} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Anúncios':
        return (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Moderação de Anúncios</h2>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Título do Anúncio</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Senhorio</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Preço</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {anuncios.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">Nenhum anúncio pendente para revisão.</td></tr>
                  ) : (
                    anuncios.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-5 font-bold text-slate-800">{a.titulo}</td>
                        <td className="px-6 py-5 text-sm font-medium text-slate-600">{a.senhorio}</td>
                        <td className="px-6 py-5 text-sm font-bold text-slate-700">{a.preco}</td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => rejeitarAnuncio(a.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Rejeitar"><XCircle size={20} /></button>
                            <button onClick={() => aprovarAnuncio(a.id)} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors" title="Aprovar e Publicar"><CheckCircle size={20} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Planos':
        return (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Gestão de Planos de Subscrição</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {planosIniciais.map((plano) => (
                <div key={plano.id} className={`bg-white rounded-3xl border-2 p-8 ${plano.destaque ? 'border-sky-500 shadow-md shadow-sky-500/10' : 'border-slate-200 shadow-sm'}`}>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">{plano.nome}</h3>
                  <p className="text-3xl font-bold text-sky-600 mb-6">{plano.preco}</p>
                  <div className="space-y-3 mb-8">
                    <p className="flex items-center gap-2 text-sm font-medium text-slate-600"><CheckCircle size={18} className="text-emerald-500"/> {plano.limite}</p>
                    <p className="flex items-center gap-2 text-sm font-medium text-slate-600"><CheckCircle size={18} className="text-emerald-500"/> Suporte Base</p>
                  </div>
                  <button className={`w-full py-3 rounded-xl font-bold transition-all ${plano.destaque ? 'bg-sky-600 text-white hover:bg-sky-700 shadow-lg shadow-sky-600/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                    Editar Plano
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-sky-500/20">A</div>
          <span className="text-xl font-bold tracking-tight">ArrendAI <span className="text-sky-400 font-medium text-sm ml-1">Admin</span></span>
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

        {/* PERFIL FIXO DO ADMIN */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg transition-colors">
            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold uppercase">
              AD
            </div>
            <div>
              <p className="text-sm font-medium text-white truncate w-32">
                Administrador
              </p>
              <p className="text-xs text-slate-400">
                Acesso Total
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER IDÊNTICO AO SENHORIO */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 relative z-20">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Pesquisar senhorios, anúncios..." className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all" />
          </div>
          
          <button onClick={() => setShowNotifications(!showNotifications)} className={`p-2 rounded-full relative transition-colors ${showNotifications ? 'bg-sky-50 text-sky-600' : 'text-gray-500 hover:bg-gray-100'}`}>
            <Bell size={20} />
            {/* Indicador de notificações falsas para o Admin */}
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </header>

        {/* ÁREA DE CONTEÚDO */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50 relative">
          {renderContent()}

          {/* AVISO DE SUCESSO (TOAST) */}
          {toastMsg && (
            <div className="fixed bottom-10 right-10 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-50 animate-in fade-in slide-in-from-bottom-6">
              <div className="bg-white/20 p-2 rounded-full"><CheckCircle size={24} className="text-white" /></div>
              <div>
                <p className="font-bold text-sm">{toastMsg}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}