import { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  X, 
  Upload, 
  Home, 
  MapPin, 
  Banknote,
  FileText,
  Eye,
  Edit2,
  PauseCircle,
  Trash2
} from 'lucide-react';

// Dados iniciais
const dadosIniciais = [
  { id: 1, titulo: 'Apartamento T2 Vista Rio', tipo: 'Apartamento Inteiro', estado: 'Ativo', preco: '1200€', cor: 'text-green-600 bg-green-50' },
  { id: 2, titulo: 'Quarto em Entrecampos', tipo: 'Quarto Privado', estado: 'Em Revisão', preco: '450€', cor: 'text-amber-600 bg-amber-50' },
  { id: 3, titulo: 'Studio Baixa Pombalina', tipo: 'Estúdio', estado: 'Rejeitado', preco: '900€', cor: 'text-red-600 bg-red-50' },
];

export default function Anuncios() {

  // LER DO LOCAL STORAGE (Assim vê os anúncios criados nas Propriedades!)
  const carregarAnunciosIniciais = () => {
    const guardados = localStorage.getItem('meusAnuncios');
    return guardados ? JSON.parse(guardados) : dadosIniciais;
  };

  // ESTADOS 
  const [anuncios, setAnuncios] = useState<any[]>(carregarAnunciosIniciais());
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState(''); 
  const [menuAberto, setMenuAberto] = useState<number | null>(null);
  
  const [anuncioSendoEditado, setAnuncioSendoEditado] = useState<any>(null);

  // Upload de fotos
  const [fotos, setFotos] = useState<{file: File, preview: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincroniza sempre que a aba é aberta (caso tenham vindo da aba Propriedades)
  useEffect(() => {
    setAnuncios(carregarAnunciosIniciais());
  }, []);
  
  // Mostrar Aviso
  const mostrarAviso = (mensagem: string) => {
    setToastMsg(mensagem);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Atualizar a lista de anúncios no State e no LocalStorage
  const atualizarAnuncios = (novaLista: any[]) => {
    setAnuncios(novaLista);
    localStorage.setItem('meusAnuncios', JSON.stringify(novaLista));
  };

  // Apagar Anúncio
  const handleApagar = (id: number) => {
    const novaLista = anuncios.filter(anuncio => anuncio.id !== id);
    atualizarAnuncios(novaLista);
    setMenuAberto(null);
    mostrarAviso('Anúncio apagado com sucesso.');
  };

  // Pausar Anúncio
  const handlePausar = (id: number) => {
    const novaLista = anuncios.map(anuncio => {
      if (anuncio.id === id) {
        // Compatibilidade com "status" (das propriedades) ou "estado" (dos anúncios)
        const estadoAtual = anuncio.estado || anuncio.status;
        const isPausado = estadoAtual === 'Pausado';
        return {
          ...anuncio,
          estado: isPausado ? 'Em Revisão' : 'Pausado',
          status: isPausado ? 'Em Revisão' : 'Pausado', // Atualiza os dois para garantir
          cor: isPausado ? 'text-amber-600 bg-amber-50' : 'text-slate-600 bg-slate-100'
        };
      }
      return anuncio;
    });
    atualizarAnuncios(novaLista);
    setMenuAberto(null);
    mostrarAviso('Estado do anúncio atualizado.');
  };

  // Editar Anúncio
  const handleEditar = (anuncio: any) => {
    setAnuncioSendoEditado(anuncio); 
    setIsModalOpen(true); 
    setMenuAberto(null); 
  };

  // Ver Anúncio
  const handleVerAnuncio = () => {
    setMenuAberto(null);
    mostrarAviso('A redirecionar para a página pública...');
  };

  // Fechar Modal e limpar dados
  const fecharModal = () => {
    setIsModalOpen(false);
    setAnuncioSendoEditado(null);
    setFotos([]);
  };

  // GUARDAR O FORMULÁRIO (CRIAR/EDITAR)
  const handlePublish = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Apanhar os valores dos inputs pelo "name"
    const titulo = formData.get('titulo') as string;
    const tipo = formData.get('tipo') as string;
    const precoBruto = formData.get('preco') as string;
    const precoFormatado = precoBruto.includes('€') ? precoBruto : `${precoBruto}€`;

    let novaLista;

    if (anuncioSendoEditado) {
      // EDITAR
      novaLista = anuncios.map(a => a.id === anuncioSendoEditado.id 
        ? { ...a, titulo: titulo, title: titulo, tipo: tipo, preco: precoFormatado, price: precoFormatado } 
        : a
      );
      mostrarAviso('Anúncio atualizado com sucesso!');
    } else {
      // NOVO ANÚNCIO
      const novoAnuncio = {
        id: Date.now(),
        titulo: titulo,
        title: titulo, // Guardamos nos dois formatos para ser compatível com as outras páginas
        tipo: tipo,
        estado: 'Em Revisão',
        status: 'Em Revisão',
        preco: precoFormatado,
        price: precoFormatado,
        cor: 'text-amber-600 bg-amber-50'
      };
      novaLista = [novoAnuncio, ...anuncios];
      mostrarAviso('Novo anúncio submetido para revisão!');
    }

    atualizarAnuncios(novaLista);
    fecharModal();
  };

  // Funcões de fotos
  const handleDivClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const novosFicheiros = Array.from(e.target.files).map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setFotos(prevFotos => [...prevFotos, ...novosFicheiros]);
    }
  };

  const removeFoto = (indexToRemove: number) => {
    setFotos(prevFotos => prevFotos.filter((_, index) => index !== indexToRemove));
  };

  const toggleMenu = (id: number) => {
    setMenuAberto(menuAberto === id ? null : id);
  };

  return (
    <div className="animate-in fade-in duration-500 relative">
      
      {/* CABEÇALHO */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestão de Anúncios</h2>
          <p className="text-sm text-slate-500">Acompanhe o estado de aprovação das suas propriedades.</p>
        </div>
        
        <button 
          onClick={() => {
            setAnuncioSendoEditado(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-sky-600/20"
        >
          <Plus size={20} /> Novo Anúncio
        </button>
      </div>

      {/* TABELA DE ANÚNCIOS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider rounded-tl-2xl">Título</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Estado de Moderação</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Preço</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider text-right rounded-tr-2xl">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {anuncios.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  Nenhum anúncio encontrado. Crie um novo!
                </td>
              </tr>
            ) : (
              anuncios.map((anuncio) => {
                // Compatibilidade entre os dados iniciais e os vindos de "Propriedades"
                const tituloExibicao = anuncio.titulo || anuncio.title;
                const estadoExibicao = anuncio.estado || anuncio.status || 'Ativo';
                let precoExibicao = anuncio.preco || anuncio.price;
                if (!String(precoExibicao).includes('€')) precoExibicao = `${precoExibicao}€`;
                
                const corExibicao = anuncio.cor || (estadoExibicao === 'Ativo' ? 'text-green-600 bg-green-50' : 'text-sky-600 bg-sky-50');

                return (
                  <tr key={anuncio.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-800">{tituloExibicao}</p>
                      <p className="text-xs text-slate-400">{anuncio.tipo || 'Imóvel'}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-current/10 ${corExibicao}`}>
                        {estadoExibicao === 'Ativo' && <CheckCircle2 size={14} />}
                        {estadoExibicao === 'Em Revisão' && <Clock size={14} />}
                        {estadoExibicao === 'Rejeitado' && <XCircle size={14} />}
                        {estadoExibicao === 'Pausado' && <PauseCircle size={14} />}
                        {estadoExibicao}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-bold text-slate-700">{precoExibicao}</td>
                    
                    {/* COLUNA DAS AÇÕES */}
                    <td className="px-6 py-5 text-right relative">
                      <button 
                        onClick={() => toggleMenu(anuncio.id)}
                        className={`p-2 rounded-lg transition-colors ${menuAberto === anuncio.id ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                      >
                        <MoreVertical size={20} />
                      </button>

                      {/* MENU DROPDOWN */}
                      {menuAberto === anuncio.id && (
                        <div className="absolute right-12 top-10 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                          <button onClick={handleVerAnuncio} className="w-full px-4 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors">
                            <Eye size={16} className="text-slate-400" /> Ver Anúncio
                          </button>
                          <button onClick={() => handleEditar(anuncio)} className="w-full px-4 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors">
                            <Edit2 size={16} className="text-sky-500" /> Editar Anúncio
                          </button>
                          <button onClick={() => handlePausar(anuncio.id)} className="w-full px-4 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors">
                            <PauseCircle size={16} className="text-amber-500" /> 
                            {estadoExibicao === 'Pausado' ? 'Retomar Anúncio' : 'Pausar Anúncio'}
                          </button>
                          <div className="h-px bg-slate-100 my-1 mx-2"></div>
                          <button onClick={() => handleApagar(anuncio.id)} className="w-full px-4 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors">
                            <Trash2 size={16} className="text-red-500" /> Apagar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      
      {/* MODAL: Criar OU Editar -> AGORA É UM FORMULÁRIO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <form onSubmit={handlePublish} className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Header do Modal */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
              <div>
                <h3 className="font-black text-xl text-slate-800 uppercase tracking-tight">
                  {anuncioSendoEditado ? 'Editar Anúncio' : 'Publicar Novo Anúncio'}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  {anuncioSendoEditado ? 'Atualize os dados e guarde as alterações.' : 'Preencha os dados para submeter à equipa de moderação.'}
                </p>
              </div>
              <button type="button" onClick={fecharModal} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Corpo do Formulário */}
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Título do Anúncio</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      name="titulo"
                      required
                      defaultValue={anuncioSendoEditado ? (anuncioSendoEditado.titulo || anuncioSendoEditado.title) : ''}
                      placeholder="Ex: T2 Moderno no Chiado com Varanda" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo de Imóvel</label>
                  <div className="relative">
                    <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select 
                      name="tipo"
                      defaultValue={anuncioSendoEditado ? anuncioSendoEditado.tipo : 'Apartamento Inteiro'}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm appearance-none focus:ring-2 focus:ring-sky-500 outline-none cursor-pointer"
                    >
                      <option>Apartamento Inteiro</option>
                      <option>Quarto Privado</option>
                      <option>Estúdio</option>
                      <option>Moradia</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preço Mensal (€)</label>
                  <div className="relative">
                    <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="number" 
                      name="preco"
                      required
                      defaultValue={anuncioSendoEditado ? String(anuncioSendoEditado.preco || anuncioSendoEditado.price).replace('€', '') : ''}
                      placeholder="0.00" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all" 
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Localização Exata</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" name="localizacao" placeholder="Rua, Número, Código Postal e Cidade" className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all" />
                  </div>
                </div>

                {/* UPLOAD DE FOTOS */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fotografias do Imóvel</label>
                  <input type="file" multiple accept="image/png, image/jpeg, image/jpg" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                  
                  <div onClick={handleDivClick} className="border-2 border-dashed border-sky-200 bg-sky-50/30 rounded-3xl p-10 text-center hover:bg-sky-50 transition-colors cursor-pointer group">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-sky-500 group-hover:scale-110 transition-transform shadow-md">
                      <Upload size={24} />
                    </div>
                    <p className="text-sm font-bold text-sky-800 mb-1">Clica para escolheres as fotos</p>
                    <p className="text-xs text-sky-600/60">Upload máximo de 10 fotos (PNG, JPG até 10MB)</p>
                  </div>

                  {fotos.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 md:grid-cols-4 gap-3">
                      {fotos.map((foto, index) => (
                        <div key={index} className="relative group rounded-xl overflow-hidden border border-slate-200 h-24 bg-slate-100 flex items-center justify-center">
                          <img src={foto.preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                          <button type="button" onClick={(e) => { e.stopPropagation(); removeFoto(index); }} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-red-500 text-white p-1.5 rounded-full shadow-lg"><X size={16} /></div>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* Ações do Modal */}
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 shrink-0">
              <button type="button" onClick={fecharModal} className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">Cancelar</button>
              <button type="submit" className="px-8 py-3 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-2xl transition-all shadow-lg shadow-sky-600/20">
                {anuncioSendoEditado ? 'Guardar Alterações' : 'Publicar Anúncio'}
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Aviso de Sucesso */}
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