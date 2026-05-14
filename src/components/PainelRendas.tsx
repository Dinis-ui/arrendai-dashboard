import { useState } from 'react';
import { Wallet, AlertCircle, ArrowDownCircle, CheckCircle, Download, Plus, Receipt } from 'lucide-react';

export default function PainelRendas() {
  const [activeTab, setActiveTab] = useState<'rendas' | 'despesas'>('rendas');

  // Dados simulados para Rendas (O Backend vai enviar isto)
  const [rendas, setRendas] = useState([
    { id: 1, inquilino: 'Francisco Silva', propriedade: 'Rua Garrett, Lisboa', vencimento: '05/05/2026', valor: 1200, estado: 'pago' },
    { id: 2, inquilino: 'Maria Ferreira', propriedade: 'Av. Boavista, Porto', vencimento: '01/05/2026', valor: 1550, estado: 'atraso' },
    { id: 3, inquilino: 'Carlos Sousa', propriedade: 'Estrada Monumental', vencimento: '08/05/2026', valor: 2100, estado: 'pendente' },
  ]);

  // Dados simulados para Despesas
  const [despesas, setDespesas] = useState([
    { id: 1, propriedade: 'Rua Garrett, Lisboa', descricao: 'Reparação de Canalização', data: '10/04/2026', valor: 150 },
    { id: 2, propriedade: 'Av. Boavista, Porto', descricao: 'Condomínio', data: '02/05/2026', valor: 65 },
  ]);

  // Cálculos Automáticos para os KPIs
  const totalRecebido = rendas.filter(r => r.estado === 'pago').reduce((acc, curr) => acc + curr.valor, 0);
  const totalAtraso = rendas.filter(r => r.estado === 'atraso').reduce((acc, curr) => acc + curr.valor, 0);
  const totalDespesas = despesas.reduce((acc, curr) => acc + curr.valor, 0);
  const saldoLiquido = totalRecebido - totalDespesas;

  // Função para marcar renda como paga (Simulação)
  const marcarComoPago = (id: number) => {
    setRendas(rendas.map(renda => renda.id === id ? { ...renda, estado: 'pago' } : renda));
  };

  // Função para simular o download do CSV
  const exportarCSV = () => {
    alert("No futuro, isto fará o download de 'relatorio_financeiro.csv' gerado pelo Backend!");
  };

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* CABEÇALHO */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Financeiro</h1>
          <p className="text-slate-500 text-sm">Controle as suas receitas, despesas e pagamentos em atraso.</p>
        </div>
        <button onClick={exportarCSV} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
          <Download size={18} /> Exportar CSV
        </button>
      </div>

      {/* OS 4 KPIs FINANCEIROS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white rounded-lg text-emerald-600"><Wallet size={18} /></div>
            <p className="text-sm text-emerald-700 font-bold">Rendas Recebidas</p>
          </div>
          <p className="text-2xl font-bold text-emerald-900">{totalRecebido} €</p>
        </div>

        <div className="bg-red-50 border border-red-100 p-5 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white rounded-lg text-red-600"><AlertCircle size={18} /></div>
            <p className="text-sm text-red-700 font-bold">Rendas em Atraso</p>
          </div>
          <p className="text-2xl font-bold text-red-900">{totalAtraso} €</p>
        </div>

        <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white rounded-lg text-amber-600"><ArrowDownCircle size={18} /></div>
            <p className="text-sm text-amber-700 font-bold">Despesas Registadas</p>
          </div>
          <p className="text-2xl font-bold text-amber-900">{totalDespesas} €</p>
        </div>

        <div className="bg-sky-50 border border-sky-100 p-5 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white rounded-lg text-sky-600"><Receipt size={18} /></div>
            <p className="text-sm text-sky-700 font-bold">Saldo (Lucro)</p>
          </div>
          <p className="text-2xl font-bold text-sky-900">{saldoLiquido} €</p>
        </div>
      </div>

      {/* ABAS DE NAVEGAÇÃO: RENDAS vs DESPESAS */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button 
            onClick={() => setActiveTab('rendas')}
            className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'rendas' ? 'text-sky-600 border-b-2 border-sky-600 bg-sky-50/30' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Gestão de Rendas
          </button>
          <button 
            onClick={() => setActiveTab('despesas')}
            className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'despesas' ? 'text-sky-600 border-b-2 border-sky-600 bg-sky-50/30' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Registo de Despesas
          </button>
        </div>

        {/* TABELA DE RENDAS */}
        {activeTab === 'rendas' && (
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Inquilino & Propriedade</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Vencimento</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Valor</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Estado</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rendas.map(renda => (
                <tr key={renda.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{renda.inquilino}</p>
                    <p className="text-xs text-slate-500">{renda.propriedade}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{renda.vencimento}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{renda.valor} €</td>
                  <td className="px-6 py-4">
                    {renda.estado === 'pago' && <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">Pago</span>}
                    {renda.estado === 'atraso' && <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">Atraso</span>}
                    {renda.estado === 'pendente' && <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">Pendente</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {renda.estado !== 'pago' ? (
                      <button onClick={() => marcarComoPago(renda.id)} className="text-xs font-bold text-sky-600 bg-sky-50 hover:bg-sky-100 px-3 py-2 rounded-lg transition-colors flex items-center gap-1 ml-auto">
                        <CheckCircle size={14} /> Marcar Pago
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Registado</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* TABELA DE DESPESAS */}
        {activeTab === 'despesas' && (
          <div>
            <div className="p-4 bg-slate-50 border-b border-gray-100 flex justify-end">
              <button className="flex items-center gap-1 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 px-4 py-2 rounded-lg transition-colors">
                <Plus size={16} /> Registar Nova Despesa
              </button>
            </div>
            <table className="w-full text-left">
              <thead className="bg-white">
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Data</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Propriedade</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Descrição</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {despesas.map(despesa => (
                  <tr key={despesa.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-600 text-sm">{despesa.data}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{despesa.propriedade}</td>
                    <td className="px-6 py-4 text-slate-600">{despesa.descricao}</td>
                    <td className="px-6 py-4 font-bold text-amber-600 text-right">- {despesa.valor} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}