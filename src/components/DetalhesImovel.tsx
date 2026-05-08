import { useParams, useNavigate } from 'react-router-dom';

// Base de dados simulada com os 6 imoveis do portal
const todosImoveis = [
  {
    id: 1,
    title: 'Apartamento T2 com Varanda e Vista Rio',
    location: 'Príncipe Real, Lisboa',
    price: 1350,
    area: 78,
    tipo: 'T2',
    description: 'Fantástico apartamento T2 totalmente remodelado no coração de Lisboa. Conta com uma sala ampla com imensa luz natural, cozinha totalmente equipada com eletrodomésticos topo de gama, e uma varanda virada a sul com vista desafogada. O prédio tem elevador e fica a 5 minutos a pé do metro.',
    photos: [
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    amenities: ['Wi-Fi Rápido', 'Ar Condicionado', 'Lugar de Garagem', 'Mobilado', 'Varanda', 'Permite Animais'],
    senhorio: 'Dinis G.',
  },
  {
    id: 2,
    title: 'Studio Moderno no Centro',
    location: 'Baixa, Porto',
    price: 820,
    area: 42,
    tipo: 'T0',
    description: 'Studio perfeito para estudantes ou jovens profissionais. Espaço otimizado, muita luz natural e a uma curta distância de todos os serviços centrais da cidade.',
    photos: [
      'https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    amenities: ['Wi-Fi Rápido', 'Mobilado', 'Despesas Incluídas'],
    senhorio: 'Maria S.',
  },
  {
    id: 3,
    title: 'Moradia T3 com Jardim',
    location: 'Cascais, Setúbal',
    price: 2100,
    area: 145,
    tipo: 'T3',
    description: 'Moradia espaçosa ideal para famílias. Conta com um jardim privado, garagem para dois carros e acabamentos de luxo. Zona muito calma e segura.',
    photos: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    amenities: ['Jardim', 'Garagem', 'Piscina', 'Lareira', 'Ar Condicionado'],
    senhorio: 'Carlos M.',
  },
  {
    id: 4,
    title: 'Apartamento T1 com Vista Rio',
    location: 'Ribeira, Porto',
    price: 980,
    area: 55,
    tipo: 'T1',
    description: 'Excelente apartamento com vista inalterável para o Rio Douro. Totalmente mobilado e pronto a habitar.',
    photos: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    amenities: ['Vista Rio', 'Mobilado', 'Cozinha Equipada'],
    senhorio: 'Ana P.',
  },
  {
    id: 5,
    title: 'Loft T1 em Edifício Histórico',
    location: 'Alfama, Lisboa',
    price: 1150,
    area: 65,
    tipo: 'T1',
    description: 'Charme e história combinados num loft de pé-direito alto, inserido num edifício centenário recentemente recuperado.',
    photos: [
      'https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    amenities: ['Pé-direito alto', 'Histórico', 'Mobilado'],
    senhorio: 'João R.',
  },
  {
    id: 6,
    title: 'Apartamento T2 Novo',
    location: 'Braga, Braga',
    price: 890,
    area: 88,
    tipo: 'T2',
    description: 'Construção nova. Apartamento a estrear com isolamento térmico e acústico de excelência. Estores elétricos e varanda espaçosa.',
    photos: [
      'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    amenities: ['Novo', 'Garagem', 'Ar condicionado', 'Varanda'],
    senhorio: 'Construtora Lda.',
  }
];

export default function DetalhesImovel() {
  const { id } = useParams();
  const navigate = useNavigate();

  const imovel = todosImoveis.find(item => item.id === Number(id));

  if (!imovel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 font-sans">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Imovel nao encontrado</h1>
        <button 
          onClick={() => navigate('/portal')} 
          className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Voltar ao Portal
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-16">
      
      {/* Barra de navegacao */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 mb-8">
        <button 
          onClick={() => navigate('/portal')}
          className="flex items-center text-sm font-medium text-slate-500 hover:text-sky-500 transition-colors"
        >
          Voltar a Pesquisa
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-6">
        
        <div className="mb-6 flex justify-between items-end">
          <div>
            <div className="flex gap-2 mb-2">
              <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Disponivel</span>
              <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">{imovel.tipo}</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">{imovel.title}</h1>
            <p className="text-slate-500 mt-1 flex items-center gap-1">Localizacao: {imovel.location}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-sky-600">{imovel.price}€ <span className="text-lg font-normal text-slate-500">/ mes</span></p>
          </div>
        </div>

        {/* Fotos */}
        <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[400px] mb-10">
          <div className="col-span-3 row-span-2 rounded-2xl overflow-hidden shadow-sm">
            <img src={imovel.photos[0]} alt="Principal" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden shadow-sm">
            <img src={imovel.photos[1]} alt="Quarto" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden shadow-sm relative">
            <img src={imovel.photos[2]} alt="Cozinha" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/50 transition-colors">
              <span className="text-white font-bold text-lg">+12 Fotos</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-10">
            
            <div className="flex gap-8 border-y border-slate-200 py-6">
              <div className="text-center">
                <p className="text-slate-500 text-sm">Area</p>
                <p className="font-bold text-lg">{imovel.area} m²</p>
              </div>
              <div className="text-center border-l border-slate-200 pl-8">
                <p className="text-slate-500 text-sm">Tipologia</p>
                <p className="font-bold text-lg">{imovel.tipo}</p>
              </div>
              <div className="text-center border-l border-slate-200 pl-8">
                <p className="text-slate-500 text-sm">Casas de Banho</p>
                <p className="font-bold text-lg">2</p>
              </div>
            </div>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Sobre este imovel</h2>
              <p className="text-slate-600 leading-relaxed">{imovel.description}</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Comodidades</h2>
              <div className="grid grid-cols-2 gap-4">
                {imovel.amenities.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 text-slate-600">
                    <span className="text-sky-500 font-bold">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </section>

            {/* Mapa */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Localizacao</h2>
              <div className="w-full h-64 bg-slate-200 rounded-2xl border border-slate-300 flex items-center justify-center">
                <span className="text-slate-500 font-medium">[ Integracao com Google Maps aqui ]</span>
              </div>
            </section>

          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl sticky top-8">
              
              <p className="text-slate-500 text-sm font-medium mb-1">Renda Mensal</p>
              <p className="text-3xl font-bold text-slate-900 mb-6">{imovel.price}€</p>
              
              <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 rounded-xl shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 mb-4 text-lg">
                Candidatar-me a esta casa
              </button>
              
              <p className="text-center text-sm text-slate-500 mb-6 border-b border-slate-100 pb-6">
                Sem custos de candidatura.
              </p>

              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600">
                  {imovel.senhorio.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-slate-500">Senhorio verificado</p>
                  <p className="font-bold text-slate-900">{imovel.senhorio}</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}