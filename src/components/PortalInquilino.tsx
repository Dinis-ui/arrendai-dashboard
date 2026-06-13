import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Home, FileText, Wallet, Bell, ChevronDown, 
  SlidersHorizontal, Heart, ArrowUpRight, User, MessageSquare, 
  X, UploadCloud, CheckCircle, Trash2, CreditCard, Smartphone, Lock,
  LogOut, AlertCircle
} from 'lucide-react';

const menuItems = [
  { name: 'Pesquisar', icon: Search },
  { name: 'Minhas Candidaturas', icon: FileText },
  { name: 'As Minhas Rendas', icon: Wallet },
];

const distritos = ['Todos', 'Lisboa', 'Porto', 'Setúbal', 'Braga', 'Coimbra', 'Faro', 'Aveiro', 'Funchal'];
const tipologias = ['Todas', 'Apartamento', 'Moradia', 'Quarto']; 
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
      <Link to={`/imovel/${listing.id}`} className="block">
        <div className="relative overflow-hidden h-48">
          <img src={listing.photo} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full capitalize">{listing.tipo}</span>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault(); 
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
            e.stopPropagation(); 
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
  const [listings, setListings] = useState<any[]>([]); 
  const [candidaturasReais, setCandidaturasReais] = useState<any[]>([]); 
  const [rendasReais, setRendasReais] = useState<any[]>([]);

  // ESTADOS DO PERFIL (Abas Internas)
  const [profileTab, setProfileTab] = useState('conta'); 
  const [editUsername, setEditUsername] = useState('');
  const [editTelefone, setEditTelefone] = useState('');
  const [editNif, setEditNif] = useState('');
  const [editIban, setEditIban] = useState('');
  
  // ESTADOS DE PASSWORD
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // PESQUISA E FILTROS
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Filters>({
    distrito: 'Todos',
    precoMax: 'Qualquer',
    tipologia: 'Todas',
    areaMin: '',
  });
  
  // ESTADOS DE NOTIFICAÇÕES (AGORA REAIS)
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificacoes, setNotificacoes] = useState<any[]>([]);
  const naoLidas = notificacoes.filter(n => !n.lida).length;

  // ESTADOS DO MODAL DE CANDIDATURA
  const [isCandidaturaOpen, setIsCandidaturaOpen] = useState(false);
  const [candidaturaEnviada, setCandidaturaEnviada] = useState(false);
  const [imovelCandidatura, setImovelCandidatura] = useState<any>(null);
  const [mensagemCandidatura, setMensagemCandidatura] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ficheiros, setFicheiros] = useState<File[]>([]);

  // ESTADOS DO MODAL DE PAGAMENTO
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [rendaAPagar, setRendaAPagar] = useState<any>(null);
  const [metodoPagamento, setMetodoPagamento] = useState<'mbway' | 'cartao'>('mbway');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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
          const dados = await res.json();
          setUser(dados);
          setEditUsername(dados.username || '');
          setEditTelefone(dados.telefone || '');
          setEditNif(dados.nif || '');
          setEditIban(dados.iban || '');
        } else {
          navigate('/login');
        }
      } catch (e) {
        console.error("Erro ao carregar utilizador:", e);
      }
    };
    carregarUtilizador();
  }, [navigate]);

  // VERIFICAR SE O PERFIL ESTÁ INCOMPLETO
  const isPerfilIncompleto = user && (!user.telefone || !user.nif || !user.iban);

  // 1B. CARREGAR NOTIFICAÇÕES
  const carregarNotificacoes = async () => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (!token) return;
    try {
      const res = await fetch('http://127.0.0.1:8000/api/users/notificacoes/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setNotificacoes(await res.json());
      }
    } catch (error) {
      console.error("Erro a carregar notificações:", error);
    }
  };

  useEffect(() => {
    carregarNotificacoes();
    // Atualiza automaticamente de 30 em 30 segundos
    const intervalo = setInterval(carregarNotificacoes, 30000);
    return () => clearInterval(intervalo);
  }, []);

  // 1C. MARCAR COMO LIDAS AO ABRIR O SINO
  const handleToggleNotificacoes = async () => {
    const newState = !showNotifications;
    setShowNotifications(newState);

    if (newState && naoLidas > 0) {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      try {
        await fetch('http://127.0.0.1:8000/api/users/notificacoes/lidas/', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        // Atualiza a interface instantaneamente sem esperar pela próxima pesquisa de 30s
        setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })));
      } catch (error) {
        console.error("Erro a marcar notificações como lidas", error);
      }
    }
  };

  // 1D. TERMINAR SESSÃO
  const terminarSessao = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    navigate('/login');
  };

  // 2A. ATUALIZAR CONTA
  const guardarConta = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/me/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          username: editUsername,
          telefone: editTelefone,
          nif: editNif,
          iban: editIban
        })
      });

      if (response.ok) {
        const dadosNovos = await response.json();
        setUser(dadosNovos); // Atualiza o utilizador e a variável isPerfilIncompleto reage na hora!
        alert("Dados guardados com sucesso!");
      } else {
        const erro = await response.json();
        alert(`Erro ao guardar: ${JSON.stringify(erro)}`);
      }
    } catch (error) {
      console.error('Erro de rede:', error);
    }
  };

  // 2B. ATUALIZAR PASSWORD
  const atualizarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert("A nova password e a confirmação não coincidem!");
      return;
    }

    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/change-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          old_password: oldPassword, 
          new_password: newPassword 
        })
      });

      if (response.ok) {
        alert("Password atualizada com sucesso! Por favor, faz login novamente.");
        terminarSessao();
      } else {
        const erro = await response.json();
        alert(`Erro ao alterar password: ${JSON.stringify(erro)}`);
      }
    } catch (error) {
      console.error('Erro de rede:', error);
    }
  };

  // 3. CARREGAR IMÓVEIS REAIS
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
          const formatados = dados.map((p: any) => ({
            id: p.id,
            title: p.titulo_anuncio || `Fantástico imóvel em ${p.morada}`,
            location: p.morada,
            price: Number(p.preco_anuncio || p.valor_estimado),
            area: p.area,
            tipo: p.tipo_casa || 'Indisponível',
            photo: p.foto_principal || 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
            tags: (p.comodidades && typeof p.comodidades === 'string') 
                  ? p.comodidades.split(', ').slice(0, 2) 
                  : ['Verificado', 'Online'],
            available: 'Disponível Agora',
            senhorio: p.senhorio 
          }));
          setListings(formatados);
        }
      } catch (error) {
        console.error("Erro a carregar anúncios:", error);
      }
    };
    buscarImoveis();
  }, []);

  // 4. CARREGAR CANDIDATURAS REAIS
  useEffect(() => {
    if (activeTab === 'Minhas Candidaturas') {
      const carregarAsMinhasCandidaturas = async () => {
        const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        if (!token) return;
        try {
          const res = await fetch('http://127.0.0.1:8000/api/tenancies/applications/', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const dados = await res.json();
            setCandidaturasReais(dados);
          }
        } catch (error) {
          console.error("Erro ao carregar as candidaturas:", error);
        }
      };
      carregarAsMinhasCandidaturas();
    }
  }, [activeTab]);

  // 5. CARREGAR RENDAS (CONTRATOS ATIVOS)
  useEffect(() => {
    if (activeTab === 'As Minhas Rendas') {
      const carregarRendas = async () => {
        const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        if (!token) return;
        try {
          const res = await fetch('http://127.0.0.1:8000/api/tenancies/tenancies/', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            setRendasReais(await res.json());
          }
        } catch (error) {
          console.error("Erro ao carregar as rendas:", error);
        }
      };
      carregarRendas();
    }
  }, [activeTab]);

  // AÇÕES DE PAGAMENTO
  const handleOpenPagamento = (renda: any) => {
    setRendaAPagar(renda);
    setIsPaymentModalOpen(true);
  };

  const processarPagamento = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    
    setTimeout(async () => {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/tenancies/tenancies/${rendaAPagar.id}/pay/`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          setRendasReais(prev => prev.map(r => r.id === rendaAPagar.id ? { ...r, payment_status: 'pago' } : r));
          setIsPaymentModalOpen(false);
          alert("Pagamento processado com sucesso!");
        }
      } catch (error) {
        alert("Erro na ligação ao banco.");
      } finally {
        setIsProcessingPayment(false);
      }
    }, 1500);
  };

  // APAGAR CANDIDATURA
  const handleApagarCandidatura = async (id: number) => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (window.confirm("Tens a certeza que queres retirar a tua candidatura?")) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/tenancies/applications/${id}/`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok || response.status === 204) {
          setCandidaturasReais(prev => prev.filter(c => c.id !== id));
        }
      } catch (error) {
        console.error("Erro ao apagar:", error);
      }
    }
  };

  // CANDIDATURA (MODAL E ENVIO) - AGORA COM BLOQUEIO DE SEGURANÇA!
  const handleOpenCandidatura = (imovel: any) => {
    // 🚨 Verifica se o Perfil está incompleto
    if (isPerfilIncompleto) {
      alert("Atenção: Precisas de completar o teu perfil (NIF, IBAN e Telefone) antes de poderes enviar uma candidatura para um imóvel.");
      setActiveTab('Perfil');
      setProfileTab('conta');
      return;
    }

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
        setTimeout(() => {
          setIsCandidaturaOpen(false);
          setActiveTab('Minhas Candidaturas');
        }, 3000);
      } else {
        const erroData = await response.json();
        if (erroData.erro) {
          alert(Array.isArray(erroData.erro) ? erroData.erro[0] : erroData.erro);
        } else if (erroData.non_field_errors) {
          alert(erroData.non_field_errors[0]); 
        } else {
          alert("Não foi possível enviar a candidatura. Verifica se já te candidataste a esta casa.");
        }
      }
    } catch (error) {
      console.error("Erro na comunicação:", error);
      alert("Erro de ligação ao servidor.");
    }
  };

  const setFilter = (key: keyof Filters) => (value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const filtered = listings.filter((l) => {
    const matchSearch = search === '' || l.title.toLowerCase().includes(search.toLowerCase()) || l.location.toLowerCase().includes(search.toLowerCase());
    const matchDistrito = filters.distrito === 'Todos' || l.location.includes(filters.distrito);
    const matchTipo = filters.tipologia === 'Todas' || l.tipo.toLowerCase() === filters.tipologia.toLowerCase();
    const matchPreco = filters.precoMax === 'Qualquer' || l.price <= parseInt(filters.precoMax.replace(/[^0-9]/g, ''), 10);
    const matchArea = filters.areaMin === '' || l.area >= parseInt(filters.areaMin, 10);
    return matchSearch && matchDistrito && matchTipo && matchPreco && matchArea;
  });

  const nomeExibicao = user?.username || 'Utilizador';

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

        {/* SIDEBAR FOOTER */}
        <div className="p-4 border-t border-slate-800">
          <div 
            onClick={() => setActiveTab('Perfil')}
            className={`flex items-center gap-3 px-2 py-2 cursor-pointer rounded-lg transition-colors ${
              activeTab === 'Perfil' ? 'bg-slate-800' : 'hover:bg-slate-800'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold uppercase shrink-0">
              {user ? nomeExibicao.charAt(0) : '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user ? nomeExibicao : 'A carregar...'}</p>
              <p className="text-xs text-slate-400">Inquilino</p>
            </div>
            {/* Bolinha vermelha no perfil se faltarem dados */}
            {isPerfilIncompleto && (
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0"></div>
            )}
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
            {/* DROPDOWN DE NOTIFICAÇÕES */}
            <div className="relative">
              <button 
                onClick={handleToggleNotificacoes}
                className={`p-2 rounded-full relative transition-colors ${showNotifications ? 'bg-sky-50 text-sky-600' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <Bell size={20} />
                {naoLidas > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800 text-sm">Notificações</h3>
                    {naoLidas > 0 && <span className="text-xs bg-sky-100 text-sky-600 font-bold px-2 py-1 rounded-full">{naoLidas} novas</span>}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notificacoes.length === 0 ? (
                      <div className="p-6 text-center text-slate-500 text-sm">
                        <Bell size={24} className="mx-auto text-slate-300 mb-2" />
                        Nenhuma notificação por agora.
                      </div>
                    ) : (
                      notificacoes.map(notif => (
                        <div key={notif.id} className={`p-4 border-b border-gray-50 transition-colors ${!notif.lida ? 'bg-sky-50/40' : 'hover:bg-slate-50'}`}>
                          <p className="font-bold text-sm text-slate-800 mb-1">{notif.titulo}</p>
                          <p className="text-xs text-slate-500 mb-2 leading-relaxed">{notif.mensagem}</p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {new Date(notif.criada_em).toLocaleDateString('pt-PT')} às {new Date(notif.criada_em).toLocaleTimeString('pt-PT', {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div 
              onClick={() => setActiveTab('Perfil')}
              className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold text-sm uppercase shrink-0 cursor-pointer hover:ring-2 hover:ring-sky-200 transition-all"
            >
              {user ? nomeExibicao.charAt(0) : <User size={18} />}
            </div>
          </div>
        </header>

        {/* ALERTA INTELIGENTE (ONBOARDING INQUILINO) */}
        {isPerfilIncompleto && (
          <div className="bg-amber-50 border-b border-amber-200 px-8 py-3 flex items-center justify-between z-10 relative">
            <div className="flex items-center gap-3 text-amber-800">
              <AlertCircle size={18} className="text-amber-500 shrink-0" />
              <p className="text-sm font-medium">Atenção: O teu perfil está incompleto (falta NIF, IBAN ou Telefone). Precisas de preencher estes dados para te candidatares a imóveis.</p>
            </div>
            <button 
              onClick={() => {
                setActiveTab('Perfil');
                setProfileTab('conta');
              }}
              className="text-xs font-bold bg-amber-200 text-amber-800 px-4 py-1.5 rounded-lg hover:bg-amber-300 transition-colors shrink-0"
            >
              Completar Agora
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto bg-slate-50">
          
          {/* TAB PERFIL */}
          {activeTab === 'Perfil' && (
            <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row gap-8">
                
                <div className="w-full md:w-64 flex-shrink-0">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">Definições</h2>
                  <nav className="space-y-2">
                    <button 
                      onClick={() => setProfileTab('conta')} 
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                        profileTab === 'conta' 
                          ? 'bg-sky-50 text-sky-700 shadow-sm' 
                          : 'text-slate-500 hover:bg-white hover:shadow-sm'
                      }`}
                    >
                      <User size={18} />
                      A Minha Conta
                    </button>
                    <button 
                      onClick={() => setProfileTab('seguranca')} 
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                        profileTab === 'seguranca' 
                          ? 'bg-sky-50 text-sky-700 shadow-sm' 
                          : 'text-slate-500 hover:bg-white hover:shadow-sm'
                      }`}
                    >
                      <Lock size={18} />
                      Segurança
                    </button>

                    <div className="h-px bg-slate-200 my-4 mx-2"></div>
                    
                    <button 
                      onClick={terminarSessao} 
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={18} />
                      Terminar Sessão
                    </button>
                  </nav>
                </div>

                <div className="flex-1">
                  
                  {/* ABA: A MINHA CONTA */}
                  {profileTab === 'conta' && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                      <div className="mb-8">
                        <h3 className="text-xl font-bold text-slate-800">A Minha Conta</h3>
                        <p className="text-sm text-slate-500 mt-1">Gere a tua informação pessoal e dados financeiros.</p>
                      </div>

                      <form onSubmit={guardarConta} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Nome de Utilizador</label>
                            <input 
                              type="text" 
                              value={editUsername} 
                              onChange={e => setEditUsername(e.target.value)} 
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Endereço de Email</label>
                            <input 
                              type="email" 
                              value={user?.email || ''} 
                              disabled 
                              className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 cursor-not-allowed" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Número de Telemóvel</label>
                            <input 
                              type="text" 
                              value={editTelefone} 
                              onChange={e => setEditTelefone(e.target.value)} 
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">NIF</label>
                            <input 
                              type="text" 
                              value={editNif} 
                              onChange={e => setEditNif(e.target.value)} 
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors" 
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">IBAN</label>
                            <input 
                              type="text" 
                              value={editIban} 
                              onChange={e => setEditIban(e.target.value)} 
                              placeholder="PT50..."
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors" 
                            />
                          </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex justify-end">
                          <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm">
                            Guardar Alterações
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* ABA: SEGURANÇA */}
                  {profileTab === 'seguranca' && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                      <div className="mb-8">
                        <h3 className="text-xl font-bold text-slate-800">Segurança e Password</h3>
                        <p className="text-sm text-slate-500 mt-1">Atualiza a tua password para manteres a conta segura.</p>
                      </div>

                      <form onSubmit={atualizarPassword} className="space-y-5 max-w-md">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Palavra-passe atual</label>
                          <input 
                            type="password" 
                            value={oldPassword} 
                            onChange={e => setOldPassword(e.target.value)}
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Nova palavra-passe</label>
                          <input 
                            type="password" 
                            value={newPassword} 
                            onChange={e => setNewPassword(e.target.value)}
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Confirmar nova palavra-passe</label>
                          <input 
                            type="password" 
                            value={confirmPassword} 
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors" 
                          />
                        </div>

                        <div className="pt-4">
                          <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm w-full md:w-auto">
                            Atualizar Password
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                </div>
              </div>
            </div>
          )}

          {/* TAB PESQUISAR */}
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

          {/* TAB MINHAS CANDIDATURAS */}
          {activeTab === 'Minhas Candidaturas' && (
            <div className="p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Minhas Candidaturas</h2>
              
              {candidaturasReais.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"><FileText size={28} className="text-gray-400" /></div>
                  <p className="text-slate-700 font-semibold mb-1">Sem candidaturas ainda</p>
                  <p className="text-slate-400 text-sm">Candidata-te a imóveis na secção de Pesquisa.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {candidaturasReais.map((cand) => (
                    <div key={cand.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-5">
                      <div className="w-16 h-16 bg-sky-50 rounded-xl flex items-center justify-center text-sky-500 flex-shrink-0">
                        <Home size={28} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to={`/imovel/${cand.property}`} className="font-bold text-slate-800 truncate hover:text-sky-600 hover:underline transition-colors block">
                          {cand.property_title || 'Imóvel Indisponível'}
                        </Link>
                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin size={12} />{cand.property_location || 'Localização não definida'}
                        </p>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div>
                          <p className="text-xs text-slate-400 font-medium mb-1">
                            Enviada a: {cand.created_at ? new Date(cand.created_at).toLocaleDateString('pt-PT') : 'Recente'}
                          </p>
                          {(!cand.status || cand.status === 'pending') && <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1.5 rounded-full inline-block">Em Análise</span>}
                          {cand.status === 'approved' && <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full inline-block">Aprovada</span>}
                          {cand.status === 'rejected' && <span className="text-xs font-bold text-red-700 bg-red-100 px-3 py-1.5 rounded-full inline-block">Rejeitada</span>}
                        </div>
                        <button 
                          onClick={() => handleApagarCandidatura(cand.id)}
                          title="Retirar Candidatura"
                          className="w-10 h-10 rounded-full border border-red-100 text-red-400 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB AS MINHAS RENDAS */}
          {activeTab === 'As Minhas Rendas' && (
            <div className="p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6">As Minhas Rendas</h2>
              
              {rendasReais.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"><Wallet size={28} className="text-gray-400" /></div>
                  <p className="text-slate-700 font-semibold mb-1">Sem contrato ativo</p>
                  <p className="text-slate-400 text-sm">Quando um senhorio aceitar a tua candidatura, o teu contrato aparecerá aqui.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rendasReais.map((renda) => (
                    <div key={renda.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col relative overflow-hidden">
                      <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full -z-10 ${!renda.is_active ? 'bg-rose-50/50' : renda.payment_status === 'pago' ? 'bg-emerald-50' : 'bg-slate-50'}`}></div>
                      
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-inner ${!renda.is_active ? 'bg-rose-100 text-rose-600' : renda.payment_status === 'pago' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                          <Wallet size={26} />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-lg">
                            {renda.is_active ? 'Contrato Ativo' : 'Contrato Encerrado'}
                          </h3>
                          <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                            {renda.is_active ? (
                              <>
                                <CheckCircle size={14} className={renda.payment_status === 'pago' ? "text-emerald-500" : "text-slate-400"} /> Válido até {renda.end_date}
                              </>
                            ) : (
                              <>
                                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-pulse"></span> Terminado pelo Senhorio
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-100 pt-5 mt-auto flex justify-between items-center">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Renda Mensal</p>
                          <span className="text-2xl font-black text-slate-800">{Number(renda.monthly_rent).toLocaleString('pt-PT')}€</span>
                        </div>
                        
                        {!renda.is_active ? (
                          <span className="text-rose-700 font-bold bg-rose-50 border border-rose-200 px-4 py-2 rounded-xl text-xs uppercase tracking-wider">
                            Arrendamento Concluído
                          </span>
                        ) : renda.payment_status === 'pago' ? (
                          <div className="flex flex-col items-end">
                            <span className="text-emerald-600 font-bold flex items-center gap-1.5 bg-emerald-50 px-4 py-2 rounded-xl">
                              <CheckCircle size={18} /> Mês Pago
                            </span>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleOpenPagamento(renda)}
                            className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-slate-900/20"
                          >
                            Pagar Renda
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

      {/* MODAL DE PAGAMENTO */}
      {isPaymentModalOpen && rendaAPagar && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-50 border-b border-slate-200 p-6 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-xl">Pagamento de Renda</h3>
                <p className="text-sm text-slate-500">Mês atual</p>
              </div>
              <button onClick={() => !isProcessingPayment && setIsPaymentModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white border border-slate-200 p-2 rounded-full transition-colors shadow-sm">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={processarPagamento} className="p-8 space-y-6">
              <div className="text-center mb-8">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Total a Pagar</p>
                <p className="text-5xl font-black text-slate-800">{Number(rendaAPagar.monthly_rent).toLocaleString('pt-PT')}€</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div 
                  onClick={() => setMetodoPagamento('mbway')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 ${metodoPagamento === 'mbway' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 hover:border-sky-200 text-slate-500'}`}
                >
                  <Smartphone size={28} className={metodoPagamento === 'mbway' ? 'text-sky-500' : 'text-slate-400'} />
                  <span className="font-bold text-sm">MB Way</span>
                </div>
                <div 
                  onClick={() => setMetodoPagamento('cartao')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 ${metodoPagamento === 'cartao' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 hover:border-sky-200 text-slate-500'}`}
                >
                  <CreditCard size={28} className={metodoPagamento === 'cartao' ? 'text-sky-500' : 'text-slate-400'} />
                  <span className="font-bold text-sm">Cartão</span>
                </div>
              </div>

              {metodoPagamento === 'mbway' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Nº Telemóvel associado</label>
                  <input required type="tel" placeholder="Ex: 912 345 678" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-lg tracking-wider" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Número do Cartão</label>
                    <input required type="text" placeholder="0000 0000 0000 0000" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-lg tracking-wider" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Validade</label>
                      <input required type="text" placeholder="MM/AA" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-lg text-center tracking-wider" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">CVV</label>
                      <input required type="text" placeholder="123" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-lg text-center tracking-wider" />
                    </div>
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isProcessingPayment}
                className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white py-4 rounded-xl font-bold mt-8 shadow-lg shadow-sky-600/20 transition-all flex justify-center items-center gap-2"
              >
                {isProcessingPayment ? (
                  <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Processando...</>
                ) : (
                  'Confirmar Pagamento Seguro'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}