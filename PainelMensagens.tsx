import { useState, useEffect, useRef } from 'react';
import { Send, MoreVertical } from 'lucide-react';

export default function PainelMensagens() {
  const [user, setUser] = useState<any>(null);
  const [conversas, setConversas] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. CARREGAR UTILIZADOR
  useEffect(() => {
    const carregarUtilizador = async () => {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      if (!token) return;
      try {
        const res = await fetch('https://arrendai-dashboard.onrender.com](https://arrendai-dashboard.onrender.com/api/users/me/', { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) setUser(await res.json());
      } catch (e) { console.error(e); }
    };
    carregarUtilizador();
  }, []);

  // 2. BUSCAR CHATS REAIS
  const carregarChats = async () => {
    if (!user) return;
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    try {
      const res = await fetch('https://arrendai-dashboard.onrender.com](https://arrendai-dashboard.onrender.com/api/tenancies/chats/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const dados = await res.json();
        
        const formatados = dados.map((c: any) => {
          const outraPessoa = c.participants_info?.find((p: any) => p.id !== user.id);
          const nomeOutraPessoa = outraPessoa?.username || 'Inquilino';
          
          return {
            ...c,
            outroNome: nomeOutraPessoa,
            lastMessage: c.messages.length > 0 ? c.messages[c.messages.length - 1].text : 'Sem mensagens'
          };
        });
        
        setConversas(formatados);
      }
    } catch (e) {
      console.error("Erro a carregar chats:", e);
    }
  };

  useEffect(() => {
    carregarChats();
    const interval = setInterval(carregarChats, 2000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversas, activeChatId]);

  // 3. ENVIAR MENSAGEM
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChatId) return;

    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    const textoEnviado = inputText;
    setInputText(''); 

    try {
      await fetch('https://arrendai-dashboard.onrender.com](https://arrendai-dashboard.onrender.com/api/tenancies/messages/', {
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
      carregarChats();
    } catch (error) {
      console.error("Erro a enviar mensagem:", error);
    }
  };

  const activeChat = conversas.find(c => c.id === activeChatId);

  return (
    <div className="h-[calc(100vh-10rem)] min-h-[400px] bg-white rounded-2xl border border-gray-200 shadow-sm flex overflow-hidden animate-in fade-in duration-500">
      
      {/* LISTA DE CONVERSAS DO SENHORIO */}
      <div className="w-80 border-r border-gray-100 flex flex-col bg-white shrink-0">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-slate-800">Conversas</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {conversas.length === 0 && <p className="text-sm text-slate-400 text-center mt-4">Sem mensagens.</p>}
          
          {conversas.map((chat: any) => (
            <div 
              key={chat.id} 
              onClick={() => setActiveChatId(chat.id)}
              className={`p-3 rounded-xl border cursor-pointer ${activeChatId === chat.id ? 'bg-slate-50 border-slate-200' : 'border-transparent hover:bg-slate-50'}`}
            >
              <p className="font-bold text-sm text-slate-900">{chat.outroNome}</p>
              <p className="text-xs text-slate-500 truncate">{chat.lastMessage}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* CHAT ATIVO DO SENHORIO */}
      <div className="flex-1 flex flex-col bg-slate-50 min-w-0">
        {activeChat ? (
          <>
            <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-center shadow-sm z-10 shrink-0">
              <span className="font-bold text-slate-800">{activeChat.outroNome} - <span className="font-normal text-slate-500 text-sm">{activeChat.property_title}</span></span>
              <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={18} /></button>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto flex flex-col space-y-4">
              {activeChat.messages.map((msg: any) => {
                const isMe = msg.sender === user?.id; // Se o remetente sou eu (Senhorio)
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 max-w-[75%] text-sm shadow-sm relative ${
                      isMe 
                        ? 'bg-slate-800 text-white rounded-2xl rounded-tr-none' 
                        : 'bg-white border border-gray-100 text-slate-700 rounded-2xl rounded-tl-none'
                    }`}>
                      <p className="leading-relaxed">{msg.text}</p>
                      <p className={`text-[9px] mt-1 text-right opacity-70 ${isMe ? 'text-white' : 'text-slate-500'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString('pt-PT', {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-white flex gap-3 shrink-0">
              <form onSubmit={sendMessage} className="flex gap-3 w-full items-center">
                <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Escreva uma resposta..." className="flex-1 bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none" />
                <button type="submit" disabled={!inputText.trim()} className="bg-slate-800 disabled:bg-slate-300 px-4 py-2.5 rounded-xl text-white flex items-center justify-center transition-colors">
                  <Send size={18}/>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">Selecione uma conversa.</div>
        )}
      </div>
    </div>
  );
}