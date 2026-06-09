import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Send, Image as ImageIcon, MoreVertical, 
  MessageSquare, FileText, Wallet, Bell, Check, User 
} from 'lucide-react';

// Dados de simulação base (caso não haja nada no LocalStorage)
const conversasBase = [
  {
    id: 1,
    senhorio: 'Dinis G.',
    imovel: 'Apartamento T2 com Varanda e Vista Rio',
    avatar: 'DG',
    unread: true,
    lastMessage: 'Ola! Sim, podemos agendar visita para quinta-feira as 18h.',
    time: '10:30',
    history: [
      { sender: 'me', text: 'Ola Dinis, estou interessada. Ainda da para visitar?', time: '09:15' },
      { sender: 'them', text: 'Ola! Sim, podemos agendar visita para quinta-feira as 18h. Da-te jeito?', time: '10:30' }
    ]
  },
  {
    id: 2,
    senhorio: 'Maria S.',
    imovel: 'Studio Moderno no Centro',
    avatar: 'MS',
    unread: false,
    lastMessage: 'Obrigada pelo interesse. A casa ja foi arrendada.',
    time: 'Ontem',
    history: [
      { sender: 'me', text: 'Boa tarde, o studio tem despesas incluidas?', time: 'Ontem 14:00' },
      { sender: 'them', text: 'Obrigada pelo interesse. A casa ja foi arrendada.', time: 'Ontem 15:30' }
    ]
  }
];

export default function Mensagens() {
  const navigate = useNavigate();
  
  // ESTADOS DO UTILIZADOR
  const [user, setUser] = useState<any>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificacoes, setNotificacoes] = useState([
    { id: 1, titulo: 'Candidatura Aprovada!', desc: 'O senhorio aceitou a tua candidatura.', tempo: 'Há 10 min', lida: false },
    { id: 2, titulo: 'Nova Mensagem', desc: 'Dinis G. enviou-te uma mensagem.', tempo: 'Há 1 hora', lida: false },
  ]);
  const naoLidas = notificacoes.filter(n => !n.lida).length;

  // LER DO LOCAL STORAGE PARA OBTER AS NOVAS CANDIDATURAS
  const carregarConversasIniciais = () => {
    const guardadas = localStorage.getItem('minhasConversas');
    return guardadas ? JSON.parse(guardadas) : conversasBase;
  };

  // ESTADOS DO CHAT
  const [conversas, setConversas] = useState(carregarConversasIniciais());
  const [activeChat, setActiveChat] = useState(carregarConversasIniciais()[0]);
  const [inputText, setInputText] = useState('');

  // CARREGAR DADOS DO UTILIZADOR 
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
        }
      } catch (e) {
        console.error("Erro ao carregar utilizador:", e);
      }
    };
    carregarUtilizador();
  }, [navigate]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = { sender: 'me', text: inputText, time: 'Agora' };
    
    const updatedChat = {
      ...activeChat,
      lastMessage: inputText,
      time: 'Agora',
      history: [...activeChat.history, newMessage]
    };

    const novasConversas = conversas.map((c: any) => c.id === activeChat.id ? updatedChat : c);
    
    setActiveChat(updatedChat);
    setConversas(novasConversas);
    // Atualizar no localStorage para não perder a mensagem ao fazer refresh
    localStorage.setItem('minhasConversas', JSON.stringify(novasConversas));
    
    setInputText('');
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-slate-900 overflow-hidden">
      
      {/* ==================== SIDEBAR DO INQUILINO ==================== */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
            <span className="font-bold text-xl">A</span>
          </div>
          <span className="text-xl font-bold tracking-tight">ArrendAI</span>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-1">
          <button onClick={() => navigate('/portalinquilino')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
            <Search size={20} /> <span className="font-medium text-sm">Pesquisar</span>
          </button>
          <button onClick={() => navigate('/portalinquilino')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
            <FileText size={20} /> <span className="font-medium text-sm">Minhas Candidaturas</span>
          </button>
          <button onClick={() => navigate('/portalinquilino')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
            <Wallet size={20} /> <span className="font-medium text-sm">As Minhas Rendas</span>
          </button>
          <div className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-sky-600 text-white transition-all mt-2 shadow-sm">
            <MessageSquare size={20} /> <span className="font-medium text-sm">Mensagens</span>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div onClick={() => navigate('/perfil')} className="flex items-center gap-3 px-2 py-2 cursor-pointer hover:bg-slate-800 rounded-lg transition-colors">
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

      {/* ==================== CONTEÚDO PRINCIPAL ==================== */}
      <main className="flex-1 flex flex-col min-w-0">
        
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 relative z-10">
          <div>
            <h1 className="text-lg font-bold text-slate-800">Mensagens</h1>
            <p className="text-xs text-slate-400">Comunica diretamente com os senhorios</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 rounded-full relative transition-colors ${showNotifications ? 'bg-sky-50 text-sky-600' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <Bell size={20} />
                {naoLidas > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800">Notificações</h3>
                    {naoLidas > 0 && (
                      <button onClick={() => setNotificacoes(notificacoes.map(n => ({ ...n, lida: true })))} className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 transition-colors">
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
            <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold text-sm uppercase">
               {user?.username ? user.username.charAt(0) : <User size={18} />}
            </div>
          </div>
        </header>

        {/* ÁREA DO PAINEL DE MENSAGENS (EMBUTIDO) */}
        <div className="flex-1 p-8 overflow-hidden flex flex-col">
          <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex overflow-hidden animate-in fade-in duration-500">
            
            {/* LISTA DE CONVERSAS (Esquerda) */}
            <div className="w-80 border-r border-gray-100 flex flex-col bg-white shrink-0">
              <div className="p-5 border-b border-gray-100">
                <h2 className="font-bold text-slate-800 text-lg mb-4">Conversas</h2>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Pesquisar conversas..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {conversas.map((chat: any) => (
                  <div 
                    key={chat.id}
                    onClick={() => {
                      setActiveChat(chat);
                      const lidas = conversas.map((c: any) => c.id === chat.id ? { ...c, unread: false } : c);
                      setConversas(lidas);
                      localStorage.setItem('minhasConversas', JSON.stringify(lidas));
                    }}
                    className={`p-3 rounded-xl cursor-pointer transition-colors border ${
                      activeChat?.id === chat.id ? 'bg-sky-50 border-sky-100' : 'border-transparent hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm">
                          {chat.avatar}
                        </div>
                        {chat.unread && <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-sky-500 rounded-full border-2 border-white"></div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <p className="font-bold text-sm text-slate-900 truncate">{chat.senhorio}</p>
                          <span className="text-[10px] text-slate-400 flex-shrink-0 ml-2">{chat.time}</span>
                        </div>
                        <p className={`text-xs truncate ${chat.unread ? 'font-medium text-slate-800' : 'text-slate-500'}`}>
                          {chat.lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* ÁREA DO CHAT ATIVO (Direita) */}
            <div className="flex-1 flex flex-col bg-slate-50 min-w-0">
              {activeChat ? (
                <>
                  <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-center shadow-sm z-10 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
                        {activeChat.avatar}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block leading-tight">{activeChat.senhorio}</span>
                        <span className="text-xs text-slate-500 font-medium">{activeChat.imovel}</span>
                      </div>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                  
                  <div className="flex-1 p-6 overflow-y-auto flex flex-col space-y-4">
                    <div className="text-center mb-2">
                      <span className="bg-slate-200/50 text-slate-500 text-xs font-bold px-3 py-1 rounded-full">Hoje</span>
                    </div>
                    
                    {activeChat.history.map((msg: any, index: number) => (
                      <div key={index} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 max-w-[75%] text-sm shadow-sm relative ${
                          msg.sender === 'me' 
                            ? 'bg-sky-600 text-white rounded-2xl rounded-tr-none' 
                            : 'bg-white border border-gray-100 text-slate-700 rounded-2xl rounded-tl-none'
                        }`}>
                          <p className="leading-relaxed">{msg.text}</p>
                          <p className={`text-[9px] mt-1 text-right opacity-70 ${msg.sender === 'me' ? 'text-white' : 'text-slate-500'}`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 border-t border-gray-100 bg-white shrink-0">
                    <form onSubmit={sendMessage} className="flex gap-3 items-center">
                      <button type="button" className="text-slate-400 hover:text-sky-500 transition-colors">
                        <ImageIcon size={22} />
                      </button>
                      <input 
                        type="text" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Escreva uma mensagem..." 
                        className="flex-1 bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all" 
                      />
                      <button 
                        type="submit"
                        disabled={!inputText.trim()}
                        className="bg-sky-600 disabled:bg-slate-300 disabled:cursor-not-allowed w-11 h-11 rounded-xl text-white hover:bg-sky-700 transition-colors shadow-sm flex items-center justify-center shrink-0"
                      >
                        <Send size={18} className={inputText.trim() ? "translate-x-0.5" : ""} />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                  Selecione uma conversa para começar.
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}