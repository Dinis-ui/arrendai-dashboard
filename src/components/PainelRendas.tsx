import { Wallet, TrendingUp, Calendar, ArrowUpRight, CheckCircle, Clock } from 'lucide-react';

export default function PainelRendas() {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Controlo Financeiro</h1>
        <p className="text-slate-500 text-sm">Gere as rendas recebidas e os pagamentos pendentes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <div className="p-2 bg-white rounded-lg text-emerald-600"><Wallet size={20} /></div>
            <span className="text-xs font-bold text-emerald-600">+12% este mês</span>
          </div>
          <p className="text-sm text-emerald-700 font-medium">Total Recebido</p>
          <p className="text-2xl font-bold text-emerald-900">12.450,00 €</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">Histórico de Pagamentos</h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-white">
            <tr className="border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Inquilino</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Vencimento</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Valor</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-medium text-slate-800">Francisco Silva</td>
              <td className="px-6 py-4 text-slate-500">05 Mai 2026</td>
              <td className="px-6 py-4 font-bold text-slate-900">1.200€</td>
              <td className="px-6 py-4"><span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">Pago</span></td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-medium text-slate-800">Maria Ferreira</td>
              <td className="px-6 py-4 text-slate-500">01 Mai 2026</td>
              <td className="px-6 py-4 font-bold text-slate-900">1.550€</td>
              <td className="px-6 py-4"><span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">Pendente</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}