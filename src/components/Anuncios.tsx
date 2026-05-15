import { useState, useRef } from 'react'; // <-- useRef adicionado aqui
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
  Euro,
  FileText,
} from 'lucide-react';

export default function Anuncios() {

  // ESTADOS 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); 
  
  // ESTADOS PARA O UPLOAD DE FOTOS
  // Guarda um array de objetos com o ficheiro em si e um URL temporário para mostrar a imagem
  const [fotos, setFotos] = useState<{file: File, preview: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dados fictícios para a tabela
  const anuncios = [
    { id: 1, titulo: 'Apartamento T2 Vista Rio', tipo: 'Apartamento Inteiro', estado: 'Ativo', preco: '1200€', cor: 'text-green-600 bg-green-50' },
    { id: 2, titulo: 'Quarto em Entrecampos', tipo: 'Quarto Privado', estado: 'Em Revisão', preco: '450€', cor: 'text-amber-600 bg-amber-50' },
    { id: 3, titulo: 'Studio Baixa Pombalina', tipo: 'Estúdio', estado: 'Rejeitado', preco: '900€', cor: 'text-red-600 bg-red-50' },
  ];

  // FUNÇÕES DE UPLOAD DE FOTOS

  // Simula o clique no input escondido
  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  // Lê os ficheiros escolhidos e cria URLs para as miniaturas
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const novosFicheiros = Array.from(e.target.files).map(file => ({
        file,
        preview: URL.createObjectURL(file) // Cria um link temporário para mostrar a imagem
      }));
      
      setFotos(prevFotos => [...prevFotos, ...novosFicheiros]);
    }
  };

  // Remove uma foto específica
  const removeFoto = (indexToRemove: number) => {
    setFotos(prevFotos => prevFotos.filter((_, index) => index !== indexToRemove));
  };



  // FUNÇÕES DO MODAL E SUBMISSÃO
  const fecharModal = () => {
    setIsModalOpen(false);
    setFotos([]); // Limpa as fotos se o utilizador cancelar
  };

  const handlePublish = () => {
    setIsModalOpen(false); // Fecha a janela do formulário
    setShowSuccessMessage(true); // Mostra o aviso verde
    setFotos([]); // Limpa as fotos para o próximo anúncio
    
    // Esconde o aviso automaticamente ao fim de 4 segundos
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 4000);
  };

  return (
    <div className="animate-in fade-in duration-500 relative">
      
      {/* CABEÇALHO DA SECÇÃO */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestão de Anúncios</h2>
          <p className="text-sm text-slate-500">Acompanhe o estado de aprovação das suas propriedades.</p>
        </div>
        
        {/* BOTÃO QUE ABRE O MODAL */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-sky-600/20"
        >
          <Plus size={20} /> Novo Anúncio
        </button>
      </div>

      {/* TABELA DE ANÚNCIOS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Título</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Estado de Moderação</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Preço</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {anuncios.map((anuncio) => (
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
                    {anuncio.estado}
                  </span>
                </td>
                <td className="px-6 py-5 font-bold text-slate-700">{anuncio.preco}</td>
                <td className="px-6 py-5 text-right">
                  <button className="text-slate-400 hover:text-slate-600 p-2 rounded-lg"><MoreVertical size={20} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      {/* MODAL CRIAR NOVO ANÚNCIO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
            
            {/* Header do Modal */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
              <div>
                <h3 className="font-black text-xl text-slate-800 uppercase tracking-tight">Publicar Novo Anúncio</h3>
                <p className="text-xs text-slate-400 font-medium mt-1">Preencha os dados para submeter à equipa de moderação.</p>
              </div>
              <button 
                onClick={fecharModal} 
                className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Corpo do Formulário */}
            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Título */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Título do Anúncio</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Ex: T2 Moderno no Chiado com Varanda"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all" 
                    />
                  </div>
                </div>

                {/* Tipo de Imóvel */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo de Imóvel</label>
                  <div className="relative">
                    <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm appearance-none focus:ring-2 focus:ring-sky-500 outline-none cursor-pointer">
                      <option>Apartamento Inteiro</option>
                      <option>Quarto Privado</option>
                      <option>Estúdio</option>
                      <option>Moradia</option>
                    </select>
                  </div>
                </div>

                {/* Preço */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preço Mensal (€)</label>
                  <div className="relative">
                    <Euro className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all" 
                    />
                  </div>
                </div>

                {/* Localização */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Localização Exata</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Rua, Número, Código Postal e Cidade"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all" 
                    />
                  </div>
                </div>

                {/* UPLOAD DE FOTOS */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fotografias do Imóvel</label>
                  
                  {/* INPUT ESCONDIDO */}
                  <input 
                    type="file" 
                    multiple 
                    accept="image/png, image/jpeg, image/jpg" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />

                  {/* CAIXA VISUAL CLICÁVEL */}
                  <div 
                    onClick={handleDivClick}
                    className="border-2 border-dashed border-sky-200 bg-sky-50/30 rounded-3xl p-10 text-center hover:bg-sky-50 transition-colors cursor-pointer group"
                  >
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-sky-500 group-hover:scale-110 transition-transform shadow-md">
                      <Upload size={24} />
                    </div>
                    <p className="text-sm font-bold text-sky-800 mb-1">Clica para escolheres as fotos</p>
                    <p className="text-xs text-sky-600/60">Upload máximo de 10 fotos (PNG, JPG até 10MB)</p>
                  </div>

                  {/* PRÉ-VISUALIZAÇÃO DAS FOTOS */}
                  {fotos.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 md:grid-cols-4 gap-3">
                      {fotos.map((foto, index) => (
                        <div key={index} className="relative group rounded-xl overflow-hidden border border-slate-200 h-24 bg-slate-100 flex items-center justify-center">
                          <img 
                            src={foto.preview} 
                            alt={`Preview ${index}`} 
                            className="w-full h-full object-cover"
                          />
                          {/* Botão de apagar a foto que aparece no hover */}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation(); // Evita que clique no botão abra a janela de ficheiros novamente
                              removeFoto(index);
                            }}
                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <div className="bg-red-500 text-white p-1.5 rounded-full shadow-lg">
                              <X size={16} />
                            </div>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button 
                onClick={fecharModal} 
                className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handlePublish} 
                className="px-8 py-3 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-2xl transition-all shadow-lg shadow-sky-600/20"
              >
                Publicar Anúncio
              </button>
            </div>

          </div>
        </div>
      )}


      {/* AVISO SUCESSO */}
      {showSuccessMessage && (
        <div className="fixed bottom-10 right-10 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-8 z-50">
          <div className="bg-white/20 p-2 rounded-full">
            <CheckCircle2 size={24} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm">Anúncio submetido com sucesso!</p>
            <p className="text-xs text-emerald-100 font-medium mt-0.5">A nossa equipa irá rever o seu anúncio em breve.</p>
          </div>
          <button 
            onClick={() => setShowSuccessMessage(false)} 
            className="ml-4 text-emerald-200 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      )}

    </div>
  );
}