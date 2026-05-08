import { useState } from 'react';
import { Link } from 'react-router-dom'; // Importacao adicionada para permitir a navegacao
import {
  Search,
  MapPin,
  Home,
  FileText,
  Wallet,
  Bell,
  ChevronDown,
  SlidersHorizontal,
  Heart,
  ArrowUpRight,
  User,
} from 'lucide-react';

const menuItems = [
  { name: 'Pesquisar', icon: Search },
  { name: 'Minhas Candidaturas', icon: FileText },
  { name: 'As Minhas Rendas', icon: Wallet },
];

const distritos = ['Todos', 'Lisboa', 'Porto', 'Setúbal', 'Braga', 'Coimbra', 'Faro', 'Aveiro', 'Funchal'];
const tipologias = ['Todas', 'T0', 'T1', 'T2', 'T3', 'T4+'];
const precos = ['Qualquer', '500€', '750€', '1.000€', '1.500€', '2.000€', '2.500€+'];

const listings = [
  {
    id: 1,
    title: 'Apartamento T2 com Varanda',
    location: 'Príncipe Real, Lisboa',
    price: 1350,
    area: 78,
    tipo: 'T2',
    photo: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Varanda', 'Mobilado', 'Animais OK'],
    available: 'Disponível agora',
  },
  {
    id: 2,
    title: 'Studio Moderno no Centro',
    location: 'Baixa, Porto',
    price: 820,
    area: 42,
    tipo: 'T0',
    photo: 'https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Wi-Fi incluído', 'Mobilado'],
    available: 'Disponível agora',
  },
  {
    id: 3,
    title: 'Moradia T3 com Jardim',
    location: 'Cascais, Setúbal',
    price: 2100,
    area: 145,
    tipo: 'T3',
    photo: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Jardim', 'Garagem', 'Piscina'],
    available: '1 Jun 2025',
  },
  {
    id: 4,
    title: 'Apartamento T1 com Vista Rio',
    location: 'Ribeira, Porto',
    price: 980,
    area: 55,
    tipo: 'T1',
    photo: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Vista Rio', 'Mobilado'],
    available: 'Disponível agora',
  },
  {
    id: 5,
    title: 'Loft T1 em Edifício Histórico',
    location: 'Alfama, Lisboa',
    price: 1150,
    area: 65,
    tipo: 'T1',
    photo: 'https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Pé-direito alto', 'Histórico'],
    available: 'Disponível agora',
  },
  {
    id: 6,
    title: 'Apartamento T2 Novo',
    location: 'Braga, Braga',
    price: 890,
    area: 88,
    tipo: 'T2',
    photo: 'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Novo', 'Garagem', 'Ar condicionado'],
    available: '15 Mai 2025',
  },
];

type Filters = {
  distrito: string;
  precoMax: string;
  tipologia: string;
  areaMin: string;
};

function SelectFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
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

function PropertyCard({ listing, onApply }: { listing: typeof listings[0]; onApply: (id: number) => void }) {
  const [saved, setSaved] = useState(false);

  return (
    
    <Link 
      to={`/imovel/${listing.id}`}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col cursor-pointer block"
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={listing.photo}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            {listing.tipo}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault(); // Impede que o clique no botao de favorito ative o link da pagina
            setSaved(!saved);
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart size={15} className={saved ? 'fill-rose-500 text-rose-500' : 'text-slate-400'} />
        </button>
        <div className="absolute bottom-3 left-3">
          <span className="bg-emerald-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {listing.available}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="mb-3">
          <h3 className="font-bold text-slate-800 text-base leading-snug mb-1">{listing.title}</h3>
          <div className="flex items-center gap-1 text-slate-500 text-sm">
            <MapPin size={13} />
            <span>{listing.location}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1">
            <Home size={12} />
            {listing.area} m²
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          {listing.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full font-medium">{tag}</span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div>
            <span className="text-2xl font-bold text-slate-900">{listing.price.toLocaleString('pt-PT')}€</span>
            <span className="text-slate-400 text-sm">/mês</span>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault(); // Impede que o clique no botao de candidatar ative o link geral
              onApply(listing.id);
            }}
            className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            Candidatar-me <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </Link>
  );
}

export default function PortalInquilino() {
  const [activeTab, setActiveTab] = useState('Pesquisar');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Filters>({
    distrito: 'Todos',
    precoMax: 'Qualquer',
    tipologia: 'Todas',
    areaMin: '',
  });
  const [appliedIds, setAppliedIds] = useState<number[]>([]);

  const handleApply = (id: number) => {
    setAppliedIds((prev) => prev.includes(id) ? prev : [...prev, id]);
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
              <span className="font-medium text-sm">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold">
              MF
            </div>
            <div>
              <p className="text-sm font-medium">Maria Ferreira</p>
              <p className="text-xs text-slate-400">Inquilina</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0">
          <div>
            <h1 className="text-lg font-bold text-slate-800">Portal do Inquilino</h1>
            <p className="text-xs text-slate-400">Encontra o teu próximo lar</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
              <Bell size={20} />
            </button>
            <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold text-sm">
              <User size={18} />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">

          {activeTab === 'Pesquisar' && (
            <div className="p-8">

              {/* SEARCH BAR */}
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

              {/* RESULTS HEADER */}
              <div className="flex items-center justify-between mb-5">
                <p className="text-slate-600 text-sm font-medium">
                  <span className="font-bold text-slate-900">{filtered.length}</span> imóveis encontrados
                </p>
                <span className="text-xs text-slate-400">Ordenado por: Relevância</span>
              </div>

              {/* GRID */}
              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filtered.map((listing) => (
                    <PropertyCard key={listing.id} listing={listing} onApply={handleApply} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Home size={28} className="text-gray-400" />
                  </div>
                  <p className="text-slate-700 font-semibold mb-1">Nenhum imóvel encontrado</p>
                  <p className="text-slate-400 text-sm">Tenta ajustar os filtros de pesquisa.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Minhas Candidaturas' && (
            <div className="p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Minhas Candidaturas</h2>
              {appliedIds.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FileText size={28} className="text-gray-400" />
                  </div>
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
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Wallet size={28} className="text-gray-400" />
                </div>
                <p className="text-slate-700 font-semibold mb-1">Sem contrato ativo</p>
                <p className="text-slate-400 text-sm">Quando tiveres um arrendamento ativo, as rendas aparecerão aqui.</p>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}