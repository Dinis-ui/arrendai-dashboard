import { useState } from 'react';
import { Plus, Clock, CheckCircle, XCircle, FileText, AlertCircle, MoreVertical, ArrowUpRight } from 'lucide-react';

type Anuncio = {
  id: number;
  titulo: string;
  tipo: string;
  preco: string;
  estado: 'rascunho' | 'em_revisao' | 'ativo' | 'inativo' | 'rejeitado';
};

export default function Anuncios() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [anuncios, setAnuncios] = useState<Anuncio[]>([
    { id: 1, titulo: 'Apartamento T2 Vista Rio', tipo: 'Apartamento Inteiro', preco: '1200€', estado: 'ativo' },
    { id: 2, titulo: 'Quarto em Entrecampos', tipo: 'Quarto Privado', preco: '450€', estado: 'em_revisao' },
    { id: 3, titulo: 'Studio Baixa Pombalina', tipo: 'Estúdio', preco: '900€', estado: 'rejeitado' },
  ]);

  const getBadgeEstado = (estado: string) => {
    switch (estado) {
      case 'ativo': return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold"><CheckCircle size={14} /> Ativo</span>;
      case 'em_revisao': return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold"><Clock size={14} /> Em Revisão</span>;
      case 'rejeitado': return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold"><XCircle size={14} /> Rejeitado</span>;
      default: return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-bold"><FileText size={14} /> Rascunho</span>;
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestão de Anúncios</h1>
          <p className="text-slate-500 text-sm">Acompanhe o estado de aprovação das suas propriedades.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-sm">
          <Plus size={18} /> Novo Anúncio
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-gray-100">
              <th className="px-6 py-4 font-semibold">Título</th>
              <th className="px-6 py-4 font-semibold">Estado de Moderação</th>
              <th className="px-6 py-4 font-semibold">Preço</th>
              <th className="px-6 py-4 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {anuncios.map((anuncio) => (
              <tr key={anuncio.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">{anuncio.titulo}</div>
                  <div className="text-xs text-slate-500">{anuncio.tipo}</div>
                </td>
                <td className="px-6 py-4">{getBadgeEstado(anuncio.estado)}</td>
                <td className="px-6 py-4 font-semibold text-slate-800">{anuncio.preco}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-sky-600 p-2"><MoreVertical size={20} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}