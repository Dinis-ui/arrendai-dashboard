import { useState, useRef } from 'react';
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

 
  // ESTADOS 
  // Agora os anúncios são um estado, para podermos apagar e editar!
  const [anuncios, setAnuncios] = useState(dadosIniciais);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState(''); // Mensagem dinâmica para o aviso verde
  const [menuAberto, setMenuAberto] = useState<number | null>(null);
  
  // Estado para saber qual anúncio estamos a editar (se for null, é um anúncio novo)
  const [anuncioSendoEditado, setAnuncioSendoEditado] = useState<any>(null);

  // Upload de fotos
  const [fotos, setFotos] = useState<{file: File, preview: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  
  // Mostrar Aviso
  const mostrarAviso = (mensagem: string) => {
    setToastMsg(mensagem);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Apagar Anúncio
  const handleApagar = (id: number) => {
    setAnuncios(anuncios.filter(anuncio => anuncio.id !== id));
    setMenuAberto(null);
    mostrarAviso('Anúncio apagado com sucesso.');
  };

  // Pausar Anúncio
  const handlePausar = (id: number) => {
    setAnuncios(anuncios.map(anuncio => {
      if (anuncio.id === id) {
        const isPausado = anuncio.estado === 'Pausado';
        return {
          ...anuncio,
          estado: isPausado ? 'Em Revisão' : 'Pausado',
          cor: isPausado ? 'text-amber-600 bg-amber-50' : 'text-slate-600 bg-slate-100'
        };
      }
      return anuncio;
    }));
    setMenuAberto(null);
    mostrarAviso('Estado do anúncio atualizado.');
  };

  // Editar Anúncio
  const handleEditar = (anuncio: any) => {
    setAnuncioSendoEditado(anuncio); // Guarda os dados do anúncio a editar
    setIsModalOpen(true); // Abre a janela
    setMenuAberto(null); // Fecha o menu dos 3 pontinhos
  };

  // Ver Anúncio
  const handleVerAnuncio = () => {
    // Como não temos página pública desenhada, apenas mostramos um aviso simulado
    setMenuAberto(null);
    mostrarAviso('A redirecionar para a página pública...');
  };

  // Fechar Modal e limpar dados
  const fecharModal = () => {
    setIsModalOpen(false);
    setAnuncioSendoEditado(null);
    setFotos([]);
  };

  // Guardar o Formulário 
  const handlePublish = () => {
    fecharModal();
    if (anuncioSendoEditado) {
      mostrarAviso('Anúncio atualizado com sucesso!');
    } else {
      mostrarAviso('Novo anúncio submetido para revisão!');
    }
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
                  Nenhum anúncio encontrado.
                </td>
              </tr>
            ) : (
              anuncios.map((anuncio) => (
                <tr key={anuncio.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <p className="font-bold text-slate-800">{anuncio.titulo}</p>
                    <p className="text-xs text-slate-400">{anuncio.tipo}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-current/10 ${anuncio.cor}`}>
                      {anuncio.estado === 'Ativo' && <CheckCircle2 size={14} />}
                      {anuncio.estado === 'Em Revisão' && <Clock size={14} />}
                      {anuncio.estado === 'Rejeitado' && <XCircle size={14} />}
                      {anuncio.estado === 'Pausado' && <PauseCircle size={14} />}
                      {anuncio.estado}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-bold text-slate-700">{anuncio.preco}</td>
                  
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
                          {anuncio.estado === 'Pausado' ? 'Retomar Anúncio' : 'Pausar Anúncio'}
                        </button>
                        <div className="h-px bg-slate-100 my-1 mx-2"></div>
                        <button onClick={() => handleApagar(anuncio.id)} className="w-full px-4 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors">
                          <Trash2 size={16} className="text-red-500" /> Apagar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      
      {/* Criar OU Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
            
            {/* Header do Modal */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
              <div>
                <h3 className="font-black text-xl text-slate-800 uppercase tracking-tight">
                  {anuncioSendoEditado ? 'Editar Anúncio' : 'Publicar Novo Anúncio'}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  {anuncioSendoEditado ? 'Atualize os dados e guarde as alterações.' : 'Preencha os dados para submeter à equipa de moderação.'}
                </p>
              </div>
              <button onClick={fecharModal} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Corpo do Formulário */}
            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Título do Anúncio</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      defaultValue={anuncioSendoEditado ? anuncioSendoEditado.titulo : ''}
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
                      defaultValue={anuncioSendoEditado ? anuncioSendoEditado.preco.replace('€', '') : ''}
                      placeholder="0.00" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all" 
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Localização Exata</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="Rua, Número, Código Postal e Cidade" className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all" />
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
                          <button onClick={(e) => { e.stopPropagation(); removeFoto(index); }} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button onClick={fecharModal} className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">Cancelar</button>
              <button onClick={handlePublish} className="px-8 py-3 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-2xl transition-all shadow-lg shadow-sky-600/20">
                {anuncioSendoEditado ? 'Guardar Alterações' : 'Publicar Anúncio'}
              </button>
            </div>

          </div>
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