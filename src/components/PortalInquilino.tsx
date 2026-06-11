import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Home, FileText, Wallet, Bell, ChevronDown, 
  SlidersHorizontal, Heart, ArrowUpRight, User, MessageSquare, 
  Check, X, UploadCloud, CheckCircle, Trash2
} from 'lucide-react';

const menuItems = [
  { name: 'Pesquisar', icon: Search },
  { name: 'Minhas Candidaturas', icon: FileText },
  { name: 'As Minhas Rendas', icon: Wallet },
];

const distritos = ['Todos', 'Lisboa', 'Porto', 'Setúbal', 'Braga', 'Coimbra', 'Faro', 'Aveiro', 'Funchal'];
const tipologias = ['Todas', 'Apartamento', 'Moradia', 'Quarto']; // Atualizado para bater certo com a BD
const precos = ['Qualquer', '500€', '750€', '1.000€', '1.500€', '2.000€', '2.500€+'];

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

function PropertyCard({ listing, onApply }: { listing: any; onApply: (imovel: any) => void }) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col relative">
      {/* O LINK VOLTOU PARA AQUI! Assim ao clicares na foto ou título vais para os detalhes */}
      <Link to={`/imovel/${listing.id}`} className="block">
        <div className="relative overflow-hidden h-48">
          <img src={listing.photo} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full capitalize">{listing.tipo}</span>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault(); // Impede de abrir a página ao clicar no coração
              e.stopPropagation();
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
            {listing.tags.map((tag: string) => (
              <span key={tag} className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full font-medium">{tag}</span>
            ))}
          </div>
        </div>
      </Link>
      
      <div className="px-5 pb-5 mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold text-slate-900">{listing.price.toLocaleString('pt-PT')}€</span>
          <span className="text-slate-400 text-sm">/mês</span>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation(); // Impede de abrir a página de detalhes ao clicar em Candidatar
            onApply(listing);
          }}
          className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          Candidatar <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
}

export default function PortalInquilino() {
  const navigate = useNavigate();
  
  // ESTADOS PRINCIPAIS
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Pesquisar');
  const [listings, setListings] = useState<any[]>([]); // <-- NOVO ESTADO PARA AS CASAS REAIS
  
  // PESQUISA E FILTROS
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
  ]);

  const naoLidas = notificacoes.filter(n => !n.lida).length;

  // ESTADOS DO MODAL DE CANDIDATURA
  const [isCandidaturaOpen, setIsCandidaturaOpen] = useState(false);
  const [candidaturaEnviada, setCandidaturaEnviada] = useState(false);
  const [imovelCandidatura, setImovelCandidatura] = useState<any>(null);
  const [mensagemCandidatura, setMensagemCandidatura] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ficheiros, setFicheiros] = useState<File[]>([]);

  // 1. CARREGAR UTILIZADOR
  useEffect(() => {
    const carregarUtilizador = async () => {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const res = await fetch('http://127.0.0.1:8000/api/users/me/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setUser(await res.json());
        } else {
          navigate('/login');
        }
      } catch (e) {
        console.error("Erro ao carregar utilizador:", e);
      }
    };
    carregarUtilizador();
  }, [navigate]);

  // 2. CARREGAR IMÓVEIS REAIS DO BACKEND (O SEGREDO DA MONTRA)
  useEffect(() => {
    const buscarImoveis = async () => {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      if (!token) return;

      try {
        const response = await fetch('http://127.0.0.1:8000/api/users/propriedades/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const dados = await response.json();
          
          // Mapeamos os dados que vêm do Django para encaixar perfeitamente no teu PropertyCard visual
          const formatados = dados.map((p: any) => ({
            id: p.id,
            title: p.titulo_anuncio || `Fantástico imóvel em ${p.morada}`,
            location: p.morada,
            price: Number(p.preco_anuncio || p.valor_estimado),
            area: p.area,
            tipo: p.tipo_casa || 'Indisponível',
            photo: p.foto_principal || 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
            tags: ['Verificado', 'Online'],
            available: 'Disponível Agora',
            senhorio: p.senhorio // Se o backend retornar o ID
          }));
          
          setListings(formatados);
        }
      } catch (error) {
        console.error("Erro a carregar anúncios:", error);
      }
    };

    buscarImoveis();
  }, []);

  const handleOpenCandidatura = (imovel: any) => {
    setImovelCandidatura(imovel);
    setMensagemCandidatura('');
    setFicheiros([]);
    setIsCandidaturaOpen(true);
    setCandidaturaEnviada(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const validFiles: File[] = [];

      filesArray.forEach(file => {
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        if (!validTypes.includes(file.type)) {
          alert(`O ficheiro "${file.name}" tem um formato inválido. Apenas PDF, JPG e PNG são permitidos.`);
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          alert(`O ficheiro "${file.name}" é demasiado grande. O tamanho máximo é 10MB.`);
          return;
        }
        validFiles.push(file);
      });
      setFicheiros(prev => [...prev, ...validFiles]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removerFicheiro = (indexToRemove: number) => {
    setFicheiros(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const submeterCandidatura = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imovelCandidatura) return;

    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/tenancies/applications/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          property: imovelCandidatura.id,
          message: mensagemCandidatura
        })
      });

      if (response.ok) {
        setCandidaturaEnviada(true);
        setAppliedIds((prev) => prev.includes(imovelCandidatura.id) ? prev : [...prev, imovelCandidatura.id]);
        setTimeout(() => {
          setIsCandidaturaOpen(false);
          setActiveTab('Minhas Candidaturas');
        }, 3000);
      } else {
        alert("Erro ao enviar candidatura.");
      }
    } catch (error) {
      console.error("Erro na comunicação:", error);
    }
  };

  const setFilter = (key: keyof Filters) => (value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  // FILTRAGEM COM A NOVA LISTA
  const filtered = listings.filter((l) => {
    const matchSearch = search === '' || l.title.toLowerCase().includes(search.toLowerCase()) || l.location.toLowerCase().includes(search.toLowerCase());
    const matchDistrito = filters.distrito === 'Todos' || l.location.includes(filters.distrito);
    // Tipologia agora ignora maiúsculas/minúsculas para bater certo com a BD
    const matchTipo = filters.tipologia === 'Todas' || l.tipo.toLowerCase() === filters.tipologia.toLowerCase();
    const matchPreco = filters.precoMax === 'Qualquer' || l.price <= parseInt(filters.precoMax.replace(/[^0-9]/g, ''), 10);
    const matchArea = filters.areaMin === '' || l.area >= parseInt(filters.areaMin, 10);
    return matchSearch && matchDistrito && matchTipo && matchPreco && matchArea;
  });

  const nomeExibicao = user?.username || user?.first_name || user?.email || 'Utilizador';

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-slate-900 relative">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col z-10">
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
              <span className="font-medium text-sm">{item.name}</span>
            </button>
          ))}
          <Link to="/mensagens" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-slate-400 hover:bg-slate-800 hover:text-white mt-1">
            <MessageSquare size={20} />
            <span className="font-medium text-sm">Mensagens</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div 
            onClick={() => navigate('/perfil')}
            className="flex items-center gap-3 px-2 py-2 cursor-pointer hover:bg-slate-800 rounded-lg transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold uppercase shrink-0">
              {user ? nomeExibicao.charAt(0) : '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user ? nomeExibicao : 'A carregar...'}</p>
              <p className="text-xs text-slate-400">Inquilino</p>
            </div>
          </div>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 relative z-20">
          <div>
            <h1 className="text-lg font-bold text-slate-800">Portal do Inquilino</h1>
            <p className="text-xs text-slate-400">Encontra o teu próximo lar</p>
          </div>
          
          <div className="flex items-center gap-3">
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
            </div>
            <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold text-sm uppercase shrink-0">
              {user ? nomeExibicao.charAt(0) : <User size={18} />}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-slate-50">
          {activeTab === 'Pesquisar' && (
            <div className="p-8">
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

              <div className="flex items-center justify-between mb-5">
                <p className="text-slate-600 text-sm font-medium"><span className="font-bold text-slate-900">{filtered.length}</span> anúncios reais online</p>
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
                  <p className="text-slate-700 font-semibold mb-1">Nenhum imóvel disponível</p>
                  <p className="text-slate-400 text-sm">O senhorio ainda não publicou nada ou os filtros estão muito apertados.</p>
                </div>
              )}
            </div>
          )}

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

      {/* MODAL DE CANDIDATURA */}
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
                    O teu perfil foi enviado ao senhorio com sucesso. Acompanha o estado no separador "Minhas Candidaturas"!
                  </p>
                </div>
              ) : (
                <form onSubmit={submeterCandidatura} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">1. Mensagem de Apresentação</label>
                    <textarea 
                      required
                      value={mensagemCandidatura}
                      onChange={(e) => setMensagemCandidatura(e.target.value)}
                      placeholder="Ex: Olá, chamo-me Maria, procuro uma casa tranquila..."
                      className="w-full h-28 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 resize-none"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">2. Documentos Comprovativos</label>
                    <input 
                      type="file" multiple className="hidden" ref={fileInputRef} 
                      accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} 
                    />
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 hover:border-sky-300 transition-colors cursor-pointer"
                    >
                      <UploadCloud size={28} className="mx-auto text-sky-500 mb-2" />
                      <p className="text-sm font-medium text-slate-700">Clica para enviar ficheiros</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 rounded-xl transition-all shadow-md text-lg">
                      Confirmar e Enviar Candidatura
                    </button>
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