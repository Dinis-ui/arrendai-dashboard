import { useState, useEffect } from 'react';
import { 
  Plus, MoreVertical, CheckCircle2, Clock, XCircle, 
  X, MapPin, Banknote, FileText, Eye, Edit2, 
  PauseCircle, Trash2, Home, Megaphone
} from 'lucide-react';

export default function Anuncios() {
  const [propriedadesTodas, setPropriedadesTodas] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState(''); 
  const [menuAberto, setMenuAberto] = useState<number | null>(null);
  const [anuncioSendoEditado, setAnuncioSendoEditado] = useState<any>(null);

  // 1. CARREGAR DADOS REAIS DO DJANGO
  const carregarDados = async () => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (!token) return;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/propriedades/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const dados = await response.json();
        setPropriedadesTodas(dados);
      }
    } catch (error) {
      console.error("Erro ao carregar propriedades:", error);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // SEPARAR O QUE É ANÚNCIO DO QUE É APENAS PROPRIEDADE FECHADA
  const anuncios = propriedadesTodas.filter(p => p.anuncio_publicado === true);
  const propriedadesDisponiveis = propriedadesTodas.filter(p => p.anuncio_publicado === false);

  const mostrarAviso = (mensagem: string) => {
    setToastMsg(mensagem);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // 2. PAUSAR / REMOVER ANÚNCIO (Não apaga a casa, apenas a tira da montra pública)
  const handleRemoverAnuncio = async (id: number) => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/users/propriedades/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ anuncio_publicado: false }) // Esconde o anúncio
      });

      if (response.ok) {
        carregarDados();
        setMenuAberto(null);
        mostrarAviso('Anúncio retirado do ar com sucesso.');
      }
    } catch (error) {
      console.error("Erro ao remover anúncio:", error);
    }
  };

  // 3. GUARDAR FORMULÁRIO (CRIAR NOVO OU EDITAR)
  const handlePublish = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Se for edição, usamos o ID do anúncio a editar. Se for novo, usamos o ID selecionado no dropdown.
    const propriedadeId = anuncioSendoEditado ? anuncioSendoEditado.id : formData.get('propriedade_id');
    const titulo = formData.get('titulo') as string;
    const preco = Number(formData.get('preco'));

    if (!propriedadeId) {
      alert("Por favor, selecione uma propriedade.");
      return;
    }

    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/users/propriedades/${propriedadeId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          anuncio_publicado: true, // Coloca na montra
          titulo_anuncio: titulo,
          preco_anuncio: preco
        })
      });

      if (response.ok) {
        carregarDados(); // Atualiza a lista com o que vem da BD
        fecharModal();
        mostrarAviso(anuncioSendoEditado ? 'Anúncio atualizado!' : 'Novo anúncio publicado na montra!');
      } else {
        alert("Erro ao guardar o anúncio.");
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setAnuncioSendoEditado(null);
  };

  const toggleMenu = (id: number) => {
    setMenuAberto(menuAberto === id ? null : id);
  };

  return (
    <div className="animate-in fade-in duration-500 relative pb-10">
      
      {/* CABEÇALHO */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Montra de Anúncios</h2>
          <p className="text-sm text-slate-500">Gira os anúncios que estão visíveis para os inquilinos.</p>
        </div>
        
        <button 
          onClick={() => {
            setAnuncioSendoEditado(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-sky-600/20"
        >
          <Plus size={20} /> Publicar Anúncio
        </button>
      </div>

      {/* GRELHA DE CARTÕES DE ANÚNCIOS */}
      {anuncios.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 flex flex-col items-center justify-center py-20 text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Megaphone size={32} className="text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-700 mb-1">Nenhum anúncio ativo</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">Ainda não tens propriedades publicadas na montra. Clica no botão acima para criares o teu primeiro anúncio.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {anuncios.map((anuncio) => {
            // Lógica de cores baseada no status de aprovação do Django
            let statusLabel = 'Em Revisão';
            let statusColor = 'bg-amber-100 text-amber-700';
            let StatusIcon = Clock;

            if (anuncio.status_aprovacao?.toLowerCase() === 'aprovado') {
              statusLabel = 'Ativo e Online';
              statusColor = 'bg-emerald-100 text-emerald-700';
              StatusIcon = CheckCircle2;
            } else if (anuncio.status_aprovacao?.toLowerCase() === 'rejeitado') {
              statusLabel = 'Rejeitado (Admin)';
              statusColor = 'bg-red-100 text-red-700';
              StatusIcon = XCircle;
            }

            return (
              <div key={anuncio.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col relative group">
                
                {/* MENU DE OPÇÕES (3 Pontinhos) */}
                <div className="absolute top-4 right-4 z-20">
                  <button 
                    onClick={() => toggleMenu(anuncio.id)}
                    className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-600 hover:bg-white hover:text-sky-600 shadow-sm transition-colors"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {menuAberto === anuncio.id && (
                    <div className="absolute right-0 top-10 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-in fade-in zoom-in-95">
                      <button 
                        onClick={() => { setAnuncioSendoEditado(anuncio); setIsModalOpen(true); setMenuAberto(null); }} 
                        className="w-full px-4 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                      >
                        <Edit2 size={16} className="text-sky-500" /> Editar Título/Preço
                      </button>
                      <div className="h-px bg-slate-100 my-1 mx-2"></div>
                      <button 
                        onClick={() => handleRemoverAnuncio(anuncio.id)} 
                        className="w-full px-4 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-3"
                      >
                        <PauseCircle size={16} className="text-red-500" /> Pausar / Esconder
                      </button>
                    </div>
                  )}
                </div>

                {/* IMAGEM */}
                <div className="relative h-48 rounded-t-3xl overflow-hidden">
                  <img 
                    src={anuncio.foto_principal || 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'} 
                    alt={anuncio.titulo_anuncio} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md shadow-sm ${statusColor}`}>
                      <StatusIcon size={14} /> {statusLabel}
                    </span>
                  </div>
                </div>

                {/* INFORMAÇÃO DO CARTÃO */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-2 leading-tight">
                    {anuncio.titulo_anuncio || `Fantástico imóvel em ${anuncio.morada}`}
                  </h3>
                  
                  <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium mb-4 mt-auto pt-2">
                    <MapPin size={14} className="text-slate-400" />
                    <span className="truncate">{anuncio.morada}</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Renda Mensal</p>
                      <p className="font-bold text-xl text-slate-900">{Number(anuncio.preco_anuncio || 0).toLocaleString('pt-PT')}€</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Tipologia</p>
                       <p className="font-bold text-sm text-slate-700 capitalize">{anuncio.tipo_casa || 'Indisponível'}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      
      {/* MODAL: CRIAR OU EDITAR ANÚNCIO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <form onSubmit={handlePublish} className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col">
            
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center shadow-inner">
                  <Megaphone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-800">
                    {anuncioSendoEditado ? 'Editar Anúncio' : 'Publicar Anúncio'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {anuncioSendoEditado ? 'Altere o chamariz do seu imóvel.' : 'Escolha uma propriedade para colocar na montra.'}
                  </p>
                </div>
              </div>
              <button type="button" onClick={fecharModal} className="text-slate-400 hover:text-slate-600 bg-white border border-slate-200 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Se for um NOVO anúncio, pede para escolher qual a propriedade física */}
              {!anuncioSendoEditado && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">1. Qual Propriedade queres anunciar?</label>
                  <div className="relative">
                    <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select 
                      name="propriedade_id"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm appearance-none focus:ring-2 focus:ring-sky-500 outline-none cursor-pointer font-medium text-slate-700"
                    >
                      <option value="">Selecione uma propriedade escondida...</option>
                      {propriedadesDisponiveis.map(p => (
                        <option key={p.id} value={p.id}>{p.morada} ({p.tipo_casa})</option>
                      ))}
                    </select>
                  </div>
                  {propriedadesDisponiveis.length === 0 && (
                    <p className="text-xs text-red-500 font-medium ml-1 mt-1">Atenção: Não tens propriedades disponíveis. Cria uma no painel de "Propriedades" primeiro.</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Título Chamativo</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    name="titulo"
                    required
                    defaultValue={anuncioSendoEditado ? anuncioSendoEditado.titulo_anuncio : ''}
                    placeholder="Ex: T2 Moderno no Chiado com Varanda" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all font-medium text-slate-800" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Renda Mensal Desejada (€)</label>
                <div className="relative">
                  <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="number" 
                    name="preco"
                    required
                    defaultValue={anuncioSendoEditado ? anuncioSendoEditado.preco_anuncio : ''}
                    placeholder="Ex: 850" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all font-bold text-sky-700" 
                  />
                </div>
              </div>
              
              <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100 flex items-start gap-3">
                <CheckCircle2 className="text-sky-500 shrink-0 mt-0.5" size={18} />
                <p className="text-xs text-sky-800 leading-relaxed font-medium">As fotografias, localização exata e detalhes estruturais serão automaticamente importados do perfil da propriedade.</p>
              </div>

            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 shrink-0">
              <button type="button" onClick={fecharModal} className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">Cancelar</button>
              <button 
                type="submit" 
                disabled={!anuncioSendoEditado && propriedadesDisponiveis.length === 0}
                className="px-8 py-3 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-2xl transition-all shadow-lg shadow-sky-600/20"
              >
                {anuncioSendoEditado ? 'Guardar Edição' : 'Submeter para Aprovação'}
              </button>
            </div>

          </form>
        </div>
      )}

      {/* TOAST DE AVISOS */}
      {toastMsg && (
        <div className="fixed bottom-10 right-10 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-8 z-50">
          <div className="bg-white/20 p-2 rounded-full">
            <CheckCircle2 size={24} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm">{toastMsg}</p>
          </div>
          <button onClick={() => setToastMsg('')} className="ml-4 text-emerald-200 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
      )}

    </div>
  );
}