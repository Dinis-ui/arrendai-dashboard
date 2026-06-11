import { useState } from 'react';
import { 
  Building2, MapPin, ArrowLeft, Home, Banknote, Users, PenSquare,
  ImageIcon, X, CheckCircle2, Megaphone, Euro, FileText,
  Mail, Phone, Briefcase, Star, Calendar, ChevronLeft, ChevronRight
} from 'lucide-react';

// Dados iniciais (Mudámos o nome para servir de base ao useState)
const dadosIniciaisPropriedades = [
  { 
    id: 1, 
    morada: 'Rua Garrett 12, Lisboa', 
    area: 85, 
    preco: 1200, 
    estado: 'Alugado', 
    cor: 'bg-green-50 text-green-700',
    inquilino: 'Maria Ferreira',
    contratoInicio: '01 Jan 2024',
    contratoFim: '31 Dez 2025',
    imagem: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200',
    galeria: [
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=1200'
    ],
    perfilInquilino: {
      nome: 'Maria Ferreira',
      idade: 28,
      profissao: 'Engenheira de Software',
      email: 'maria.ferreira@email.com',
      telefone: '+351 912 345 678',
      membroDesde: 'Outubro 2023',
      score: 4.9,
      bio: 'Inquilina tranquila, organizada e com histórico perfeito de pagamentos de rendas nas propriedades anteriores.'
    }
  },
  { 
    id: 2, 
    morada: 'Av. da Boavista 450, Porto', 
    area: 110, 
    preco: 1550, 
    estado: 'Vazio', 
    cor: 'bg-amber-50 text-amber-700',
    inquilino: null,
    contratoInicio: '-',
    contratoFim: '-',
    imagem: 'https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=1200',
    galeria: [
      'https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200'
    ],
    perfilInquilino: null
  }
];

interface PropriedadesProps {
  onMudarParaAnuncios?: () => void;
}

export default function Propriedades({ onMudarParaAnuncios }: PropriedadesProps) {
  // CRIAÇÃO DO ESTADO DINÂMICO DAS PROPRIEDADES
  const [propriedades, setPropriedades] = useState(dadosIniciaisPropriedades);
  const [propriedadeSelecionadaId, setPropriedadeSelecionadaId] = useState<number | null>(null);
  
  // Estados dos Modais
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [abrirModalAnuncio, setAbrirModalAnuncio] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isTenantProfileOpen, setIsTenantProfileOpen] = useState(false);
  
  // Outros Estados
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [sucessoAnuncio, setSucessoAnuncio] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // LÓGICA DO BOTÃO "GUARDAR ALTERAÇÕES"
  const handleSaveEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Pegar nos novos valores que foram escritos no formulário
    const novaMorada = formData.get('morada') as string;
    const novaArea = Number(formData.get('area'));
    const novoPreco = Number(formData.get('preco'));
    const novoEstado = formData.get('estado') as string;

    // Definir as cores automáticas conforme o estado selecionado
    let novaCor = 'bg-slate-50 text-slate-700';
    if (novoEstado === 'Alugado') novaCor = 'bg-green-50 text-green-700';
    if (novoEstado === 'Vazio') novaCor = 'bg-amber-50 text-amber-700';
    if (novoEstado === 'Em Obras') novaCor = 'bg-red-50 text-red-700';

    // Mapear o array e atualizar apenas a propriedade que está ativa
    const propriedadesAtualizadas = propriedades.map((p) => {
      if (p.id === propriedadeSelecionadaId) {
        return {
          ...p,
          morada: novaMorada,
          area: novaArea,
          preco: novoPreco,
          estado: novoEstado,
          cor: novaCor,
          // Se mudou para Vazio, limpa o inquilino da pré-visualização
          inquilino: novoEstado === 'Alugado' ? p.inquilino || 'Novo Inquilino' : null
        };
      }
      return p;
    });

    // Guardar no estado para atualizar o ecrã instantaneamente
    setPropriedades(propriedadesAtualizadas);
    setIsEditModalOpen(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };
  
  // Criar Anúncio e enviar para o LocalStorage
  const handleCriarAnuncio = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSucessoAnuncio(true);
    
    const formData = new FormData(e.currentTarget);
    const propInfo = propriedades.find(p => p.id === propriedadeSelecionadaId);

    if (propInfo) {
      const novoAnuncio = {
        id: Date.now(),
        titulo: formData.get('titulo'),
        title: formData.get('titulo'),
        preco: `${Number(formData.get('preco'))}€`,
        price: `${Number(formData.get('preco'))}€`,
        location: propInfo.morada,
        area: propInfo.area,
        tipo: 'Apartamento Inteiro', 
        estado: 'Em Revisão',
        status: 'Em Revisão', 
        cor: 'text-amber-600 bg-amber-50',
        views: 0,
        candidates: 0,
        photo: propInfo.imagem
      };

      const anunciosGuardados = JSON.parse(localStorage.getItem('meusAnuncios') || '[]');
      localStorage.setItem('meusAnuncios', JSON.stringify([novoAnuncio, ...anunciosGuardados]));
    }
    
    setTimeout(() => {
      setSucessoAnuncio(false);
      setAbrirModalAnuncio(false);
      if (onMudarParaAnuncios) onMudarParaAnuncios();
    }, 2000);
  };

  // Funções da Galeria
  const nextImage = (galeria: string[]) => {
    setCurrentImageIndex((prev) => (prev === galeria.length - 1 ? 0 : prev + 1));
  };
  const prevImage = (galeria: string[]) => {
    setCurrentImageIndex((prev) => (prev === 0 ? galeria.length - 1 : prev - 1));
  };
  
  // Detalhes da propriedade ativa
  if (propriedadeSelecionadaId !== null) {
    const prop = propriedades.find(p => p.id === propriedadeSelecionadaId);
    if (!prop) return null;

    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500 pb-10 relative">
        
        {/* HEADER */}
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
          
          {/* BOTÃO 1: EDITAR PROPRIEDADE */}
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:border-sky-500 hover:text-sky-600 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm"
          >
            <PenSquare size={16} /> Editar Propriedade
          </button>
        </div>

      
        {/* IMAGEM E BOTÃO GALERIA */}
        <div className="w-full h-72 rounded-3xl overflow-hidden mb-8 relative group shadow-sm border border-slate-200">
          <img src={prop.imagem} alt={`Foto de ${prop.morada}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
          
          {/* BOTÃO 2: VER GALERIA */}
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

        {/* CARDS */}
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
                  
                  {/* BOTÃO 3: VER PERFIL DO INQUILINO */}
                  <div 
                    onClick={() => setIsTenantProfileOpen(true)}
                    className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 cursor-pointer hover:border-sky-300 hover:bg-sky-50 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-full bg-sky-200 flex items-center justify-center text-sky-800 font-bold text-lg shadow-inner group-hover:scale-105 transition-transform">
                      {prop.inquilino?.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-slate-800 group-hover:text-sky-700">{prop.inquilino}</span>
                      <span className="text-xs text-sky-600 font-medium mt-0.5">Ver Perfil Completo &rarr;</span>
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
                </div>
              </div>
            ) : (
              <div className="text-center flex-1 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6">
                <Users size={32} className="mx-auto text-slate-300 mb-3" />
                <p className="font-bold text-slate-600">Unidade Vazia</p>
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

        {/* MODAL 1: FORMULÁRIO DE EDIÇÃO REAL */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            {/* Transformado em <form> legítimo para ler os valores ao submeter */}
            <form onSubmit={handleSaveEdit} className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-800">Editar Propriedade</h3>
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full transition-colors">
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 space-y-5">
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
              </div>
              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancelar</button>
                <button type="submit" className="px-6 py-2.5 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors shadow-md shadow-sky-600/20">Guardar Alterações</button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL 2: GALERIA DE FOTOS */}
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

        {/* MODAL 3: PERFIL DO INQUILINO */}
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

        {/* Aviso Sucesso */}
        {showSuccessToast && (
          <div className="fixed bottom-10 right-10 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-50 animate-in fade-in slide-in-from-bottom-6">
            <div className="bg-white/20 p-2 rounded-full"><CheckCircle2 size={24} className="text-white" /></div>
            <div>
              <p className="font-bold text-sm">Propriedade atualizada!</p>
              <p className="text-xs text-emerald-100 mt-0.5">As alterações foram salvas e renderizadas.</p>
            </div>
            <button onClick={() => setShowSuccessToast(false)} className="ml-4 text-emerald-200 hover:text-white"><X size={18} /></button>
          </div>
        )}
      </div>
    );
  }

  // LISTAGEM GERAL DAS PROPRIEDADES (Lê do estado "propriedades")
  return (
    <div className="animate-in fade-in duration-500 relative pb-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">As Minhas Propriedades</h2>
          <p className="text-sm text-slate-500">Gere as tuas unidades físicas e ocupação.</p>
        </div>
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
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${prop.cor}`}>{prop.estado}</span>
            </div>
            <div className="mt-auto">
              <h3 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-sky-600 transition-colors">{prop.morada}</h3>
              <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                <MapPin size={14} className="text-slate-400" />
                <span>{prop.area} m²</span>
                <span className="mx-1 w-1 h-1 rounded-full bg-slate-300"></span>
                <span>{prop.preco.toLocaleString('pt-PT')}€/mês</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}