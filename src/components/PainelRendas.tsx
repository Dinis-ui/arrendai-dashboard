import { useState } from 'react';
import { Wallet, AlertCircle, ArrowDownCircle, CheckCircle, Download, Plus, Receipt, X } from 'lucide-react';

export default function PainelRendas() {
  const [activeTab, setActiveTab] = useState<'rendas' | 'despesas'>('rendas');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [rendas, setRendas] = useState([
    { id: 1, inquilino: 'Francisco Silva', propriedade: 'Rua Garrett, Lisboa', vencimento: '05/05/2026', valor: 1200, estado: 'pago' },
    { id: 2, inquilino: 'Maria Ferreira', propriedade: 'Av. Boavista, Porto', vencimento: '01/05/2026', valor: 1550, estado: 'atraso' },
    { id: 3, inquilino: 'Carlos Sousa', propriedade: 'Estrada Monumental', vencimento: '08/05/2026', valor: 2100, estado: 'pendente' },
  ]);

  const [despesas, setDespesas] = useState([
    { id: 1, propriedade: 'Rua Garrett, Lisboa', descricao: 'Reparação de Canalização', data: '10/04/2026', valor: 150 },
    { id: 2, propriedade: 'Av. Boavista, Porto', descricao: 'Condomínio', data: '02/05/2026', valor: 65 },
  ]);

  const [novaDespesa, setNovaDespesa] = useState({ propriedade: '', descricao: '', valor: '', data: '' });

  const totalRecebido = rendas.filter(r => r.estado === 'pago').reduce((acc, curr) => acc + curr.valor, 0);
  const totalAtraso = rendas.filter(r => r.estado === 'atraso').reduce((acc, curr) => acc + curr.valor, 0);
  const totalDespesas = despesas.reduce((acc, curr) => acc + curr.valor, 0);
  const saldoLiquido = totalRecebido - totalDespesas;

  const marcarComoPago = (id: number) => {
    setRendas(rendas.map(renda => renda.id === id ? { ...renda, estado: 'pago' } : renda));
  };

  const adicionarDespesa = (e: React.FormEvent) => {
    e.preventDefault();
    const nova = {
      id: Date.now(),
      propriedade: novaDespesa.propriedade,
      descricao: novaDespesa.descricao,
      data: novaDespesa.data,
      valor: parseFloat(novaDespesa.valor)
    };
    setDespesas([...despesas, nova]);
    setIsModalOpen(false);
    setNovaDespesa({ propriedade: '', descricao: '', valor: '', data: '' });
  };

  const exportarCSV = () => {
    let csvContent = activeTab === 'rendas' 
      ? "ID,Inquilino,Propriedade,Vencimento,Valor,Estado\n" + rendas.map(r => `${r.id},"${r.inquilino}","${r.propriedade}",${r.vencimento},${r.valor},${r.estado}`).join("\n")
      : "ID,Propriedade,Descricao,Data,Valor\n" + despesas.map(d => `${d.id},"${d.propriedade}","${d.descricao}",${d.data},${d.valor}`).join("\n");
    
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_${activeTab}.csv`;
    link.click();
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Financeiro</h1>
          <p className="text-slate-500 text-sm">Controle as suas receitas, despesas e pagamentos em atraso.</p>
        </div>
        <button onClick={exportarCSV} className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-900 transition-colors">
          <Download size={18} /> Exportar CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl">
          <p className="text-sm text-emerald-700 font-bold mb-2">Rendas Recebidas</p>
          <p className="text-2xl font-bold text-emerald-900">{totalRecebido} €</p>
        </div>
        <div className="bg-red-50 border border-red-100 p-5 rounded-2xl">
          <p className="text-sm text-red-700 font-bold mb-2">Rendas em Atraso</p>
          <p className="text-2xl font-bold text-red-900">{totalAtraso} €</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl">
          <p className="text-sm text-amber-700 font-bold mb-2">Despesas Registadas</p>
          <p className="text-2xl font-bold text-amber-900">{totalDespesas} €</p>
        </div>
        <div className="bg-sky-50 border border-sky-100 p-5 rounded-2xl">
          <p className="text-sm text-sky-700 font-bold mb-2">Saldo (Lucro)</p>
          <p className="text-2xl font-bold text-sky-900">{saldoLiquido} €</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button onClick={() => setActiveTab('rendas')} className={`flex-1 py-4 font-bold ${activeTab === 'rendas' ? 'text-sky-600 border-b-2 border-sky-600 bg-sky-50' : 'text-slate-500'}`}>Gestão de Rendas</button>
          <button onClick={() => setActiveTab('despesas')} className={`flex-1 py-4 font-bold ${activeTab === 'despesas' ? 'text-sky-600 border-b-2 border-sky-600 bg-sky-50' : 'text-slate-500'}`}>Registo de Despesas</button>
        </div>

        {activeTab === 'despesas' && (
          <div className="p-4 bg-slate-50 border-b border-gray-100 flex justify-end">
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-sky-700">
              <Plus size={16} /> Registar Nova Despesa
            </button>
          </div>
        )}
        
        {activeTab === 'rendas' ? (
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Inquilino</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Valor</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Estado</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {rendas.map(r => (
                <tr key={r.id} className="border-t border-gray-100">
                  <td className="px-6 py-4">{r.inquilino}</td>
                  <td className="px-6 py-4">{r.valor} €</td>
                  <td className="px-6 py-4">{r.estado}</td>
                  <td className="px-6 py-4 text-right">
                    {r.estado !== 'pago' && <button onClick={() => marcarComoPago(r.id)} className="text-sky-600 font-bold">Marcar Pago</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Propriedade</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Descrição</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Valor</th>
              </tr>
            </thead>
            <tbody>
              {despesas.map(d => (
                <tr key={d.id} className="border-t border-gray-100">
                  <td className="px-6 py-4">{d.propriedade}</td>
                  <td className="px-6 py-4">{d.descricao}</td>
                  <td className="px-6 py-4 text-red-600 font-bold">- {d.valor} €</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form onSubmit={adicionarDespesa} className="bg-white p-6 rounded-2xl w-96 shadow-xl">
            <div className="flex justify-between mb-4">
              <h2 className="font-bold text-lg">Nova Despesa</h2>
              <button type="button" onClick={() => setIsModalOpen(false)}><X size={20}/></button>
            </div>
            <input required placeholder="Propriedade" className="w-full mb-3 p-2 border rounded" onChange={e => setNovaDespesa({...novaDespesa, propriedade: e.target.value})} />
            <input required placeholder="Descrição" className="w-full mb-3 p-2 border rounded" onChange={e => setNovaDespesa({...novaDespesa, descricao: e.target.value})} />
            <input required type="number" placeholder="Valor (€)" className="w-full mb-3 p-2 border rounded" onChange={e => setNovaDespesa({...novaDespesa, valor: e.target.value})} />
            <input required type="date" className="w-full mb-4 p-2 border rounded" onChange={e => setNovaDespesa({...novaDespesa, data: e.target.value})} />
            <button className="w-full bg-sky-600 text-white py-2 rounded-lg font-bold">Guardar Despesa</button>
          </form>
        </div>
      )}
    </div>
  );
}