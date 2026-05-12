import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Send, Image as ImageIcon } from 'lucide-react';

// Dados de simulação
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
  const [activeChat, setActiveChat] = useState(conversasBase[0]);
  const [inputText, setInputText] = useState('');
  const [conversas, setConversas] = useState(conversasBase);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = { sender: 'me', text: inputText, time: 'Agora' };
    
    // Atualiza a conversa 
    const updatedChat = {
      ...activeChat,
      lastMessage: inputText,
      time: 'Agora',
      history: [...activeChat.history, newMessage]
    };

    setActiveChat(updatedChat);
    setConversas(conversas.map(c => c.id === activeChat.id ? updatedChat : c));
    setInputText('');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* PAINEL ESQUERDO: Lista de Conversas */}
      <div className="w-1/3 bg-white border-r border-slate-200 flex flex-col h-full z-10 shadow-sm">
        <div className="p-6 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => navigate('/portal')} className="text-slate-400 hover:text-sky-500">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-slate-800">Mensagens</h1>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Pesquisar conversas..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversas.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => {
                setActiveChat(chat);
                // Marcar como lida
                setConversas(conversas.map(c => c.id === chat.id ? { ...c, unread: false } : c));
              }}
              className={`p-4 border-b border-slate-50 cursor-pointer transition-colors flex gap-4 ${
                activeChat.id === chat.id ? 'bg-sky-50' : 'hover:bg-slate-50'
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                  {chat.avatar}
                </div>
                {chat.unread && <div className="absolute top-0 right-0 w-3 h-3 bg-sky-500 rounded-full border-2 border-white"></div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-bold text-slate-900 text-sm truncate">{chat.senhorio}</h3>
                  <span className="text-xs text-slate-400 flex-shrink-0 ml-2">{chat.time}</span>
                </div>
                <p className="text-xs text-slate-500 truncate mb-1">{chat.imovel}</p>
                <p className={`text-sm truncate ${chat.unread ? 'font-bold text-slate-800' : 'text-slate-500'}`}>
                  {chat.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PAINEL DIREITO: Area de Chat */}
      <div className="flex-1 flex flex-col h-full bg-slate-50/50">
        
        {/* Cabecalho do Chat */}
        <div className="h-20 bg-white border-b border-slate-200 flex items-center px-8 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center font-bold text-sky-700">
              {activeChat.avatar}
            </div>
            <div>
              <h2 className="font-bold text-slate-900">{activeChat.senhorio}</h2>
              <p className="text-xs text-slate-500 font-medium">{activeChat.imovel}</p>
            </div>
          </div>
        </div>

        {/* Historico de Mensagens */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="text-center">
            <span className="bg-slate-200 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">Hoje</span>
          </div>
          
          {activeChat.history.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${
                msg.sender === 'me' 
                  ? 'bg-sky-500 text-white rounded-br-sm' 
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p className={`text-[10px] mt-1 text-right ${msg.sender === 'me' ? 'text-sky-100' : 'text-slate-400'}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Area de Input */}
        <div className="p-6 bg-white border-t border-slate-200 flex-shrink-0">
          <form onSubmit={sendMessage} className="flex gap-3">
            <button type="button" className="p-3 text-slate-400 hover:text-sky-500 hover:bg-slate-50 rounded-xl transition-colors">
              <ImageIcon size={20} />
            </button>
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escreve a tua mensagem..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
            <button 
              type="submit"
              disabled={!inputText.trim()}
              className="bg-sky-500 hover:bg-sky-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors flex items-center justify-center"
            >
              <Send size={18} className={inputText.trim() ? "translate-x-0.5" : ""} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}