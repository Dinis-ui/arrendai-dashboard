import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Home, FileText, Wallet, Bell, ChevronDown, 
  SlidersHorizontal, Heart, ArrowUpRight, User, MessageSquare, 
  Check, X, UploadCloud, CheckCircle // <-- Adicionados novos ícones
} from 'lucide-react';

// DADOS DE TESTE (MOCK DATA)
const menuItems = [
  { name: 'Pesquisar', icon: Search },
  { name: 'Minhas Candidaturas', icon: FileText },
  { name: 'As Minhas Rendas', icon: Wallet },
];

const distritos = ['Todos', 'Lisboa', 'Porto', 'Setúbal', 'Braga', 'Coimbra', 'Faro', 'Aveiro', 'Funchal'];
const tipologias = ['Todas', 'T0', 'T1', 'T2', 'T3', 'T4+'];
const precos = ['Qualquer', '500€', '750€', '1.000€', '1.500€', '2.000€', '2.500€+'];

const listings = [
  { id: 1, title: 'Apartamento T2 com Varanda', location: 'Príncipe Real, Lisboa', price: 1350, area: 78, tipo: 'T2', photo: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800', tags: ['Varanda', 'Mobilado', 'Animais OK'], available: 'Disponível agora', senhorio: 'Dinis G.' },
  { id: 2, title: 'Studio Moderno no Centro', location: 'Baixa, Porto', price: 820, area: 42, tipo: 'T0', photo: 'https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=800', tags: ['Wi-Fi incluído', 'Mobilado'], available: 'Disponível agora', senhorio: 'Maria S.' },
  { id: 3, title: 'Moradia T3 com Jardim', location: 'Cascais, Setúbal', price: 2100, area: 145, tipo: 'T3', photo: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800', tags: ['Jardim', 'Garagem', 'Piscina'], available: '1 Jun 2025', senhorio: 'Carlos M.' },
  { id: 4, title: 'Apartamento T1 com Vista Rio', location: 'Ribeira, Porto', price: 980, area: 55, tipo: 'T1', photo: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', tags: ['Vista Rio', 'Mobilado'], available: 'Disponível agora', senhorio: 'Ana P.' },
  { id: 5, title: 'Loft T1 em Edifício Histórico', location: 'Alfama, Lisboa', price: 1150, area: 65, tipo: 'T1', photo: 'https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&cs=tinysrgb&w=800', tags: ['Pé-direito alto', 'Histórico'], available: 'Disponível agora', senhorio: 'João R.' },
  { id: 6, title: 'Apartamento T2 Novo', location: 'Braga, Braga', price: 890, area: 88, tipo: 'T2', photo: 'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=800', tags: ['Novo', 'Garagem', 'Ar condicionado'], available: '15 Mai 2025', senhorio: 'Construtora Lda.' },
];

type Filters = {
  distrito: string;
  precoMax: string;
  tipologia: string;
  areaMin: string;
};

function SelectFilter({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void; }) {
  return (
    <div className="relative">
      <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 font-medium focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none pr-8 cursor-pointer"
        >
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

function PropertyCard({ listing, onApply }: { listing: typeof listings[0]; onApply: (imovel: typeof listings[0]) => void }) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col relative">
      {/* O Link envolve apenas a imagem e os dados, deixando o botão independente */}
      <Link to={`/imovel/${listing.id}`} className="block">
        <div className="relative overflow-hidden h-48">
          <img src={listing.photo} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full">{listing.tipo}</span>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              setSaved(!saved);
            }}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors z-10"
          >
            <Heart size={15} className={saved ? 'fill-rose-500 text-rose-500' : 'text-slate-400'} />
          </button>
          <div className="absolute bottom-3 left-3">
            <span className="bg-emerald-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">{listing.available}</span>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <div className="mb-3">
            <h3 className="font-bold text-slate-800 text-base leading-snug mb-1 group-hover:text-sky-600 transition-colors">{listing.title}</h3>
            <div className="flex items-center gap-1 text-slate-500 text-sm">
              <MapPin size={13} /> <span>{listing.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
            <span className="flex items-center gap-1"><Home size={12} />{listing.area} m²</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            {listing.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full font-medium">{tag}</span>
            ))}
          </div>
        </div>
      </Link>
      
      {/* O Footer com o botão fica fora do Link */}
      <div className="px-5 pb-5 mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold text-slate-900">{listing.price.toLocaleString('pt-PT')}€</span>
          <span className="text-slate-400 text-sm">/mês</span>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation(); // Impede que o clique "vaze" para o link do cartão
            onApply(listing); // Passa o objeto do imóvel para o Modal
          }}
          className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          Candidatar-me <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
}

export default function PortalInquilino() {
  const navigate = useNavigate();
  
  // ESTADO DO UTILIZADOR LOGADO
  const [user, setUser] = useState<any>(null);

  const [activeTab, setActiveTab] = useState('Pesquisar');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Filters>({
    distrito: 'Todos',
    precoMax: 'Qualquer',
    tipologia: 'Todas',
    areaMin: '',
  });
  
  const [appliedIds, setAppliedIds] = useState<number[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificacoes, setNotificacoes] = useState([
    { id: 1, titulo: 'Candidatura Aprovada!', desc: 'O senhorio aceitou a tua candidatura.', tempo: 'Há 10 min', lida: false },
    { id: 2, titulo: 'Nova Mensagem', desc: 'João Silva enviou-te uma mensagem.', tempo: 'Há 1 hora', lida: false },
  ]);

  const naoLidas = notificacoes.filter(n => !n.lida).length;

  // ESTADOS DO MODAL DE CANDIDATURA
  const [isCandidaturaOpen, setIsCandidaturaOpen] = useState(false);
  const [candidaturaEnviada, setCandidaturaEnviada] = useState(false);
  const [imovelCandidatura, setImovelCandidatura] = useState<typeof listings[0] | null>(null);

  // LÓGICA PARA IR BUSCAR O NOME DO UTILIZADOR
  useEffect(() => {
    const carregarUtilizador = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const res = await fetch('http://127.0.0.1:8000/api/users/me/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const dados = await res.json();
          setUser(dados);
        } else {
          localStorage.removeItem('accessToken');
          navigate('/login');
        }
      } catch (e) {
        console.error("Erro ao carregar utilizador:", e);
      }
    };
    carregarUtilizador();
  }, [navigate]);

  // Função para abrir o Modal de Candidatura
  const handleOpenCandidatura = (imovel: typeof listings[0]) => {
    setImovelCandidatura(imovel);
    setIsCandidaturaOpen(true);
    setCandidaturaEnviada(false);
  };

  // Função para submeter a candidatura a partir do Modal
  const submeterCandidatura = (e: React.FormEvent) => {
    e.preventDefault();
    setCandidaturaEnviada(true);
    
    if (imovelCandidatura) {
       setAppliedIds((prev) => prev.includes(imovelCandidatura.id) ? prev : [...prev, imovelCandidatura.id]);
       
       // CRIA A CONVERSA E GUARDA NO LOCALSTORAGE
       const novaConversa = {
         id: Date.now(),
         senhorio: imovelCandidatura.senhorio,
         imovel: imovelCandidatura.title,
         avatar: imovelCandidatura.senhorio.substring(0, 2).toUpperCase(),
         unread: true,
         lastMessage: 'Candidatura submetida com sucesso.',
         time: 'Agora',
         history: [
            { sender: 'them', text: `Olá, candidatei-me ao seu imóvel: ${imovelCandidatura.title}`, time: 'Agora' }
         ]
       };
       
       // Vai buscar as conversas que já existem e adiciona a nova
       const conversasGuardadas = JSON.parse(localStorage.getItem('minhasConversas') || '[]');
       localStorage.setItem('minhasConversas', JSON.stringify([novaConversa, ...conversasGuardadas]));
    }

    setTimeout(() => {
      setIsCandidaturaOpen(false);
      setCandidaturaEnviada(false);
      setImovelCandidatura(null);
    }, 3000);
  };
  const setFilter = (key: keyof Filters) => (value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const filtered = listings.filter((l) => {
    const matchSearch = search === '' || l.title.toLowerCase().includes(search.toLowerCase()) || l.location.toLowerCase().includes(search.toLowerCase());
    const matchDistrito = filters.distrito === 'Todos' || l.location.includes(filters.distrito);
    const matchTipo = filters.tipologia === 'Todas' || l.tipo === filters.tipologia;
    const matchPreco = filters.precoMax === 'Qualquer' || l.price <= parseInt(filters.precoMax.replace(/[^0-9]/g, ''), 10);
    const matchArea = filters.areaMin === '' || l.area >= parseInt(filters.areaMin, 10);
    return matchSearch && matchDistrito && matchTipo && matchPreco && matchArea;
  });

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-slate-900 relative">

      <aside className="w-64 bg-slate-900 text-white flex flex-col z-10">
        {/* LOGO */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
            <span className="font-bold text-xl">A</span>
          </div>
          <span className="text-xl font-bold tracking-tight">ArrendAI</span>
        </div>

        {/* MENU */}
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
              <span className="font-medium text-sm">{item.name}</span>
            </button>
          ))}
          <Link to="/mensagens" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-slate-400 hover:bg-slate-800 hover:text-white mt-1">
            <MessageSquare size={20} />
            <span className="font-medium text-sm">Mensagens</span>
          </Link>
        </nav>

        {/* RODAPÉ DO MENU (Perfil Dinâmico) */}
        <div className="p-4 border-t border-slate-800">
          <div 
            onClick={() => navigate('/perfil')}
            className="flex items-center gap-3 px-2 py-2 cursor-pointer hover:bg-slate-800 rounded-lg transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold uppercase">
              {user?.username ? user.username.charAt(0) : '?'}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.username || 'A carregar...'}</p>
              <p className="text-xs text-slate-400">Inquilino</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER (Topo) */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 relative z-20">
          <div>
            <h1 className="text-lg font-bold text-slate-800">Portal do Inquilino</h1>
            <p className="text-xs text-slate-400">Encontra o teu próximo lar</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* COMPONENTE DE NOTIFICAÇÕES */}
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

              {/* DROPDOWN DE NOTIFICAÇÕES */}
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
                        <div key={notif.id} className={`p-4 border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50 ${notif.lida ? 'opacity-60' : 'bg-sky-50/20'}`}>
                          <p className={`text-sm font-bold ${notif.lida ? 'text-slate-700' : 'text-slate-900'}`}>{notif.titulo}</p>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{notif.desc}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wider">{notif.tempo}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* AVATAR DE TOPO DINÂMICO */}
            <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold text-sm uppercase">
              {user?.username ? user.username.charAt(0) : <User size={18} />}
            </div>
          </div>
        </header>

        {/* ÁREA DE CONTEÚDO DINÂMICO */}
        <div className="flex-1 overflow-y-auto">

          {/* ABA PESQUISAR */}
          {activeTab === 'Pesquisar' && (
            <div className="p-8">
              {/* ZONA DE FILTROS */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
                <div className="flex items-center gap-3 mb-5">
                  <SlidersHorizontal size={18} className="text-sky-600" />
                  <h2 className="font-bold text-slate-800">Pesquisa de Imóveis</h2>
                </div>
                <div className="relative mb-5">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Pesquisa por localização ou tipo de imóvel..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <SelectFilter label="Distrito" value={filters.distrito} options={distritos} onChange={setFilter('distrito')} />
                  <SelectFilter label="Preço Máximo" value={filters.precoMax} options={precos} onChange={setFilter('precoMax')} />
                  <SelectFilter label="Tipologia" value={filters.tipologia} options={tipologias} onChange={setFilter('tipologia')} />
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Área Mín. (m²)</label>
                    <input
                      type="number"
                      placeholder="ex: 50"
                      value={filters.areaMin}
                      onChange={(e) => setFilter('areaMin')(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 font-medium focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* LISTAGEM DE IMÓVEIS */}
              <div className="flex items-center justify-between mb-5">
                <p className="text-slate-600 text-sm font-medium"><span className="font-bold text-slate-900">{filtered.length}</span> imóveis encontrados</p>
                <span className="text-xs text-slate-400">Ordenado por: Relevância</span>
              </div>

              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filtered.map((listing) => (
                    <PropertyCard key={listing.id} listing={listing} onApply={handleOpenCandidatura} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"><Home size={28} className="text-gray-400" /></div>
                  <p className="text-slate-700 font-semibold mb-1">Nenhum imóvel encontrado</p>
                  <p className="text-slate-400 text-sm">Tenta ajustar os filtros de pesquisa.</p>
                </div>
              )}
            </div>
          )}

          {/* ABA MINHAS CANDIDATURAS */}
          {activeTab === 'Minhas Candidaturas' && (
            <div className="p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Minhas Candidaturas</h2>
              {appliedIds.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"><FileText size={28} className="text-gray-400" /></div>
                  <p className="text-slate-700 font-semibold mb-1">Sem candidaturas ainda</p>
                  <p className="text-slate-400 text-sm">Candidata-te a imóveis na secção de Pesquisa.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {listings.filter((l) => appliedIds.includes(l.id)).map((l) => (
                    <div key={l.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-5">
                      <img src={l.photo} alt={l.title} className="w-20 h-16 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 truncate">{l.title}</p>
                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5"><MapPin size={12} />{l.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-800">{l.price.toLocaleString('pt-PT')}€<span className="text-slate-400 font-normal text-sm">/mês</span></p>
                        <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full mt-1 inline-block">Em análise</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ABA AS MINHAS RENDAS */}
          {activeTab === 'As Minhas Rendas' && (
            <div className="p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6">As Minhas Rendas</h2>
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"><Wallet size={28} className="text-gray-400" /></div>
                <p className="text-slate-700 font-semibold mb-1">Sem contrato ativo</p>
                <p className="text-slate-400 text-sm">Quando tiveres um arrendamento ativo, as rendas aparecerão aqui.</p>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ========================================== */}
      {/* MODAL DE CANDIDATURA (SOBREPOSTO À PÁGINA) */}
      {/* ========================================== */}
      {isCandidaturaOpen && imovelCandidatura && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-50 border-b border-slate-200 p-5 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Candidatura Oficial</h3>
                <p className="text-sm text-slate-500">{imovelCandidatura.title}</p>
              </div>
              <button onClick={() => setIsCandidaturaOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {candidaturaEnviada ? (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle size={40} />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-2">Candidatura Submetida!</h4>
                  <p className="text-slate-500 leading-relaxed max-w-md mx-auto">
                    O senhorio <b>{imovelCandidatura.senhorio}</b> vai analisar o teu perfil. Se for aceite, o sistema irá gerar automaticamente o teu contrato de arrendamento!
                  </p>
                </div>
              ) : (
                <form onSubmit={submeterCandidatura} className="space-y-6">
                  
                  {/* Mensagem */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">1. Mensagem de Apresentação</label>
                    <p className="text-xs text-slate-500 mb-2">Explica porque és o inquilino ideal para esta casa.</p>
                    <textarea 
                      required
                      placeholder="Ex: Olá, chamo-me Maria, trabalho como engenheira de software e procuro uma casa tranquila..."
                      className="w-full h-28 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 resize-none"
                    ></textarea>
                  </div>

                  {/* Documentos */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">2. Documentos Comprovativos</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 hover:border-sky-300 transition-colors cursor-pointer">
                      <UploadCloud size={28} className="mx-auto text-sky-500 mb-2" />
                      <p className="text-sm font-medium text-slate-700">Clica para enviar ficheiros</p>
                      <p className="text-xs text-slate-400 mt-1">PDF, JPG ou PNG (Máx 10MB)</p>
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <FileText size={16} className="text-slate-400" />
                        <span className="text-sm text-slate-600 flex-1">IRS_2023.pdf</span>
                        <span className="text-xs font-bold text-green-500">Anexado</span>
                      </div>
                      <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <FileText size={16} className="text-slate-400" />
                        <span className="text-sm text-slate-600 flex-1">Recibos_Vencimento.pdf</span>
                        <span className="text-xs font-bold text-green-500">Anexado</span>
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="pt-4 border-t border-slate-100">
                    <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 rounded-xl transition-all shadow-md text-lg">
                      Confirmar e Enviar Candidatura
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">
                       Os teus documentos estão seguros e encriptados.
                    </p>
                  </div>

                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}