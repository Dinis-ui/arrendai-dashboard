import { Send, MoreVertical } from 'lucide-react';

export default function PainelMensagens() {
  return (
    // A magia está aqui na primeira linha: h-[calc(100vh-10rem)]
    <div className="h-[calc(100vh-10rem)] min-h-[400px] bg-white rounded-2xl border border-gray-200 shadow-sm flex overflow-hidden animate-in fade-in duration-500">
      
      {/* BARRA LATERAL DE CONVERSAS */}
      <div className="w-80 border-r border-gray-100 flex flex-col bg-white shrink-0">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-slate-800">Conversas</h2>
        </div>
        
        {/* Lista com scroll independente */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 cursor-pointer">
            <p className="font-bold text-sm text-slate-900">Francisco Silva</p>
            <p className="text-xs text-slate-500 truncate">Olá, quando posso visitar a casa?</p>
          </div>
        </div>
      </div>
      
      {/* ÁREA PRINCIPAL DO CHAT */}
      <div className="flex-1 flex flex-col bg-slate-50 min-w-0">
        
        {/* Cabeçalho do Chat */}
        <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-center shadow-sm z-10 shrink-0">
          <span className="font-bold text-slate-800">Francisco Silva</span>
          <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={18} /></button>
        </div>
        
        {/* Histórico de Mensagens (com scroll) */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-end">
          <div className="bg-white border border-gray-100 text-slate-700 p-3 rounded-2xl rounded-tl-none mr-auto max-w-xs text-sm mb-4 shadow-sm">
            Olá, quando posso visitar a casa?
          </div>
          <div className="bg-sky-600 text-white p-3 rounded-2xl rounded-tr-none ml-auto max-w-xs text-sm shadow-sm">
            Sim, a casa está disponível para visitas na próxima Terça às 10h.
          </div>
        </div>
        
        {/* Barra de Escrever (Sempre visível no fundo) */}
        <div className="p-4 border-t border-gray-100 bg-white flex gap-3 shrink-0">
          <input 
            type="text" 
            placeholder="Escreva uma mensagem..." 
            className="flex-1 bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all" 
          />
          <button className="bg-sky-600 px-4 py-2.5 rounded-xl text-white hover:bg-sky-700 transition-colors shadow-sm flex items-center justify-center">
            <Send size={18}/>
          </button>
        </div>

      </div>
    </div>
  );
}