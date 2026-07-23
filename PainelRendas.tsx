import { useState, useEffect } from 'react';
import { Wallet, AlertCircle, CheckCircle, Download, Plus, Receipt, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const categoriasDespesa = [
  'Condomínio',
  'Água',
  'Eletricidade',
  'Gás',
  'Internet / Telecomunicações',
  'Reparação - Canalização',
  'Reparação - Eletricidade',
  'Reparação - Eletrodomésticos',
  'Obras e Manutenção Geral',
  'Impostos (IMI / AIMI)',
  'Seguro Multirriscos',
  'Limpeza',
  'Outro'
];

export default function PainelRendas() {
  const [activeTab, setActiveTab] = useState<'rendas' | 'despesas'>('rendas');
  const [isModalOpen, setIsModalOpen] = useState(false);


  // 1. DESPESAS (Guardadas no LocalStorage)
  const [despesas, setDespesas] = useState<any[]>(() => {
    const guardadas = localStorage.getItem('minhasDespesas');
    return guardadas ? JSON.parse(guardadas) : []; // <-- Alterado aqui para arrancar vazio!
  });

  const [novaDespesa, setNovaDespesa] = useState({ propriedade: '', descricao: '', valor: '', data: '' });

  // 2. RENDAS E PROPRIEDADES (Vêm do Django)
  const [rendas, setRendas] = useState<any[]>([]);
  const [minhasCasas, setMinhasCasas] = useState<any[]>([]); // <-- NOVO ESTADO: Guarda as tuas casas

  useEffect(() => {
    const carregarDados = async () => {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      if (!token) return;

      try {
        // A) Buscar os contratos (Rendas)
        const resRendas = await fetch('https://arrendai-dashboard.onrender.com](https://arrendai-dashboard.onrender.com/api/tenancies/tenancies/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (resRendas.ok) {
          const dados = await resRendas.json();
          const rendasFormatadas = dados.map((ct: any) => ({
            id: ct.id,
            propertyId: ct.property,
            inquilino: ct.tenant_name || `Inquilino #${ct.tenant}`,
            propriedade: ct.property_title || `Propriedade #${ct.property}`,
            vencimento: ct.start_date,
            valor: Number(ct.monthly_rent),
            estado: ct.payment_status || 'pendente'
          }));
          setRendas(rendasFormatadas);
        }

        // B) Buscar as propriedades do Senhorio para o Dropdown das Despesas
        const resCasas = await fetch('https://arrendai-dashboard.onrender.com](https://arrendai-dashboard.onrender.com/api/users/propriedades/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (resCasas.ok) {
          const casas = await resCasas.json();
          setMinhasCasas(casas);
        }

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    carregarDados();
  }, []);

  // MATEMÁTICA FINANCEIRA
  const totalRecebido = rendas.filter(r => r.estado === 'pago').reduce((acc, curr) => acc + curr.valor, 0);
  const totalAtraso = rendas.filter(r => r.estado === 'atraso').reduce((acc, curr) => acc + curr.valor, 0);
  const totalDespesas = despesas.reduce((acc, curr) => acc + curr.valor, 0);
  const saldoLiquido = totalRecebido - totalDespesas;

  // AÇÕES
  const marcarComoPago = async (id: number) => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    try {
      const response = await fetch(`https://arrendai-dashboard.onrender.com](https://arrendai-dashboard.onrender.com/api/tenancies/tenancies/${id}/pay/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setRendas(rendas.map(renda => renda.id === id ? { ...renda, estado: 'pago' } : renda));
      }
    } catch (e) {
      console.error("Erro ao marcar como pago", e);
    }
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
    const novaLista = [nova, ...despesas]; // Adiciona ao início da lista
    setDespesas(novaLista);
    localStorage.setItem('minhasDespesas', JSON.stringify(novaLista)); 
    
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
    <div className="animate-in fade-in duration-500 pb-10">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Financeiro</h1>
          <p className="text-slate-500 text-sm">Controle as suas receitas, despesas e pagamentos em atraso.</p>
        </div>
        <button onClick={exportarCSV} className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-900 transition-colors shadow-sm">
          <Download size={18} /> Exportar CSV
        </button>
      </div>

      {/* CARTÕES DE RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl shadow-sm">
          <p className="text-sm text-emerald-700 font-bold mb-2 flex items-center gap-1.5"><Wallet size={16}/> Rendas Recebidas</p>
          <p className="text-2xl font-bold text-emerald-900">{totalRecebido.toLocaleString('pt-PT')} €</p>
        </div>
        <div className="bg-red-50 border border-red-100 p-5 rounded-2xl shadow-sm">
          <p className="text-sm text-red-700 font-bold mb-2 flex items-center gap-1.5"><AlertCircle size={16}/> Rendas em Atraso</p>
          <p className="text-2xl font-bold text-red-900">{totalAtraso.toLocaleString('pt-PT')} €</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl shadow-sm">
          <p className="text-sm text-amber-700 font-bold mb-2 flex items-center gap-1.5"><Receipt size={16}/> Despesas</p>
          <p className="text-2xl font-bold text-amber-900">{totalDespesas.toLocaleString('pt-PT')} €</p>
        </div>
        <div className="bg-sky-50 border border-sky-100 p-5 rounded-2xl shadow-sm">
          <p className="text-sm text-sky-700 font-bold mb-2 flex items-center gap-1.5"><CheckCircle size={16}/> Saldo Líquido</p>
          <p className="text-2xl font-bold text-sky-900">{saldoLiquido.toLocaleString('pt-PT')} €</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button onClick={() => setActiveTab('rendas')} className={`flex-1 py-4 font-bold transition-colors ${activeTab === 'rendas' ? 'text-sky-600 border-b-2 border-sky-600 bg-sky-50' : 'text-slate-500 hover:bg-slate-50'}`}>Gestão de Rendas</button>
          <button onClick={() => setActiveTab('despesas')} className={`flex-1 py-4 font-bold transition-colors ${activeTab === 'despesas' ? 'text-sky-600 border-b-2 border-sky-600 bg-sky-50' : 'text-slate-500 hover:bg-slate-50'}`}>Registo de Despesas</button>
        </div>

        {activeTab === 'despesas' && (
          <div className="p-4 bg-slate-50 border-b border-gray-100 flex justify-end">
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-sky-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-sky-700 shadow-sm transition-all hover:-translate-y-0.5">
              <Plus size={18} /> Nova Despesa
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
              {rendas.length === 0 ? (
                 <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500 font-medium">Ainda não tens contratos de arrendamento ativos.</td></tr>
              ) : (
                rendas.map(r => (
                  <tr key={r.id} className="border-t border-gray-100 hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{r.inquilino}</p>
                      <Link to={`/imovel/${r.propertyId}`} className="text-xs text-slate-400 hover:text-sky-600 hover:underline block mt-0.5">
                        {r.propriedade}
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">{r.valor.toLocaleString('pt-PT')} €</td>
                    <td className="px-6 py-4">
                      {r.estado === 'pago' && <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">Pago</span>}
                      {r.estado === 'pendente' && <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">Pendente</span>}
                      {r.estado === 'atraso' && <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Em Atraso</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {r.estado !== 'pago' && (
                        <button onClick={() => marcarComoPago(r.id)} className="bg-white border border-sky-200 text-sky-600 hover:bg-sky-50 font-bold px-4 py-2 rounded-lg text-sm transition-colors">
                          Marcar Pago
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Data</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Propriedade & Descrição</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              {despesas.length === 0 ? (
                 <tr><td colSpan={3} className="px-6 py-12 text-center text-slate-500 font-medium">Sem despesas registadas.</td></tr>
              ) : (
                despesas.map(d => (
                  <tr key={d.id} className="border-t border-gray-100 hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(d.data).toLocaleDateString('pt-PT')}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{d.descricao}</p>
                      <p className="text-xs text-slate-400">{d.propriedade}</p>
                    </td>
                    <td className="px-6 py-4 text-red-600 font-bold text-right">- {d.valor.toLocaleString('pt-PT')} €</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={adicionarDespesa} className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-xl text-slate-800">Registar Despesa</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors"><X size={20}/></button>
            </div>
            
            <div className="space-y-4">
              {/* SELECT DA PROPRIEDADE */}
              <div className="relative">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Propriedade Afetada</label>
                <div className="relative">
                  <select 
                    required 
                    value={novaDespesa.propriedade}
                    onChange={e => setNovaDespesa({...novaDespesa, propriedade: e.target.value})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white appearance-none cursor-pointer text-slate-700"
                  >
                    <option value="" disabled>Selecione a casa...</option>
                    {minhasCasas.length === 0 && <option value="" disabled>A carregar propriedades...</option>}
                    {minhasCasas.map((casa) => (
                      <option key={casa.id} value={casa.titulo_anuncio || casa.morada}>
                        {casa.titulo_anuncio || casa.morada}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* SELECT DA DESCRIÇÃO (CATEGORIA) */}
              <div className="relative">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Categoria da Despesa</label>
                <div className="relative">
                  <select 
                    required 
                    value={novaDespesa.descricao}
                    onChange={e => setNovaDespesa({...novaDespesa, descricao: e.target.value})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white appearance-none cursor-pointer text-slate-700"
                  >
                    <option value="" disabled>Selecione o tipo de gasto...</option>
                    {categoriasDespesa.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Data</label>
                  <input required type="date" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-sm" onChange={e => setNovaDespesa({...novaDespesa, data: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Valor (€)</label>
                  <input required type="number" step="0.01" min="0" placeholder="0.00" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white" onChange={e => setNovaDespesa({...novaDespesa, valor: e.target.value})} />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3.5 rounded-xl font-bold mt-8 shadow-md transition-all hover:-translate-y-0.5">
              Registar Nova Despesa
            </button>
          </form>
        </div>
      )}
    </div>
  );
}