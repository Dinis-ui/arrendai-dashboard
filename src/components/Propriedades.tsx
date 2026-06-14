import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, MapPin, ArrowLeft, Home, Banknote, Users, PenSquare,
  ImageIcon, X, CheckCircle2, Megaphone, Euro, FileText,
  Mail, Phone, Briefcase, Star, ChevronLeft, ChevronRight, Plus, Trash2,
  MessageSquare, AlertTriangle, ShieldAlert, AlertCircle
} from 'lucide-react';

const dadosIniciaisPropriedades: any[] = [];

// LISTA DE COMODIDADES DISPONÍVEIS
const listaComodidades = [
  "Cozinha Equipada", "Garagem", "Elevador", "Varanda", 
  "Ar Condicionado", "Aquecimento Central", "Piscina", "Jardim",
  "Mobilado", "Permite Animais", "Internet Rápida", "Ginásio"
];

interface PropriedadesProps {
  onMudarParaAnuncios?: () => void;
  onMudarParaMensagens?: () => void; 
}

export default function Propriedades({ onMudarParaAnuncios, onMudarParaMensagens }: PropriedadesProps) {
  const navigate = useNavigate();
  
  const [propriedades, setPropriedades] = useState<any[]>(dadosIniciaisPropriedades);
  const [propriedadeSelecionadaId, setPropriedadeSelecionadaId] = useState<number | null>(null);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); 
  const [abrirModalAnuncio, setAbrirModalAnuncio] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isTenantProfileOpen, setIsTenantProfileOpen] = useState(false);
  
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(''); 
  const [sucessoAnuncio, setSucessoAnuncio] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Estados para Encerrar Contrato
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [caucaoAcao, setCaucaoAcao] = useState<'total' | 'parcial' | 'retencao'>('total');
  const [valorCaucaoOriginal, setValorCaucaoOriginal] = useState('');
  const [valorDeducao, setValorDeducao] = useState('');
  const [motivoDeducao, setMotivoDeducao] = useState('');

  // ESTADO DO UTILIZADOR PARA VERIFICAÇÃO DE PERFIL OBRIGATÓRIO
  const [user, setUser] = useState<any>(null);

  const [toastErro, setToastErro] = useState<{ativo: boolean, mensagem: string}>({ ativo: false, mensagem: '' });

  const mostrarErro = (mensagem: string) => {
    setToastErro({ ativo: true, mensagem });
    setTimeout(() => setToastErro({ ativo: false, mensagem: '' }), 5000); 
  };

  // ==============================================================
  // 0. CARREGAR DADOS DO SENHORIO (Para validação de perfil incompleto)
  // ==============================================================
  useEffect(() => {
    const carregarUtilizador = async () => {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      if (!token) return;
      try {
        const res = await fetch('http://127.0.0.1:8000/api/users/me/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setUser(await res.json());
        }
      } catch (e) {
        console.error("Erro ao carregar utilizador nas propriedades:", e);
      }
    };
    carregarUtilizador();
  }, []);

  // Lógica inteligente de compliance
  const isPerfilIncompleto = user && (!user.telefone || !user.nif || !user.iban);

  // ==============================================================
  // 1. CARREGAR PROPRIEDADES DA BASE DE DADOS (GET)
  // ==============================================================
  useEffect(() => {
    const buscarPropriedadesDaBD = async () => {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      if (!token) return;

      try {
        const response = await fetch('http://127.0.0.1:8000/api/users/propriedades/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const dadosReais = await response.json();
          
          if (dadosReais.length > 0) {
            const dadosFormatados = dadosReais.map((prop: any) => {
              let cor = 'bg-slate-50 text-slate-700';
              let estadoExibicao = prop.estado;

              if (prop.inquilino_atual) {
                estadoExibicao = 'Alugado';
                cor = 'bg-green-50 text-green-700';
              } else if (prop.status_aprovacao === 'pendente') {
                cor = 'bg-amber-50 text-amber-700';
                estadoExibicao = 'Em Revisão (Admin)';
              } else if (prop.estado === 'Vazio') {
                cor = 'bg-sky-50 text-sky-700';
              } else if (prop.estado === 'Em Obras') {
                cor = 'bg-red-50 text-red-700';
              }

              return {
                ...prop,
                preco: Number(prop.valor_estimado || 0),
                estado: estadoExibicao,
                cor: cor,
                inquilino: prop.inquilino_atual || null, 
                
                contratoInicio: prop.contrato_inicio || '-',
                contratoFim: prop.contrato_fim || '-',
                perfilInquilino: prop.perfil_inquilino || null,
                contratoId: prop.contrato_id || null, 
                
                imagem: prop.foto_principal || 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200',
                galeria: prop.foto_principal ? [prop.foto_principal] : ['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200']
              };
            });
            setPropriedades(dadosFormatados);
          }
        }
      } catch (error) {
        console.error("Erro ao ir buscar as propriedades à BD:", error);
      }
    };

    buscarPropriedadesDaBD();
  }, []);

  // ==============================================================
  // 2. CRIAR NOVA PROPRIEDADE
  // ==============================================================
  const handleAddProperty = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    
    formData.append('valor_estimado', formData.get('preco') as string);
    formData.delete('preco');

    // APANHAR AS COMODIDADES SELECIONADAS E JUNTÁ-LAS COM VÍRGULAS
    const comodidadesSelecionadas = formData.getAll('comodidades');
    if (comodidadesSelecionadas.length > 0) {
      formData.set('comodidades', comodidadesSelecionadas.join(', '));
    } else {
      formData.set('comodidades', ''); // Caso não selecione nada
    }

    const novoEstado = formData.get('estado') as string;
    let novaCor = 'bg-slate-50 text-slate-700';
    if (novoEstado === 'Alugado') novaCor = 'bg-green-50 text-green-700';
    if (novoEstado === 'Vazio') novaCor = 'bg-amber-50 text-amber-700';
    if (novoEstado === 'Em Obras') novaCor = 'bg-red-50 text-red-700';

    if (token) {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/users/propriedades/', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });

        if (response.ok) {
          const propriedadeCriadaNaBD = await response.json();
          const novaPropriedade = { 
            ...propriedadeCriadaNaBD,
            preco: Number(propriedadeCriadaNaBD.valor_estimado),
            cor: novaCor,
            inquilino: novoEstado === 'Alugado' ? 'Novo Inquilino' : null,
            contratoInicio: '-',
            contratoFim: '-',
            imagem: propriedadeCriadaNaBD.foto_principal || 'https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&cs=tinysrgb&w=1200',
            galeria: []
          };

          setPropriedades([novaPropriedade, ...propriedades]);
          setIsAddModalOpen(false);
          setToastMessage('Propriedade enviada para aprovação!');
          setShowSuccessToast(true);
          setTimeout(() => setShowSuccessToast(false), 3000);
        } else if (response.status === 403) {
          const errorData = await response.json();
          mostrarErro(errorData.error); 
          setIsAddModalOpen(false); 
        } else {
          alert("Não foi possível gravar na base de dados.");
        }
      } catch (error) {
        console.error("Erro de comunicação com a API:", error);
      }
    }
  };

  // ==============================================================
  // 3. EDITAR PROPRIEDADE
  // ==============================================================
  const handleSaveEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const novaMorada = formData.get('morada') as string;
    const novaArea = Number(formData.get('area'));
    const novoPreco = Number(formData.get('preco'));
    const novoEstado = formData.get('estado') as string;
    
    // Apanhar as comodidades na edição
    const comodidadesSelecionadas = formData.getAll('comodidades');
    const novasComodidades = comodidadesSelecionadas.join(', ');

    let novaCor = 'bg-slate-50 text-slate-700';
    if (novoEstado === 'Alugado') novaCor = 'bg-green-50 text-green-700';
    if (novoEstado === 'Vazio') novaCor = 'bg-amber-50 text-amber-700';
    if (novoEstado === 'Em Obras') novaCor = 'bg-red-50 text-red-700';

    const propriedadesAtualizadas = propriedades.map((p) => {
      if (p.id === propriedadeSelecionadaId) {
        return {
          ...p, morada: novaMorada, area: novaArea, preco: novoPreco, estado: novoEstado, cor: novaCor,
          inquilino: novoEstado === 'Alugado' ? p.inquilino || 'Novo Inquilino' : null,
          comodidades: novasComodidades
        };
      }
      return p;
    });

    setPropriedades(propriedadesAtualizadas);
    setIsEditModalOpen(false);
    setToastMessage('As alterações foram guardadas com sucesso.');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };
  
  // ==============================================================
  // 4. CRIAR ANÚNCIO
  // ==============================================================
  const handleCriarAnuncio = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    
    const titulo = formData.get('titulo') as string;
    const preco = Number(formData.get('preco'));

    if (propriedadeSelecionadaId && token) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/users/propriedades/${propriedadeSelecionadaId}/`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ anuncio_publicado: true, titulo_anuncio: titulo, preco_anuncio: preco })
        });

        if (response.ok) {
          setSucessoAnuncio(true); 
          setPropriedades(propriedades.map(p => 
            p.id === propriedadeSelecionadaId ? { ...p, anuncio_publicado: true, titulo_anuncio: titulo, preco_anuncio: preco } : p
          ));

          setTimeout(() => {
            setSucessoAnuncio(false);
            setAbrirModalAnuncio(false);
            if (onMudarParaAnuncios) onMudarParaAnuncios();
          }, 2000);
        } else if (response.status === 403) {
          const errorData = await response.json();
          alert(errorData.error);
          setAbrirModalAnuncio(false);
        } else {
          alert("Erro ao publicar o anúncio.");
        }
      } catch (error) {
        console.error("Erro na ligação:", error);
      }
    }
  };

  // ==============================================================
  // 5. APAGAR PROPRIEDADE
  // ==============================================================
  const apagarPropriedade = async (id: number, morada: string) => {
    const confirmacao = window.confirm(`Tens a certeza que queres apagar o imóvel em "${morada}"? Esta ação não pode ser desfeita.`);
    if (!confirmacao) return;

    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/users/propriedades/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok || response.status === 204) {
        setPropriedades(propriedades.filter(prop => prop.id !== id));
        setToastMessage('Propriedade apagada com sucesso!');
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      } else {
        alert("Não foi possível apagar a propriedade. Verifica se tens permissão.");
      }
    } catch (error) {
      console.error("Erro ao apagar:", error);
      alert("Ocorreu um erro na ligação ao servidor.");
    }
  };

  const nextImage = (galeria: string[]) => setCurrentImageIndex((prev) => (prev === galeria.length - 1 ? 0 : prev + 1));
  const prevImage = (galeria: string[]) => setCurrentImageIndex((prev) => (prev === 0 ? galeria.length - 1 : prev - 1));
  
  // ==============================================================
  // VISTA DE DETALHES DE UMA PROPRIEDADE
  // ==============================================================
  if (propriedadeSelecionadaId !== null) {
    const prop = propriedades.find(p => p.id === propriedadeSelecionadaId);
    if (!prop) return null;

    const handleEncerrarContrato = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!propriedadeSelecionadaId || !prop.contratoId) return;

      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/tenancies/tenancies/${prop.contratoId}/close/`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const despesasGuardadas = JSON.parse(localStorage.getItem('minhasDespesas') || '[]');
          const novosMovimentos = [];
          const dataHoje = new Date().toISOString().split('T')[0];

          const valorTotal = Number(valorCaucaoOriginal);
          const deducao = Number(valorDeducao);

          if (caucaoAcao === 'total') {
            novosMovimentos.push({ id: Date.now(), propriedade: prop.morada, descricao: 'Devolução Total de Caução', data: dataHoje, valor: valorTotal });
          } else if (caucaoAcao === 'parcial') {
            const valorDevolvido = valorTotal - deducao;
            novosMovimentos.push({ id: Date.now(), propriedade: prop.morada, descricao: 'Devolução Parcial de Caução', data: dataHoje, valor: valorDevolvido });
            novosMovimentos.push({ id: Date.now() + 1, propriedade: prop.morada, descricao: `Custo Reparação: ${motivoDeducao}`, data: dataHoje, valor: deducao });
          } else {
            if (deducao > 0) {
               novosMovimentos.push({ id: Date.now(), propriedade: prop.morada, descricao: `Custo Obras (Caução Retida): ${motivoDeducao}`, data: dataHoje, valor: deducao });
            }
          }

          localStorage.setItem('minhasDespesas', JSON.stringify([...novosMovimentos, ...despesasGuardadas]));

          setPropriedades(propriedades.map(p => 
            p.id === propriedadeSelecionadaId ? { ...p, estado: 'Vazio', cor: 'bg-sky-50 text-sky-700', inquilino: null, perfilInquilino: null, contratoInicio: '-', contratoFim: '-' } : p
          ));

          setIsCloseModalOpen(false);
          setToastMessage('Contrato encerrado e movimentos registados nas Despesas!');
          setShowSuccessToast(true);
          setTimeout(() => setShowSuccessToast(false), 4000);
          
          setValorCaucaoOriginal(''); setValorDeducao(''); setMotivoDeducao('');
        } else {
          alert("Não foi possível encerrar o contrato (possivelmente já está inativo).");
        }
      } catch (error) {
        alert("Erro ao comunicar com o servidor.");
      }
    };

    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500 pb-10 relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setPropriedadeSelecionadaId(null)}
              className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-500 hover:text-sky-600 shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                {prop.morada}
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${prop.cor}`}>
                  {prop.estado}
                </span>
              </h2>
              <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                <MapPin size={14} /> Detalhes e gestão desta unidade
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:border-sky-500 hover:text-sky-600 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm"
          >
            <PenSquare size={16} /> Editar Propriedade
          </button>
        </div>

        <div className="w-full h-72 rounded-3xl overflow-hidden mb-8 relative group shadow-sm border border-slate-200">
          <img src={prop.imagem} alt={`Foto de ${prop.morada}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
          
          <button 
            onClick={() => {
              setCurrentImageIndex(0);
              setIsGalleryOpen(true);
            }}
            className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/95 backdrop-blur-sm text-slate-800 font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-white hover:scale-105 transition-all shadow-lg"
          >
            <ImageIcon size={16} /> Ver Galeria
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-4">Características</h3>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center text-sky-600"><Home size={18} /></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Área Total</p>
                <p className="font-bold text-slate-800">{prop.area} m²</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><Banknote size={18} /></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor Renda</p>
                <p className="font-bold text-slate-800">{prop.preco} € <span className="text-xs text-slate-400 font-medium">/mês</span></p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600"><Building2 size={18} /></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipologia Ocupação</p>
                <p className="font-bold text-slate-800">Apartamento Inteiro</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6">Estado da Ocupação</h3>
            
            {prop.estado === 'Alugado' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Inquilino Atual</label>
                  <div 
                    onClick={() => {
                      if(prop.perfilInquilino) setIsTenantProfileOpen(true);
                    }}
                    className={`flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-4 transition-colors group ${prop.perfilInquilino ? 'cursor-pointer hover:border-sky-300 hover:bg-sky-50' : ''}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-sky-200 flex items-center justify-center text-sky-800 font-bold text-lg shadow-inner group-hover:scale-105 transition-transform">
                      {prop.inquilino?.substring(0, 2).toUpperCase() || "NI"}
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-slate-800 group-hover:text-sky-700">{prop.inquilino}</span>
                      {prop.perfilInquilino ? (
                        <span className="text-xs text-sky-600 font-medium mt-0.5">Ver Perfil Completo &rarr;</span>
                      ) : (
                         <span className="text-xs text-slate-400 font-medium mt-0.5">Sem perfil registado</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Início do Contrato</label>
                    <p className="font-bold text-slate-800 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">{prop.contratoInicio}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Fim do Contrato</label>
                    <p className="font-bold text-slate-800 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">{prop.contratoFim}</p>
                  </div>
                  
                  <button 
                    onClick={() => setIsCloseModalOpen(true)}
                    className="w-full mt-4 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-3 rounded-xl font-bold transition-colors border border-red-200"
                  >
                    <ShieldAlert size={18} /> Encerrar Contrato
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center flex-1 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6">
                <Users size={32} className="mx-auto text-slate-300 mb-3" />
                <p className="font-bold text-slate-600">Unidade {prop.estado}</p>
                <p className="text-sm text-slate-400 mb-4 max-w-sm mx-auto">Ainda não tens nenhum contrato ativo para esta propriedade.</p>
                <button 
                  onClick={() => setAbrirModalAnuncio(true)}
                  className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-md shadow-sky-500/20"
                >
                  Criar Novo Anúncio
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MODAL 1: EDITAR PROPRIEDADE */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <form onSubmit={handleSaveEdit} className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
                <h3 className="font-bold text-lg text-slate-800">Editar Propriedade</h3>
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full transition-colors">
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 space-y-5 overflow-y-auto">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Morada</label>
                  <input type="text" name="morada" required defaultValue={prop.morada} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:border-sky-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Área (m²)</label>
                    <input type="number" name="area" required defaultValue={prop.area} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:border-sky-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Preço (€)</label>
                    <input type="number" name="preco" required defaultValue={prop.preco} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:border-sky-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Estado Atual</label>
                  <select name="estado" defaultValue={prop.estado} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:border-sky-500 outline-none cursor-pointer">
                    <option value="Alugado">Alugado</option>
                    <option value="Vazio">Vazio</option>
                    <option value="Em Obras">Em Obras</option>
                  </select>
                </div>

                {/* SECÇÃO EDITAR COMODIDADES */}
                <div className="pt-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Comodidades e Extras</label>
                  <div className="grid grid-cols-2 gap-3">
                    {listaComodidades.map(com => (
                      <label key={com} className="flex items-center gap-2 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-sky-50 hover:border-sky-200 transition-all bg-slate-50">
                        <input 
                          type="checkbox" 
                          name="comodidades" 
                          value={com} 
                          defaultChecked={prop.comodidades?.includes(com)}
                          className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500" 
                        />
                        <span className="text-xs font-bold text-slate-700">{com}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>
              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 shrink-0">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancelar</button>
                <button type="submit" className="px-6 py-2.5 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors shadow-md shadow-sky-600/20">Guardar Alterações</button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL 2: GALERIA */}
        {isGalleryOpen && prop.galeria && (
          <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setIsGalleryOpen(false)} className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 p-3 rounded-full transition-all">
              <X size={24} />
            </button>
            <div className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center">
              <button onClick={() => prevImage(prop.galeria!)} className="absolute left-4 z-10 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-md transition-all">
                <ChevronLeft size={32} />
              </button>
              <img src={prop.galeria[currentImageIndex]} alt="Galeria" className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl animate-in fade-in duration-300" />
              <button onClick={() => nextImage(prop.galeria!)} className="absolute right-4 z-10 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-md transition-all">
                <ChevronRight size={32} />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold tracking-widest">
                {currentImageIndex + 1} / {prop.galeria.length}
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: INQUILINO */}
        {isTenantProfileOpen && prop.perfilInquilino && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
              <div className="h-32 bg-gradient-to-r from-sky-500 to-indigo-600 relative">
                <button onClick={() => setIsTenantProfileOpen(false)} className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 p-2 rounded-full transition-colors">
                  <X size={18} />
                </button>
                <div className="absolute -bottom-10 left-6">
                  <div className="w-24 h-24 rounded-2xl bg-white p-1.5 shadow-lg">
                    <div className="w-full h-full bg-sky-100 rounded-xl flex items-center justify-center text-sky-700 font-bold text-3xl">
                      {prop.perfilInquilino.nome.substring(0, 2).toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-14 pb-6 px-6 border-b border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{prop.perfilInquilino.nome}</h2>
                    <p className="text-sm text-slate-500">{prop.perfilInquilino.idade} anos</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-full font-bold text-sm">
                    <Star size={16} className="fill-amber-500" />
                    {prop.perfilInquilino.score}
                  </div>
                </div>
                <p className="text-sm text-slate-600 mt-4 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">"{prop.perfilInquilino.bio}"</p>
                
                <button 
                  onClick={() => {
                    setIsTenantProfileOpen(false);
                    if (onMudarParaMensagens) onMudarParaMensagens(); 
                  }}
                  className="w-full mt-5 flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl font-bold transition-all shadow-md shadow-sky-600/20"
                >
                  <MessageSquare size={18} /> Enviar Mensagem
                </button>
              </div>
              
              <div className="p-6 space-y-4 bg-slate-50/50">
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm"><Briefcase size={16} /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profissão</p>
                    <p className="font-bold text-slate-800">{prop.perfilInquilino.profissao}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm"><Mail size={16} /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                    <p className="font-bold text-slate-800">{prop.perfilInquilino.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm"><Phone size={16} /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Telefone</p>
                    <p className="font-bold text-slate-800">{prop.perfilInquilino.telefone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 4: CRIAR ANÚNCIO */}
        {abrirModalAnuncio && (
           <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
             <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center shadow-inner"><Megaphone size={24} /></div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Publicar Anúncio</h2>
                    <p className="text-sm text-slate-500">Unidade: Apartamento Inteiro - {prop.area} m²</p>
                  </div>
                </div>
                <button type="button" onClick={() => setAbrirModalAnuncio(false)} className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-white border border-transparent hover:border-slate-200 transition-all"><X size={20} /></button>
              </div>
              {sucessoAnuncio ? (
                <div className="p-12 text-center flex flex-col items-center justify-center animate-in zoom-in-95">
                  <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4"><Megaphone size={40} className="animate-bounce" /></div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Anúncio Publicado!</h3>
                  <p className="text-slate-500">A tua propriedade já está visível para os inquilinos.</p>
                </div>
              ) : (
                <form onSubmit={handleCriarAnuncio}>
                  <div className="p-6 space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><FileText size={16} className="text-slate-400" /> Título do Anúncio</label>
                      <input type="text" name="titulo" required defaultValue={`Fantástico apartamento em ${prop.morada}`} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-sky-500 focus:bg-white outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Euro size={16} className="text-slate-400" /> Renda Mensal</label>
                        <input type="number" name="preco" required defaultValue={prop.preco} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-sky-500 font-bold text-sky-700 outline-none" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button type="button" onClick={() => setAbrirModalAnuncio(false)} className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors">Cancelar</button>
                    <button type="submit" className="px-8 py-2.5 text-sm font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-xl transition-all shadow-lg shadow-sky-500/30">Publicar Agora</button>
                  </div>
                </form>
              )}
            </div>
           </div>
        )}

        {/* MODAL 6: ENCERRAR CONTRATO & CAUÇÃO */}
        {isCloseModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in-95">
            <form onSubmit={handleEncerrarContrato} className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-slate-100 bg-red-50/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center"><AlertTriangle size={20} /></div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">Encerrar Arrendamento</h3>
                    <p className="text-xs text-slate-500">Ação irreversível.</p>
                  </div>
                </div>
                <button type="button" onClick={() => setIsCloseModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"><X size={20} /></button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Valor da Caução Original (€)</label>
                  <input type="number" required value={valorCaucaoOriginal} onChange={e => setValorCaucaoOriginal(e.target.value)} placeholder="Ex: 2500" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 font-bold text-slate-700" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Ação sobre a Caução</label>
                  <div className="space-y-2">
                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${caucaoAcao === 'total' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-white border-slate-200'}`}>
                      <input type="radio" name="caucao" value="total" checked={caucaoAcao === 'total'} onChange={() => setCaucaoAcao('total')} className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-sm">Devolução Total (Imóvel sem danos)</span>
                    </label>
                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${caucaoAcao === 'parcial' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-white border-slate-200'}`}>
                      <input type="radio" name="caucao" value="parcial" checked={caucaoAcao === 'parcial'} onChange={() => setCaucaoAcao('parcial')} className="w-4 h-4 text-amber-600" />
                      <span className="font-bold text-sm">Devolução Parcial (Dedução de custos)</span>
                    </label>
                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${caucaoAcao === 'retencao' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-white border-slate-200'}`}>
                      <input type="radio" name="caucao" value="retencao" checked={caucaoAcao === 'retencao'} onChange={() => setCaucaoAcao('retencao')} className="w-4 h-4 text-red-600" />
                      <span className="font-bold text-sm">Retenção Total (Incumprimento grave)</span>
                    </label>
                  </div>
                </div>

                {caucaoAcao !== 'total' && (
                  <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Motivo da Dedução / Obras</label>
                      <input type="text" required value={motivoDeducao} onChange={e => setMotivoDeducao(e.target.value)} placeholder="Ex: Pintura e limpeza profunda" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-sm" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Custo a Deduzir (€)</label>
                      <input type="number" required value={valorDeducao} onChange={e => setValorDeducao(e.target.value)} placeholder="0.00" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold text-amber-700" />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                <button type="button" onClick={() => setIsCloseModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancelar</button>
                <button type="submit" className="px-6 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-md shadow-red-600/20">
                  Confirmar Encerramento
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    );
  }

  // ==========================================
  // VISTA: LISTAGEM GERAL
  // ==========================================
  return (
    <div className="animate-in fade-in duration-500 relative pb-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">As Minhas Propriedades</h2>
          <p className="text-sm text-slate-500">Gere as tuas unidades físicas e ocupação.</p>
        </div>
        
        {/* INTERCEPTAÇÃO E VALIDAÇÃO DO BOTÃO DE NOVA PROPRIEDADE */}
        <button 
          onClick={() => {
            if (isPerfilIncompleto) {
              mostrarErro("Ação Bloqueada: Tens de preencher todos os campos obrigatórios do teu Perfil (Telefone, NIF e IBAN) nas definições antes de poderes adicionar novas propriedades.");
              return;
            }
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-sky-600/20"
        >
          <Plus size={20} /> Nova Propriedade
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {propriedades.map((prop) => (
          <div 
            key={prop.id} onClick={() => setPropriedadeSelecionadaId(prop.id)}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-sky-200 transition-all p-6 cursor-pointer group flex flex-col"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-slate-100 shadow-sm">
                <img src={prop.imagem} alt={prop.morada} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${prop.cor}`}>
                  {prop.estado}
                </span>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation(); 
                    apagarPropriedade(prop.id, prop.morada);
                  }}
                  className="bg-red-50 hover:bg-red-500 text-red-500 hover:text-white p-1.5 rounded-lg transition-colors"
                  title="Apagar Imóvel"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="mt-auto">
              <h3 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-sky-600 transition-colors">{prop.morada}</h3>
              <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                <MapPin size={14} className="text-slate-400" />
                <span>{prop.area} m²</span>
                <span className="mx-1 w-1 h-1 rounded-full bg-slate-300"></span>
                <span>{prop.preco?.toLocaleString('pt-PT')}€/mês</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL 5: ADICIONAR NOVA PROPRIEDADE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <form onSubmit={handleAddProperty} encType="multipart/form-data" className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h3 className="font-bold text-lg text-slate-800">Nova Propriedade</h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 space-y-5 overflow-y-auto">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Fotografia Principal</label>
                <input type="file" name="foto_principal" accept="image/*" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:border-sky-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100" />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Morada</label>
                <input type="text" name="morada" required placeholder="Rua, Número, Localidade" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:border-sky-500 outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tipo</label>
                  <select name="tipo_casa" defaultValue="apartamento" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:border-sky-500 outline-none cursor-pointer">
                    <option value="apartamento">Apartamento</option>
                    <option value="moradia">Moradia</option>
                    <option value="quarto">Quarto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Estado Ocupação</label>
                  <select name="estado" defaultValue="Vazio" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:border-sky-500 outline-none cursor-pointer">
                    <option value="Vazio">Vazio</option>
                    <option value="Em Obras">Em Obras</option>
                    <option value="Alugado">Alugado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Área (m²)</label>
                  <input type="number" name="area" required placeholder="0" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:border-sky-500 outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Valor Estimado (€)</label>
                  <input type="number" name="preco" required placeholder="0" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:border-sky-500 outline-none" />
                </div>
              </div>

              {/* A NOVA SECÇÃO DE COMODIDADES */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Comodidades e Extras</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {listaComodidades.map(com => (
                    <label key={com} className="flex items-center gap-2 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-sky-50 hover:border-sky-200 transition-all bg-slate-50">
                      <input 
                        type="checkbox" 
                        name="comodidades" 
                        value={com} 
                        className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500" 
                      />
                      <span className="text-xs font-bold text-slate-700">{com}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 shrink-0">
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancelar</button>
              <button type="submit" className="px-6 py-2.5 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors shadow-md shadow-sky-600/20">Criar Propriedade</button>
            </div>
          </form>
        </div>
      )}

      {/* TOAST GLOBAL */}
      {showSuccessToast && (
        <div className="fixed bottom-10 right-10 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-50 animate-in fade-in slide-in-from-bottom-6">
          <div className="bg-white/20 p-2 rounded-full"><CheckCircle2 size={24} className="text-white" /></div>
          <div>
            <p className="font-bold text-sm">Sucesso!</p>
            <p className="text-xs text-emerald-100 mt-0.5">{toastMessage}</p>
          </div>
          <button onClick={() => setShowSuccessToast(false)} className="ml-4 text-emerald-200 hover:text-white"><X size={18} /></button>
        </div>
      )}
      
      {/* TOAST DE ERRO DE COMPLIANCE / LIMITES DO PLANO */}
      {toastErro.ativo && (
        <div className="fixed bottom-8 right-8 flex items-start gap-4 p-5 w-full max-w-md bg-rose-50 border border-rose-200 rounded-2xl shadow-2xl shadow-rose-900/10 z-[100] animate-in slide-in-from-bottom-8 fade-in duration-300">
          <AlertCircle className="text-rose-600 shrink-0 mt-0.5" size={24} />
          <div>
            <h4 className="text-rose-900 font-bold text-lg mb-1">Ação Bloqueada</h4>
            <p className="text-rose-700 text-sm font-medium leading-relaxed">{toastErro.mensagem}</p>
          </div>
          <button onClick={() => setToastErro({...toastErro, ativo: false})} className="text-rose-400 hover:text-rose-600 ml-auto">
            <X size={20} />
          </button>
        </div>
      )}
    </div>
  );
}