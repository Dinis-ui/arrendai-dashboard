import { Building2, MapPin, ArrowUpRight } from 'lucide-react';

export default function Propriedades() {
  const properties = [
    { id: 1, address: 'Rua Garrett 12, Lisboa', area: 85, status: 'Alugado', rent: '1.200€' },
    { id: 2, address: 'Av. da Boavista 450, Porto', area: 110, status: 'Vazio', rent: '1.550€' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">As Minhas Propriedades</h1>
        <p className="text-slate-500 text-sm">Gere as tuas unidades físicas e ocupação.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {properties.map(prop => (
          <div key={prop.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-sky-50 text-sky-600 p-3 rounded-xl"><Building2 size={24} /></div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${prop.status === 'Alugado' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {prop.status}
              </span>
            </div>
            <h3 className="font-bold text-slate-900 mb-1">{prop.address}</h3>
            <p className="text-sm text-slate-500 flex items-center gap-1"><MapPin size={14}/> {prop.area} m² • {prop.rent}/mês</p>
          </div>
        ))}
      </div>
    </div>
  );
}