import { useState, useEffect } from 'react';
import { Send, MoreVertical, Search, Image as ImageIcon } from 'lucide-react';

export default function PainelMensagens() {
  const carregarConversas = () => {
    const guardadas = localStorage.getItem('minhasConversas');
    return guardadas ? JSON.parse(guardadas) : [];
  };

  const [conversas, setConversas] = useState(carregarConversas());
  const [activeChat, setActiveChat] = useState<any>(conversas.length > 0 ? conversas[0] : null);
  const [inputText, setInputText] = useState('');

  // Atualiza em tempo real se o inquilino mandar mensagem noutra janela
  useEffect(() => {
    const interval = setInterval(() => {
      const atualizadas = carregarConversas();
      setConversas(atualizadas);
      if (activeChat) {
        const chatAtualizado = atualizadas.find((c: any) => c.id === activeChat.id);
        if (chatAtualizado) setActiveChat(chatAtualizado);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [activeChat]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;

    // SENHORIO ENVIA -> senderRole: 'landlord'
    const newMessage = { senderRole: 'landlord', text: inputText, time: 'Agora' };
    
    const updatedChat = { ...activeChat, lastMessage: inputText, time: 'Agora', history: [...activeChat.history, newMessage] };
    const novasConversas = conversas.map((c: any) => c.id === activeChat.id ? updatedChat : c);
    
    setActiveChat(updatedChat);
    setConversas(novasConversas);
    localStorage.setItem('minhasConversas', JSON.stringify(novasConversas));
    setInputText('');
  };

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
              onClick={() => setActiveChat(chat)}
              className={`p-3 rounded-xl border cursor-pointer ${activeChat?.id === chat.id ? 'bg-slate-50 border-slate-200' : 'border-transparent hover:bg-slate-50'}`}
            >
              {/* O Senhorio vê o nome do Inquilino na lista! */}
              <p className="font-bold text-sm text-slate-900">{chat.inquilino || 'Inquilino'}</p>
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
              <span className="font-bold text-slate-800">{activeChat.inquilino || 'Inquilino'} - <span className="font-normal text-slate-500 text-sm">{activeChat.imovel}</span></span>
              <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={18} /></button>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto flex flex-col space-y-4">
              {activeChat.history.map((msg: any, index: number) => (
                // AQUI É A MAGIA INVERSA: Se for landlord (senhorio), fica à direita!
                <div key={index} className={`flex ${msg.senderRole === 'landlord' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 max-w-[75%] text-sm shadow-sm relative ${
                    msg.senderRole === 'landlord' 
                      ? 'bg-slate-800 text-white rounded-2xl rounded-tr-none' // Senhorio tem balões escuros
                      : 'bg-white border border-gray-100 text-slate-700 rounded-2xl rounded-tl-none'
                  }`}>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-white flex gap-3 shrink-0">
              <form onSubmit={sendMessage} className="flex gap-3 w-full items-center">
                <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Escreva uma resposta..." className="flex-1 bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none" />
                <button type="submit" disabled={!inputText.trim()} className="bg-slate-800 disabled:bg-slate-300 px-4 py-2.5 rounded-xl text-white flex items-center justify-center">
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