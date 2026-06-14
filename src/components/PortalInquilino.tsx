import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Home, FileText, Wallet, Bell, ChevronDown, 
  SlidersHorizontal, Heart, ArrowUpRight, User, MessageSquare, 
  X, UploadCloud, Trash2, CreditCard, Smartphone, Lock, LogOut,
  CheckCircle, XCircle, Clock, Ban, AlertCircle, CheckCircle2
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

// ==========================================
// COMPONENTE DO CARTÃO DA PROPRIEDADE
// ==========================================
function PropertyCard({ listing, onApply }: { listing: any; onApply: (imovel: any) => void }) {
  const [saved, setSaved] = useState(false);
  const isArrendada = listing.available === 'Já Arrendada';

  return (
    <div className={`bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-300 group flex flex-col relative ${isArrendada ? 'opacity-70 grayscale-[0.3]' : 'hover:shadow-lg'}`}>
      <Link to={isArrendada ? '#' : `/imovel/${listing.id}`} className={`block ${isArrendada ? 'cursor-default' : ''}`}>
        <div className="relative overflow-hidden h-48">
          <img src={listing.photo} alt={listing.title} className={`w-full h-full object-cover transition-transform duration-500 ${isArrendada ? '' : 'group-hover:scale-105'}`} />
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full capitalize">{listing.tipo}</span>
          </div>
          
          {!isArrendada && (
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
          )}

          <div className="absolute bottom-3 left-3">
            <span className={`text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm ${isArrendada ? 'bg-rose-500' : 'bg-emerald-500'}`}>
              {listing.available}
            </span>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <div className="mb-3">
            <h3 className={`font-bold text-base leading-snug mb-1 transition-colors ${isArrendada ? 'text-slate-500' : 'text-slate-800 group-hover:text-sky-600'}`}>
              {listing.title}
            </h3>
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
          <span className={`text-2xl font-bold ${isArrendada ? 'text-slate-400' : 'text-slate-900'}`}>
            {listing.price.toLocaleString('pt-PT')}€
          </span>
          <span className="text-slate-400 text-sm">/mês</span>
        </div>
        
        <button
          disabled={isArrendada}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation(); 
            onApply(listing);
          }}
          className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm ${
            isArrendada 
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
            : 'bg-sky-600 hover:bg-sky-700 text-white'
          }`}
        >
          {isArrendada ? 'Indisponível' : <>Candidatar <ArrowUpRight size={14} /></>}
        </button>
      </div>
    </div>
  );
}

// ==========================================
// PORTAL DO INQUILINO PRINCIPAL
// ==========================================
export default function PortalInquilino() {
  const navigate = useNavigate();
  
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Pesquisar');
  const [listings, setListings] = useState<any[]>([]); 
  const [candidaturasReais, setCandidaturasReais] = useState<any[]>([]); 
  const [rendasReais, setRendasReais] = useState<any[]>([]);

  const [profileTab, setProfileTab] = useState('conta'); 
  const [editUsername, setEditUsername] = useState('');
  const [editTelefone, setEditTelefone] = useState('');
  const [editNif, setEditNif] = useState('');
  const [editIban, setEditIban] = useState('');
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Filters>({
    distrito: 'Todos',
    precoMax: 'Qualquer',
    tipologia: 'Todas',
    areaMin: '',
  });
  
  // ESTADOS DE NOTIFICAÇÕES REAIS
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificacoes, setNotificacoes] = useState<any[]>([]);
  const naoLidas = notificacoes.filter(n => !n.lida).length;

  const [isCandidaturaOpen, setIsCandidaturaOpen] = useState(false);
  const [candidaturaEnviada, setCandidaturaEnviada] = useState(false);
  const [imovelCandidatura, setImovelCandidatura] = useState<any>(null);
  const [mensagemCandidatura, setMensagemCandidatura] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ficheiros, setFicheiros] = useState<File[]>([]);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [rendaAPagar, setRendaAPagar] = useState<any>(null);
  const [metodoPagamento, setMetodoPagamento] = useState<'mbway' | 'cartao'>('mbway');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // ESTADOS DOS TOASTS (Avisos de Sucesso e Erro)
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastErro, setToastErro] = useState<{ativo: boolean, mensagem: string}>({ ativo: false, mensagem: '' });

  const mostrarSucesso = (mensagem: string) => {
    setToastMessage(mensagem);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  const mostrarErro = (mensagem: string) => {
    setToastErro({ ativo: true, mensagem });
    setTimeout(() => setToastErro({ ativo: false, mensagem: '' }), 5000);
  };

  const handleLogoutClick = () => setIsLogoutModalOpen(true);
  
  const confirmarLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    navigate('/login');
  };

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
  }, [navigate, activeTab]); 

  // CARREGAR NOTIFICAÇÕES (Em Tempo Real)
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
    const intervalo = setInterval(carregarNotificacoes, 30000);
    return () => clearInterval(intervalo);
  }, []);

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
        setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })));
      } catch (error) {
        console.error("Erro a marcar notificações como lidas", error);
      }
    }
  };

  // VERIFICA SE O PERFIL ESTÁ INCOMPLETO
  const isPerfilIncompleto = user && (!user.telefone || !user.nif || !user.iban);

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
        setUser(dadosNovos); 
        mostrarSucesso("Dados guardados com sucesso!");
      } else {
        mostrarErro("Erro ao guardar os dados no servidor.");
      }
    } catch (error) { 
      mostrarErro("Ocorreu um erro de rede. Tenta novamente.");
    }
  };

  const atualizarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      mostrarErro("A nova password e a confirmação não coincidem!");
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
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
      });

      if (response.ok) {
        mostrarSucesso("Password atualizada com sucesso! A terminar sessão...");
        setTimeout(() => {
          confirmarLogout();
        }, 2500);
      } else {
        const err = await response.json();
        mostrarErro(err.error || "A password atual está incorreta.");
      }
    } catch (error) { 
      mostrarErro("Erro na ligação. Tenta novamente.");
    }
  };

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
          
          const formatados = dados.map((p: any) => {
            const casaArrendada = p.estado === 'Alugado' || p.estado === 'Arrendado';

            return {
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
              available: casaArrendada ? 'Já Arrendada' : 'Disponível Agora',
              senhorio: p.senhorio 
            };
          });
          
          setListings(formatados);
        }
      } catch (error) {
        console.error("Erro a carregar anúncios:", error);
      }
    };
    buscarImoveis();
  }, []);

  useEffect(() => {
    if (activeTab === 'Minhas Candidaturas') {
      const carregarAsMinhasCandidaturas = async () => {
        const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        if (!token) return;
        try {
          const res = await fetch('http://127.0.0.1:8000/api/tenancies/applications/', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) setCandidaturasReais(await res.json());
        } catch (error) { console.error(error); }
      };
      carregarAsMinhasCandidaturas();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'As Minhas Rendas') {
      const carregarRendas = async () => {
        const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        if (!token) return;
        try {
          const res = await fetch('http://127.0.0.1:8000/api/tenancies/tenancies/', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) setRendasReais(await res.json());
        } catch (error) { console.error(error); }
      };
      carregarRendas();
    }
  }, [activeTab]);

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
          mostrarSucesso("Pagamento processado com sucesso!");
        } else {
          mostrarErro("Não foi possível processar o pagamento.");
        }
      } catch (error) {
        mostrarErro("Erro na ligação à Entidade Bancária.");
      } finally {
        setIsProcessingPayment(false);
      }
    }, 1500);
  };

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
          mostrarSucesso("Candidatura retirada.");
        }
      } catch (error) { mostrarErro("Erro ao retirar a candidatura."); }
    }
  };

  // FUNÇÃO QUE BLOQUEIA A CANDIDATURA SE O PERFIL ESTIVER INCOMPLETO
  const handleOpenCandidatura = (imovel: any) => {
    if (isPerfilIncompleto) {
      mostrarErro("Ação Bloqueada: Para garantir a segurança da plataforma, precisas de ter o Perfil completo (Telefone, NIF e IBAN) antes de enviar candidaturas a propriedades.");
      setActiveTab('Perfil');
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
          mostrarErro(`O ficheiro "${file.name}" tem um formato inválido.`);
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          mostrarErro(`O ficheiro "${file.name}" é demasiado grande.`);
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
        }, 3500);
      } else {
        mostrarErro("Erro ao enviar a candidatura. Tenta novamente.");
      }
    } catch (error) { 
      mostrarErro("Erro na ligação ao servidor.");
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

  const nomeExibicao = (user?.first_name ? `${user.first_name} ${user.last_name}`.trim() : user?.nome_completo) || user?.username || 'Utilizador';

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-slate-900 relative">
      <aside className="w-64 bg-slate-900 text-white flex flex-col z-10 shrink-0">
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

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 relative z-20">
          <div>
            <h1 className="text-lg font-bold text-slate-800">Portal do Inquilino</h1>
            <p className="text-xs text-slate-400">Encontra o teu próximo lar</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* SININHO E DROPDOWN */}
            <div className="relative">
              <button 
                onClick={handleToggleNotificacoes}
                className={`p-2 rounded-full relative transition-colors ${showNotifications ? 'bg-sky-50 text-sky-600' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <Bell size={20} />
                {naoLidas > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
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

        {/* ALERTA INTELIGENTE (ONBOARDING) */}
        {isPerfilIncompleto && activeTab !== 'Perfil' && (
          <div className="bg-amber-50 border-b border-amber-200 px-8 py-3 flex items-center justify-between z-10 relative">
            <div className="flex items-center gap-3 text-amber-800">
              <AlertCircle size={18} className="text-amber-500" />
              <p className="text-sm font-medium">Atenção: O teu perfil está incompleto (falta Telemóvel, NIF ou IBAN). Preenche os dados para poderes submeter candidaturas a imóveis.</p>
            </div>
            <button 
              onClick={() => setActiveTab('Perfil')}
              className="text-xs font-bold bg-amber-200 text-amber-800 px-4 py-1.5 rounded-lg hover:bg-amber-300 transition-colors"
            >
              Completar Agora
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto bg-slate-50 z-0 relative">
          {activeTab === 'Perfil' && (
            <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-64 flex-shrink-0">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">Definições</h2>
                  <nav className="space-y-2 flex flex-col">
                    <button 
                      onClick={() => setProfileTab('conta')} 
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                        profileTab === 'conta' ? 'bg-sky-50 text-sky-700 shadow-sm' : 'text-slate-500 hover:bg-white hover:shadow-sm'
                      }`}
                    >
                      <User size={18} />
                      A Minha Conta
                    </button>
                    <button 
                      onClick={() => setProfileTab('seguranca')} 
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                        profileTab === 'seguranca' ? 'bg-sky-50 text-sky-700 shadow-sm' : 'text-slate-500 hover:bg-white hover:shadow-sm'
                      }`}
                    >
                      <Lock size={18} />
                      Segurança
                    </button>
                    <div className="pt-6 mt-2 border-t border-gray-200">
                      <button 
                        onClick={handleLogoutClick}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm bg-rose-50 text-rose-600 hover:bg-rose-100 shadow-sm border border-rose-100"
                      >
                        <LogOut size={18} />
                        Terminar Sessão
                      </button>
                    </div>
                  </nav>
                </div>

                <div className="flex-1">
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
                            <input type="text" value={editUsername} onChange={e => setEditUsername(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Endereço de Email</label>
                            <input type="email" value={user?.email || ''} disabled className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 cursor-not-allowed" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Número de Telemóvel</label>
                            <input type="text" value={editTelefone} onChange={e => setEditTelefone(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">NIF</label>
                            <input type="text" value={editNif} onChange={e => setEditNif(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors" />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">IBAN</label>
                            <input type="text" value={editIban} onChange={e => setEditIban(e.target.value)} placeholder="PT50..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors" />
                          </div>
                        </div>
                        <div className="pt-6 border-t border-slate-100 flex justify-end">
                          <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm">Guardar Alterações</button>
                        </div>
                      </form>
                    </div>
                  )}

                  {profileTab === 'seguranca' && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                      <div className="mb-8">
                        <h3 className="text-xl font-bold text-slate-800">Segurança e Password</h3>
                      </div>
                      <form onSubmit={atualizarPassword} className="space-y-5 max-w-md">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Palavra-passe atual</label>
                          <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Nova palavra-passe</label>
                          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Confirmar nova palavra-passe</label>
                          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white" />
                        </div>
                        <div className="pt-4">
                          <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm w-full md:w-auto">Atualizar Password</button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Pesquisar' && (
            <div className="p-8">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
                <div className="flex items-center gap-3 mb-5">
                  <SlidersHorizontal size={18} className="text-sky-600" />
                  <h2 className="font-bold text-slate-800">Pesquisa de Imóveis</h2>
                </div>
                <div className="relative mb-5">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Pesquisa por localização..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <SelectFilter label="Distrito" value={filters.distrito} options={distritos} onChange={setFilter('distrito')} />
                  <SelectFilter label="Preço Máximo" value={filters.precoMax} options={precos} onChange={setFilter('precoMax')} />
                  <SelectFilter label="Tipologia" value={filters.tipologia} options={tipologias} onChange={setFilter('tipologia')} />
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Área Mín. (m²)</label>
                    <input type="number" placeholder="ex: 50" value={filters.areaMin} onChange={(e) => setFilter('areaMin')(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:ring-2 focus:ring-sky-500 outline-none" />
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

          {/* ==========================================
              ABA: MINHAS CANDIDATURAS REAIS
             ========================================== */}
          {activeTab === 'Minhas Candidaturas' && (
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800">As Minhas Candidaturas</h2>
                <p className="text-sm text-slate-500">Acompanha o estado real dos teus pedidos enviados aos senhorios.</p>
              </div>

              {candidaturasReais.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {candidaturasReais.map((c: any) => {
                    const currentStatus = (c.status || 'pending').toLowerCase();

                    const renderStatusBadge = () => {
                      if (currentStatus === 'approved') {
                        return (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                            <CheckCircle size={14} /> Aprovada
                          </span>
                        );
                      } else if (currentStatus === 'rejected') {
                        return (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle size={14} /> Recusada
                          </span>
                        );
                      } else {
                        return (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock size={14} /> Pendente
                          </span>
                        );
                      }
                    };

                    return (
                      <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200">
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-800 text-base mb-1">
                            {c.property_details?.titulo_anuncio || c.property_title || `Imóvel #${c.property}`}
                          </h3>
                          <p className="text-slate-600 text-sm mb-2 line-clamp-2">
                            <span className="font-semibold text-slate-700">Mensagem:</span> {c.message || 'Sem mensagem introduzida.'}
                          </p>
                          <p className="text-xs text-slate-400">Enviada em: {c.created_at ? new Date(c.created_at).toLocaleDateString('pt-PT') : 'Recentemente'}</p>
                        </div>
                        
                        <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
                          {renderStatusBadge()}
                          <button
                            onClick={() => handleApagarCandidatura(c.id)}
                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Retirar Candidatura"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
                  <FileText className="mx-auto text-slate-300 mb-3" size={40} />
                  <p className="text-slate-700 font-semibold mb-1">Ainda não te candidataste a nenhum imóvel</p>
                  <p className="text-slate-400 text-sm">Explora o separador "Pesquisar" para enviar a tua primeira proposta.</p>
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              ABA: AS MINHAS RENDAS REAIS
             ========================================== */}
          {activeTab === 'As Minhas Rendas' && (
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800">As Minhas Rendas</h2>
                <p className="text-sm text-slate-500">Consulta os teus contratos ativos e efetua os pagamentos mensais.</p>
              </div>

              {rendasReais.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {rendasReais.map((r: any) => {
                    const isCancelado = r.status?.toLowerCase() === 'cancelado' || r.estado?.toLowerCase() === 'cancelado' || r.is_active === false;
                    const isPago = r.payment_status === 'pago';
                    
                    const valorRendaBruto = r.monthly_rent || r.property_details?.preco_anuncio || r.property_details?.valor_estimado || 0;
                    const valorRenda = Number(valorRendaBruto).toLocaleString('pt-PT');

                    return (
                      <div key={r.id} className={`bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200 ${isCancelado ? 'opacity-75 grayscale-[0.5]' : ''}`}>
                        <div>
                          <h3 className={`font-bold text-base mb-1 ${isCancelado ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                            {r.property_details?.titulo_anuncio || r.property_title || 'Contrato de Habitação Oficial'}
                          </h3>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-2 text-sm text-slate-500">
                            <p><span className="font-medium text-slate-700">Início:</span> {r.start_date || '-'}</p>
                            <p><span className="font-medium text-slate-700">Fim:</span> {r.end_date || '-'}</p>
                            
                            <p className="col-span-2 mt-3 flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Valor a Pagar:</span>
                              <span className={`font-black text-xl ${isCancelado ? 'text-slate-400' : 'text-sky-600'}`}>
                                {valorRenda}€<span className="text-sm text-slate-400 font-medium"> /mês</span>
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 justify-between md:justify-end shrink-0">
                          {isCancelado ? (
                             <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
                               <Ban size={14} /> Contrato Cancelado
                             </span>
                          ) : (
                            <>
                              <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                                isPago 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>
                                {isPago ? 'Pago' : 'Pagamento Pendente'}
                              </span>

                              {!isPago && (
                                <button
                                  onClick={() => handleOpenPagamento({ ...r, calculated_amount: valorRendaBruto })}
                                  className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                                >
                                  <CreditCard size={16} /> Pagar {valorRenda}€
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
                  <Wallet className="mx-auto text-slate-300 mb-3" size={40} />
                  <p className="text-slate-700 font-semibold mb-1">Nenhum contrato ativo encontrado</p>
                  <p className="text-slate-400 text-sm">Assim que o teu senhorio aprovar uma candidatura, o teu plano de rendas surge aqui.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* MODAL DE CANDIDATURA */}
      {isCandidaturaOpen && imovelCandidatura && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 p-5 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Candidatura Oficial</h3>
                <p className="text-sm text-slate-500">{imovelCandidatura.title}</p>
              </div>
              <button onClick={() => setIsCandidaturaOpen(false)} className="text-slate-400 hover:text-slate-600 p-1"><X size={20} /></button>
            </div>
            <div className="p-6">
              {candidaturaEnviada ? (
                <div className="text-center py-10 animate-in zoom-in-95">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Proposta Enviada!</h3>
                  <p className="text-slate-500">O senhorio vai analisar o teu perfil em breve.</p>
                </div>
              ) : (
                <form onSubmit={submeterCandidatura} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">1. Mensagem de Apresentação</label>
                    <textarea required value={mensagemCandidatura} onChange={(e) => setMensagemCandidatura(e.target.value)} className="w-full h-28 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm focus:border-sky-500 focus:bg-white resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">2. Documentos Comprovativos</label>
                    <input type="file" multiple className="hidden" ref={fileInputRef} accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
                    <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 hover:border-sky-300 cursor-pointer transition-colors">
                      <UploadCloud size={28} className="mx-auto text-sky-500 mb-2" />
                      <p className="text-sm font-medium text-slate-700">Clica para enviar ficheiros</p>
                      {ficheiros.length > 0 && <p className="text-xs text-emerald-600 font-bold mt-2">{ficheiros.length} ficheiro(s) selecionado(s)</p>}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-sky-500/20 transition-colors">Confirmar e Enviar Candidatura</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE PAGAMENTO DE RENDA */}
      {isPaymentModalOpen && rendaAPagar && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-50 border-b border-slate-200 p-5 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Efetuar Pagamento</h3>
                <p className="text-sm text-slate-500">{rendaAPagar.property_title || 'Mensalidade de Habitação'}</p>
              </div>
              <button onClick={() => setIsPaymentModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={processarPagamento} className="p-6 space-y-6">
              <div className="bg-sky-50 rounded-xl p-4 border border-sky-100 flex items-center justify-between">
                <span className="text-sm font-medium text-sky-800">Total a liquidar:</span>
                <span className="text-xl font-bold text-sky-950">
                  {Number(rendaAPagar.calculated_amount || 0).toLocaleString('pt-PT')}€
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Método Bancário</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMetodoPagamento('mbway')}
                    className={`p-4 rounded-xl border font-semibold text-sm flex flex-col items-center gap-2 transition-all ${
                      metodoPagamento === 'mbway' 
                        ? 'border-sky-500 bg-sky-50/50 text-sky-700' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone size={20} />
                    MB WAY
                  </button>
                  <button
                    type="button"
                    onClick={() => setMetodoPagamento('cartao')}
                    className={`p-4 rounded-xl border font-semibold text-sm flex flex-col items-center gap-2 transition-all ${
                      metodoPagamento === 'cartao' 
                        ? 'border-sky-500 bg-sky-50/50 text-sky-700' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard size={20} />
                    Cartão Crédito
                  </button>
                </div>
              </div>

              {metodoPagamento === 'mbway' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Número de Telemóvel</label>
                  <input 
                    type="tel" 
                    placeholder="9xx xxx xxx" 
                    required 
                    defaultValue={user?.telefone || ''}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-500 focus:bg-white" 
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Número do Cartão</label>
                    <input type="text" placeholder="xxxx xxxx xxxx xxxx" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-500 focus:bg-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Validade</label>
                      <input type="text" placeholder="MM/AA" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-500 focus:bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">CVV</label>
                      <input type="text" placeholder="xxx" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-500 focus:bg-white" />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessingPayment}
                className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-sky-600/10 flex items-center justify-center gap-2"
              >
                {isProcessingPayment ? 'A processar transação...' : 'Confirmar e Pagar'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE LOGOUT */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-5 border-[6px] border-white shadow-sm">
                <LogOut size={36} className="ml-1" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Terminar Sessão?</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Vais sair da tua conta e voltar para a página inicial.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setIsLogoutModalOpen(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl">Cancelar</button>
                <button onClick={confirmarLogout} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-500/20">Sim, Sair</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST GLOBAL SUCESSO */}
      {showSuccessToast && (
        <div className="fixed bottom-10 right-10 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-[100] animate-in fade-in slide-in-from-bottom-6">
          <div className="bg-white/20 p-2 rounded-full"><CheckCircle2 size={24} className="text-white" /></div>
          <div>
            <p className="font-bold text-sm">Sucesso!</p>
            <p className="text-xs text-emerald-100 mt-0.5">{toastMessage}</p>
          </div>
          <button onClick={() => setShowSuccessToast(false)} className="ml-4 text-emerald-200 hover:text-white"><X size={18} /></button>
        </div>
      )}
      
      {/* TOAST DE ERRO VERMELHO */}
      {toastErro.ativo && (
        <div className="fixed bottom-8 right-8 flex items-start gap-4 p-5 w-full max-w-md bg-rose-50 border border-rose-200 rounded-2xl shadow-2xl shadow-rose-900/10 z-[100] animate-in slide-in-from-bottom-8 fade-in duration-300">
          <AlertCircle className="text-rose-600 shrink-0 mt-0.5" size={24} />
          <div>
            <h4 className="text-rose-900 font-bold text-lg mb-1">Atenção</h4>
            <p className="text-rose-700 text-sm font-medium leading-relaxed">{toastErro.mensagem}</p>
          </div>
          <button onClick={() => setToastErro({...toastErro, ativo: false})} className="text-rose-400 hover:text-rose-600 ml-auto transition-colors">
            <X size={20} />
          </button>
        </div>
      )}
      
    </div>
  );
}