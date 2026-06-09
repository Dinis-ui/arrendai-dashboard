import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Send, Image as ImageIcon, MoreVertical, 
  MessageSquare, FileText, Wallet, Bell, Check, User 
} from 'lucide-react';

// Dados base agora usam "senderRole" em vez de "sender: me/them"
const conversasBase = [
  {
    id: 1,
    senhorio: 'Dinis G.',
    inquilino: 'Maria Ferreira', // Adicionamos o nome do inquilino para o senhorio ver!
    imovel: 'Apartamento T2 com Varanda e Vista Rio',
    avatar: 'DG',
    unread: true,
    lastMessage: 'Ola! Sim, podemos agendar visita para quinta-feira as 18h.',
    time: '10:30',
    history: [
      { senderRole: 'tenant', text: 'Ola Dinis, estou interessada. Ainda da para visitar?', time: '09:15' },
      { senderRole: 'landlord', text: 'Ola! Sim, podemos agendar visita para quinta-feira as 18h. Da-te jeito?', time: '10:30' }
    ]
  }
];

export default function Mensagens() {
  const navigate = useNavigate();
  
  const [user, setUser] = useState<any>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificacoes, setNotificacoes] = useState([
    { id: 1, titulo: 'Candidatura Aprovada!', desc: 'O senhorio aceitou a tua candidatura.', tempo: 'Há 10 min', lida: false }
  ]);
  const naoLidas = notificacoes.filter(n => !n.lida).length;

  // LER DO LOCAL STORAGE
  const carregarConversasIniciais = () => {
    const guardadas = localStorage.getItem('minhasConversas');
    return guardadas ? JSON.parse(guardadas) : conversasBase;
  };

  const [conversas, setConversas] = useState(carregarConversasIniciais());
  const [activeChat, setActiveChat] = useState(carregarConversasIniciais()[0]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    // Atualiza a lista caso o senhorio tenha respondido noutro separador
    const interval = setInterval(() => {
      const atualizadas = carregarConversasIniciais();
      setConversas(atualizadas);
      if (activeChat) {
        const chatAtualizado = atualizadas.find((c: any) => c.id === activeChat.id);
        if (chatAtualizado) setActiveChat(chatAtualizado);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [activeChat]);

  useEffect(() => {
    const carregarUtilizador = async () => {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      if (!token) { navigate('/login'); return; }
      try {
        const res = await fetch('http://127.0.0.1:8000/api/users/me/', { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) setUser(await res.json());
      } catch (e) { console.error(e); }
    };
    carregarUtilizador();
  }, [navigate]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // INQUILINO ENVIA -> senderRole: 'tenant'
    const newMessage = { senderRole: 'tenant', text: inputText, time: 'Agora' };
    
    const updatedChat = { ...activeChat, lastMessage: inputText, time: 'Agora', history: [...activeChat.history, newMessage] };
    const novasConversas = conversas.map((c: any) => c.id === activeChat.id ? updatedChat : c);
    
    setActiveChat(updatedChat);
    setConversas(novasConversas);
    localStorage.setItem('minhasConversas', JSON.stringify(novasConversas));
    setInputText('');
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-slate-900 overflow-hidden">
      
      {/* SIDEBAR DO INQUILINO */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center"><span className="font-bold text-xl">A</span></div>
          <span className="text-xl font-bold tracking-tight">ArrendAI</span>
        </div>
        <nav className="flex-1 px-4 mt-4 space-y-1">
          <button onClick={() => navigate('/portalinquilino')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
            <Search size={20} /> <span className="font-medium text-sm">Pesquisar</span>
          </button>
          <div className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-sky-600 text-white transition-all mt-2 shadow-sm">
            <MessageSquare size={20} /> <span className="font-medium text-sm">Mensagens</span>
          </div>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2 py-2">
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

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 z-10">
          <h1 className="text-lg font-bold text-slate-800">Mensagens</h1>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold text-sm uppercase">
               {user?.username ? user.username.charAt(0) : <User size={18} />}
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-hidden flex flex-col">
          <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex overflow-hidden animate-in fade-in duration-500">
            
            {/* LISTA DE CONVERSAS */}
            <div className="w-80 border-r border-gray-100 flex flex-col bg-white shrink-0">
              <div className="p-5 border-b border-gray-100">
                <h2 className="font-bold text-slate-800 text-lg mb-4">Conversas</h2>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Pesquisar conversas..." className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {conversas.map((chat: any) => (
                  <div key={chat.id} onClick={() => {
                      setActiveChat(chat);
                      const lidas = conversas.map((c: any) => c.id === chat.id ? { ...c, unread: false } : c);
                      setConversas(lidas);
                      localStorage.setItem('minhasConversas', JSON.stringify(lidas));
                    }}
                    className={`p-3 rounded-xl cursor-pointer transition-colors border ${activeChat?.id === chat.id ? 'bg-sky-50 border-sky-100' : 'border-transparent hover:bg-slate-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm">{chat.avatar}</div>
                        {chat.unread && <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-sky-500 rounded-full border-2 border-white"></div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <p className="font-bold text-sm text-slate-900 truncate">{chat.senhorio}</p>
                          <span className="text-[10px] text-slate-400">{chat.time}</span>
                        </div>
                        <p className={`text-xs truncate ${chat.unread ? 'font-medium text-slate-800' : 'text-slate-500'}`}>{chat.lastMessage}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* CHAT ATIVO */}
            <div className="flex-1 flex flex-col bg-slate-50 min-w-0">
              {activeChat ? (
                <>
                  <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-center shadow-sm z-10 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">{activeChat.avatar}</div>
                      <div>
                        <span className="font-bold text-slate-800 block leading-tight">{activeChat.senhorio}</span>
                        <span className="text-xs text-slate-500 font-medium">{activeChat.imovel}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-6 overflow-y-auto flex flex-col space-y-4">
                    {activeChat.history.map((msg: any, index: number) => (
                      // AQUI É A MAGIA: Se for tenant (inquilino), fica à direita!
                      <div key={index} className={`flex ${msg.senderRole === 'tenant' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 max-w-[75%] text-sm shadow-sm relative ${
                          msg.senderRole === 'tenant' 
                            ? 'bg-sky-600 text-white rounded-2xl rounded-tr-none' 
                            : 'bg-white border border-gray-100 text-slate-700 rounded-2xl rounded-tl-none'
                        }`}>
                          <p className="leading-relaxed">{msg.text}</p>
                          <p className={`text-[9px] mt-1 text-right opacity-70 ${msg.senderRole === 'tenant' ? 'text-white' : 'text-slate-500'}`}>{msg.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 border-t border-gray-100 bg-white shrink-0">
                    <form onSubmit={sendMessage} className="flex gap-3 items-center">
                      <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Escreva uma mensagem..." className="flex-1 bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none" />
                      <button type="submit" disabled={!inputText.trim()} className="bg-sky-600 disabled:bg-slate-300 w-11 h-11 rounded-xl text-white flex items-center justify-center">
                        <Send size={18} className={inputText.trim() ? "translate-x-0.5" : ""} />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">Selecione uma conversa para começar.</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}