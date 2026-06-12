import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, UploadCloud, CheckCircle, FileText } from 'lucide-react';

export default function DetalhesImovel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  // NOVO: Estado para guardar o imóvel que vem do Django e o estado de carregamento
  const [imovel, setImovel] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Estados dos Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [enviado, setEnviado] = useState(false);

  const [isCandidaturaOpen, setIsCandidaturaOpen] = useState(false);
  const [candidaturaEnviada, setCandidaturaEnviada] = useState(false);
  const [mensagemCandidatura, setMensagemCandidatura] = useState('');

  // 1. Carregar o Utilizador Logado
  useEffect(() => {
    const carregarUtilizador = async () => {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      if (token) {
        try {
          const res = await fetch('http://127.0.0.1:8000/api/users/me/', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            setUser(await res.json());
          }
        } catch (e) {
          console.error("Erro ao carregar utilizador:", e);
        }
      }
    };
    carregarUtilizador();
  }, []);

  // 2. Carregar o Imóvel Específico do Backend
  useEffect(() => {
    const carregarImovel = async () => {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      if (!token || !id) return;

      try {
        const res = await fetch(`http://127.0.0.1:8000/api/users/propriedades/${id}/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          
          setImovel({
            id: data.id,
            title: data.titulo_anuncio || `Fantástico imóvel em ${data.morada}`,
            location: data.morada,
            price: Number(data.preco_anuncio || data.valor_estimado),
            area: data.area,
            tipo: data.tipo_casa || 'Indisponível',
            description: data.descricao || 'Excelente oportunidade de arrendamento. Entre em contacto para mais informações e submeta a sua candidatura se achar que é o inquilino ideal para este espaço!',
            photos: [
              data.foto_principal || 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200',
              'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600',
              'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=600'
            ],
            amenities: data.comodidades ? data.comodidades.split(', ') : ['Verificado', 'Disponível Online'],
            senhorio: data.senhorio_nome || 'Senhorio Verificado' 
          });
        }
      } catch (error) {
        console.error("Erro ao carregar detalhes do imóvel:", error);
      } finally {
        setIsLoading(false);
      }
    };

    carregarImovel();
  }, [id]);
  // Submeter a candidatura para o Django
  const submeterCandidatura = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    
    if (imovel && token) {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/tenancies/applications/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            property: imovel.id,
            message: mensagemCandidatura || 'Candidatura submetida.'
          })
        });

        if (response.ok) {
          setCandidaturaEnviada(true);

          // Mantemos a tua lógica das mensagens visuais
          const novaConversa = {
            id: Date.now(),
            senhorio: imovel.senhorio,
            inquilino: user?.username || 'Inquilino Interessado',
            imovel: imovel.title,
            avatar: imovel.senhorio.substring(0, 2).toUpperCase(),
            unread: false,
            lastMessage: 'Candidatura submetida com sucesso.',
            time: 'Agora',
            history: [{ senderRole: 'tenant', text: `Olá! Acabei de me candidatar ao seu imóvel.`, time: 'Agora' }]
          };
          const conversasGuardadas = JSON.parse(localStorage.getItem('minhasConversas') || '[]');
          localStorage.setItem('minhasConversas', JSON.stringify([novaConversa, ...conversasGuardadas]));

          setTimeout(() => {
            setIsCandidaturaOpen(false);
            setCandidaturaEnviada(false);
            navigate(-1); // Volta à pesquisa
          }, 3500);
        } else {
          alert("Não foi possível enviar a candidatura.");
        }
      } catch (error) {
        console.error("Erro ao candidatar:", error);
      }
    }
  };

  const enviarMensagem = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);

    if (imovel && mensagem.trim() !== '') {
       const novaConversa = {
         id: Date.now(),
         senhorio: imovel.senhorio,
         inquilino: user?.username || 'Inquilino Interessado',
         imovel: imovel.title,
         avatar: imovel.senhorio.substring(0, 2).toUpperCase(),
         unread: false,
         lastMessage: mensagem,
         time: 'Agora',
         history: [{ senderRole: 'tenant', text: mensagem, time: 'Agora' }]
       };
       const conversasGuardadas = JSON.parse(localStorage.getItem('minhasConversas') || '[]');
       localStorage.setItem('minhasConversas', JSON.stringify([novaConversa, ...conversasGuardadas]));
    }

    setTimeout(() => {
      setIsModalOpen(false);
      setEnviado(false);
      setMensagem('');
    }, 2000);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><p className="text-slate-500 font-bold">A carregar detalhes do imóvel...</p></div>;
  }

  if (!imovel && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 font-sans">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Imóvel não encontrado</h1>
        <button 
          onClick={() => navigate(-1)}
          className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Voltar à Pesquisa
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-16">
      <header className="bg-white border-b border-gray-200 px-8 py-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-sm font-bold text-slate-500 hover:text-sky-500 transition-colors"
        >
          ← Voltar à Pesquisa
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-6">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <div className="flex gap-2 mb-2">
              <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Disponível</span>
              <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">{imovel.tipo}</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">{imovel.title}</h1>
            <p className="text-slate-500 mt-1 flex items-center gap-1">Localização: {imovel.location}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-sky-600">{imovel.price}€ <span className="text-lg font-normal text-slate-500">/ mês</span></p>
          </div>
        </div>

        <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[400px] mb-10">
          <div className="col-span-3 row-span-2 rounded-2xl overflow-hidden shadow-sm border border-slate-200">
            <img src={imovel.photos[0]} alt="Principal" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden shadow-sm border border-slate-200">
            <img src={imovel.photos[1]} alt="Interior" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden shadow-sm relative border border-slate-200">
            <img src={imovel.photos[2]} alt="Detalhe" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/50 transition-colors">
              <span className="text-white font-bold text-lg">+ Fotos</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <div className="flex gap-8 border-y border-slate-200 py-6">
              <div className="text-center">
                <p className="text-slate-500 text-sm">Área</p>
                <p className="font-bold text-lg">{imovel.area} m²</p>
              </div>
              <div className="text-center border-l border-slate-200 pl-8">
                <p className="text-slate-500 text-sm">Tipologia</p>
                <p className="font-bold text-lg capitalize">{imovel.tipo}</p>
              </div>
              <div className="text-center border-l border-slate-200 pl-8">
                <p className="text-slate-500 text-sm">Casas de Banho</p>
                <p className="font-bold text-lg">1</p>
              </div>
            </div>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Sobre este imóvel</h2>
              <p className="text-slate-600 leading-relaxed">{imovel.description}</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Comodidades</h2>
              <div className="grid grid-cols-2 gap-4">
                {imovel.amenities.map((item: string, index: number) => (
                  <div key={index} className="flex items-center gap-3 text-slate-600">
                    <span className="text-sky-500 font-bold">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl sticky top-8">
              <p className="text-slate-500 text-sm font-medium mb-1">Renda Mensal</p>
              <p className="text-3xl font-bold text-slate-900 mb-6">{imovel.price}€</p>
              
              <button 
                onClick={() => setIsCandidaturaOpen(true)}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 rounded-xl shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 mb-3 text-lg"
              >
                Candidatar-me a esta casa
              </button>

              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-white border-2 border-slate-200 hover:border-sky-500 hover:text-sky-600 text-slate-700 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mb-4"
              >
                <MessageSquare size={18} /> Contactar Senhorio
              </button>
              
              <p className="text-center text-sm text-slate-500 mb-6 border-b border-slate-100 pb-6">
                Sem custos de candidatura.
              </p>

              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600">
                  {imovel.senhorio.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-slate-500">Senhorio</p>
                  <p className="font-bold text-slate-900">{imovel.senhorio}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Mensagem */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900">Mensagem para o Senhorio</h3>
                <p className="text-xs text-slate-500">Sobre: {imovel.title}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {enviado ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">Mensagem Enviada!</h4>
                  <p className="text-slate-500">O senhorio foi notificado e irá responder em breve.</p>
                </div>
              ) : (
                <form onSubmit={enviarMensagem}>
                  <label className="block text-sm font-medium text-slate-700 mb-2">A tua mensagem</label>
                  <textarea 
                    required
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    placeholder={`Estou muito interessado neste imóvel. Ainda está disponível para visitas?`}
                    className="w-full h-32 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 resize-none mb-4"
                  ></textarea>
                  <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                    Enviar Mensagem <Send size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Candidatura */}
      {isCandidaturaOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-50 border-b border-slate-200 p-5 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Candidatura Oficial</h3>
                <p className="text-sm text-slate-500">{imovel.title}</p>
              </div>
              <button onClick={() => setIsCandidaturaOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {candidaturaEnviada ? (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle size={40} />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-2">Candidatura Submetida!</h4>
                  <p className="text-slate-500 leading-relaxed max-w-md mx-auto">
                    O senhorio vai analisar o teu perfil. Podes acompanhar o estado no teu portal!
                  </p>
                </div>
              ) : (
                <form onSubmit={submeterCandidatura} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">1. Mensagem de Apresentação</label>
                    <textarea 
                      required
                      value={mensagemCandidatura}
                      onChange={(e) => setMensagemCandidatura(e.target.value)}
                      placeholder="Ex: Olá, chamo-me Maria, procuro uma casa tranquila..."
                      className="w-full h-28 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 resize-none"
                    ></textarea>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 rounded-xl transition-all shadow-md text-lg">
                      Confirmar e Enviar Candidatura
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}