import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Send, MessageSquare, FileText, Wallet, Bell, User 
} from 'lucide-react';

export default function Mensagens() {
  const navigate = useNavigate();
  
  const [user, setUser] = useState<any>(null);
  const [conversas, setConversas] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. CARREGAR UTILIZADOR
  useEffect(() => {
    const carregarUtilizador = async () => {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      if (!token) { navigate('/login'); return; }
      try {
        const res = await fetch('http://127.0.0.1:8000/api/users/me/', { 
          headers: { 'Authorization': `Bearer ${token}` } 
        });
        if (res.ok) setUser(await res.json());
      } catch (e) { console.error(e); }
    };
    carregarUtilizador();
  }, [navigate]);

  // 2. BUSCAR CHATS REAIS NA API
  const carregarChats = async () => {
    if (!user) return;
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    try {
      const res = await fetch('http://127.0.0.1:8000/api/tenancies/chats/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const dados = await res.json();
        
        const formatados = dados.map((c: any) => {
          // Descobrir quem é a "outra pessoa" no chat
          const outraPessoa = c.participants_info?.find((p: any) => p.id !== user.id);
          const nomeOutraPessoa = outraPessoa?.username || 'Senhorio';
          
          return {
            ...c,
            outroNome: nomeOutraPessoa,
            avatar: nomeOutraPessoa.charAt(0).toUpperCase(),
            lastMessage: c.messages.length > 0 ? c.messages[c.messages.length - 1].text : 'Sem mensagens',
            time: c.messages.length > 0 ? new Date(c.messages[c.messages.length - 1].timestamp).toLocaleTimeString('pt-PT', {hour: '2-digit', minute:'2-digit'}) : ''
          };
        });
        
        setConversas(formatados);
      }
    } catch (e) {
      console.error("Erro a carregar chats:", e);
    }
  };

  // POLLING: Atualiza os chats a cada 2 segundos
  useEffect(() => {
    carregarChats();
    const interval = setInterval(carregarChats, 2000);
    return () => clearInterval(interval);
  }, [user]);

  // Scroll automático para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversas, activeChatId]);

  // 3. ENVIAR MENSAGEM PARA O DJANGO
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChatId) return;

    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    const textoEnviado = inputText;
    setInputText(''); // Limpa logo o input para ser rápido

    try {
      await fetch('http://127.0.0.1:8000/api/tenancies/messages/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          chat: activeChatId,
          text: textoEnviado
        })
      });
      carregarChats(); // Atualiza a lista imediatamente
    } catch (error) {
      console.error("Erro a enviar mensagem:", error);
    }
  };

  const activeChat = conversas.find(c => c.id === activeChatId);

  // A NOSSA LINHA MÁGICA PARA O NOME COMPLETO:
  const nomeExibicao = (user?.first_name ? `${user.first_name} ${user.last_name}`.trim() : user?.nome_completo) || user?.username || 'Utilizador';

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
          <div className="flex items-center gap-3 px-2 py-2">
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

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 z-10">
          <h1 className="text-lg font-bold text-slate-800">Mensagens</h1>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold text-sm uppercase">
               {user ? nomeExibicao.charAt(0) : <User size={18} />}
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
                {conversas.length === 0 && <p className="text-center text-sm text-slate-400 mt-4">Sem mensagens.</p>}
                {conversas.map((chat: any) => (
                  <div key={chat.id} onClick={() => setActiveChatId(chat.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-colors border ${activeChatId === chat.id ? 'bg-sky-50 border-sky-100' : 'border-transparent hover:bg-slate-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm">{chat.avatar}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <p className="font-bold text-sm text-slate-900 truncate">{chat.outroNome}</p>
                          <span className="text-[10px] text-slate-400">{chat.time}</span>
                        </div>
                        <p className="text-xs truncate text-slate-500">{chat.lastMessage}</p>
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
                        <span className="font-bold text-slate-800 block leading-tight">{activeChat.outroNome}</span>
                        <span className="text-xs text-slate-500 font-medium">{activeChat.property_title || `Imóvel #${activeChat.property}`}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-6 overflow-y-auto flex flex-col space-y-4">
                    {activeChat.messages.map((msg: any) => {
                      const isMe = msg.sender === user?.id; // Lógica para saber se sou eu
                      return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`p-3 max-w-[75%] text-sm shadow-sm relative ${
                            isMe 
                              ? 'bg-sky-600 text-white rounded-2xl rounded-tr-none' 
                              : 'bg-white border border-gray-100 text-slate-700 rounded-2xl rounded-tl-none'
                          }`}>
                            <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            <p className={`text-[9px] mt-1 text-right opacity-70 ${isMe ? 'text-white' : 'text-slate-500'}`}>
                              {new Date(msg.timestamp).toLocaleTimeString('pt-PT', {hour: '2-digit', minute:'2-digit'})}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                  
                  <div className="p-4 border-t border-gray-100 bg-white shrink-0">
                    <form onSubmit={sendMessage} className="flex gap-3 items-center">
                      <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Escreva uma mensagem..." className="flex-1 bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none" />
                      <button type="submit" disabled={!inputText.trim()} className="bg-sky-600 disabled:bg-slate-300 w-11 h-11 rounded-xl text-white flex items-center justify-center transition-colors">
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