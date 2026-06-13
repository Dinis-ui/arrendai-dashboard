import { useState, useEffect } from 'react';
import { Check, Star, X, Smartphone, CreditCard, ShieldCheck } from 'lucide-react';

export default function PlanosSubscricao() {
  const [user, setUser] = useState<any>(null);
  const [planos, setPlanos] = useState<any[]>([]);
  
  // Estados do Pagamento
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [planoAPagar, setPlanoAPagar] = useState<any>(null);
  const [metodoPagamento, setMetodoPagamento] = useState<'mbway' | 'cartao'>('mbway');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const carregarDados = async () => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (!token) return;

    try {
      // 1. Carregar o utilizador logado
      const resUser = await fetch('http://127.0.0.1:8000/api/users/me/', { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      if (resUser.ok) setUser(await resUser.json());

      // 2. Carregar os Planos de Subscrição
      const resPlanos = await fetch('http://127.0.0.1:8000/api/users/planos/', { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      
      if (resPlanos.ok) {
        const dados = await resPlanos.json();
        console.log("DADOS DOS PLANOS RECEBIDOS DO DJANGO:", dados); // <-- Isto vai ajudar-nos a ver no F12
        
        // Se o Django devolver uma lista direta:
        if (Array.isArray(dados)) {
          setPlanos(dados);
        } 
        // Se o Django estiver a usar paginação (com o campo 'results'):
        else if (dados && Array.isArray(dados.results)) {
          setPlanos(dados.results);
        }
      }
    } catch (e) {
      console.error("Erro ao carregar os planos no React:", e);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const iniciarSubscricao = (plano: any) => {
    if (Number(plano.preco) === 0) {
      // Se for grátis, muda logo
      processarPagamentoDireto(plano.id);
    } else {
      setPlanoAPagar(plano);
      setIsPaymentModalOpen(true);
    }
  };

  const processarPagamentoDireto = async (planoId: number, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsProcessingPayment(true);
    
    setTimeout(async () => {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      try {
        const response = await fetch('http://127.0.0.1:8000/api/users/me/subscribe/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ plano_id: planoId })
        });

        if (response.ok) {
          await carregarDados(); // Atualiza o plano atual no ecrã
          setIsPaymentModalOpen(false);
          alert("Subscrição ativada com sucesso!");
        }
      } catch (error) {
        alert("Erro no pagamento.");
      } finally {
        setIsProcessingPayment(false);
      }
    }, 1500); // Simulador de tempo de banco
  };
  // Função de simulação para desenvolvimento
const simularMudancaPlano = async (planoId: number) => {
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  await fetch('http://127.0.0.1:8000/api/users/me/subscribe/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ plano_id: planoId })
  });
  alert("Simulação concluída! A atualizar...");
  window.location.reload(); // Recarrega para ver a mudança instantânea
};

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <div className="mb-10 text-center max-w-2xl mx-auto mt-8">
        <h2 className="text-3xl font-black text-slate-800 mb-4">Escolha o plano ideal para o seu negócio</h2>
        <p className="text-slate-500">Faça upgrade para gerir mais propriedades, publicar mais anúncios e aumentar a sua rentabilidade na nossa plataforma.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {planos.map((plano) => {
          const isAtual = user?.plano === plano.id;
          const isPremium = Number(plano.preco) > 10; // Destaque visual

          return (
            <div key={plano.id} className={`relative bg-white rounded-3xl p-8 flex flex-col transition-all ${isAtual ? 'border-2 border-sky-500 shadow-xl shadow-sky-500/10 scale-105 z-10' : 'border border-slate-200 shadow-sm hover:shadow-lg hover:border-sky-200'}`}>
              {isAtual && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-sky-500 text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase shadow-md">Plano Atual</div>}
              {isPremium && !isAtual && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase shadow-md flex items-center gap-1"><Star size={12} className="fill-white"/> Mais Popular</div>}
              
              <h3 className="text-xl font-bold text-slate-800 mb-2">{plano.nome}</h3>
              <div className="mb-6">
                <span className="text-4xl font-black text-slate-900">{Number(plano.preco).toLocaleString('pt-PT')}€</span>
                <span className="text-slate-400 font-medium">/mês</span>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                  <Check size={18} className="text-sky-500 shrink-0" /> Gestão até {plano.max_propriedades} {plano.max_propriedades === 1 ? 'Propriedade' : 'Propriedades'}
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                  <Check size={18} className="text-sky-500 shrink-0" /> {plano.max_anuncios} {plano.max_anuncios === 1 ? 'Anúncio ativo' : 'Anúncios ativos'}
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                  <Check size={18} className="text-sky-500 shrink-0" /> Suporte {isPremium ? 'Prioritário 24/7' : 'Standard'}
                </li>
              </ul>

              <button 
                disabled={isAtual}
                onClick={() => iniciarSubscricao(plano)}
                className={`w-full py-3.5 rounded-xl font-bold transition-all ${isAtual ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : isPremium ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-lg shadow-sky-600/20' : 'bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20'}`}
              >
                {isAtual ? 'Plano Ativo' : Number(plano.preco) === 0 ? 'Mudar para Grátis' : 'Fazer Upgrade'}
              </button>
            </div>
          );
        })}
      </div>

      {/* MODAL DE PAGAMENTO */}
      {isPaymentModalOpen && planoAPagar && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-50 border-b border-slate-200 p-6 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-xl">Subscrever Plano</h3>
                <p className="text-sm text-slate-500">{planoAPagar.nome}</p>
              </div>
              <button onClick={() => !isProcessingPayment && setIsPaymentModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white border border-slate-200 p-2 rounded-full"><X size={20} /></button>
            </div>
            
            <form onSubmit={(e) => processarPagamentoDireto(planoAPagar.id, e)} className="p-8 space-y-6">
              <div className="text-center mb-8">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Total a Pagar</p>
                <p className="text-5xl font-black text-slate-800">{Number(planoAPagar.preco).toLocaleString('pt-PT')}€</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div onClick={() => setMetodoPagamento('mbway')} className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 ${metodoPagamento === 'mbway' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 hover:border-sky-200 text-slate-500'}`}>
                  <Smartphone size={28} className={metodoPagamento === 'mbway' ? 'text-sky-500' : 'text-slate-400'} />
                  <span className="font-bold text-sm">MB Way</span>
                </div>
                <div onClick={() => setMetodoPagamento('cartao')} className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 ${metodoPagamento === 'cartao' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 hover:border-sky-200 text-slate-500'}`}>
                  <CreditCard size={28} className={metodoPagamento === 'cartao' ? 'text-sky-500' : 'text-slate-400'} />
                  <span className="font-bold text-sm">Cartão</span>
                </div>
              </div>

              {metodoPagamento === 'mbway' ? (
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Nº Telemóvel</label><input required type="tel" placeholder="Ex: 912 345 678" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 text-lg tracking-wider" /></div>
              ) : (
                <div className="space-y-4">
                  <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Número do Cartão</label><input required type="text" placeholder="0000 0000 0000 0000" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 text-lg tracking-wider" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Validade</label><input required type="text" placeholder="MM/AA" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 text-center" /></div>
                    <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">CVV</label><input required type="text" placeholder="123" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 text-center" /></div>
                  </div>
                </div>
              )}

              <button type="submit" disabled={isProcessingPayment} className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white py-4 rounded-xl font-bold mt-8 shadow-lg shadow-slate-900/20 transition-all flex justify-center items-center gap-2">
                {isProcessingPayment ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Processando...</> : <><ShieldCheck size={20} /> Confirmar Pagamento Seguro</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}