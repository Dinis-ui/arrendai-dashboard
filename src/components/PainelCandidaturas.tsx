import { Users, CheckCircle, XCircle } from 'lucide-react';

export default function PainelCandidaturas() {
  const candidaturas = [
    { id: 1, nome: 'Ricardo Pereira', imovel: 'Apartamento T2 - Lisboa', data: 'Há 2 dias', status: 'Em Análise' },
    { id: 2, nome: 'Ana Martins', imovel: 'Quarto - Porto', data: 'Há 5 horas', status: 'Pendente' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Candidaturas de Inquilinos</h1>
        <p className="text-slate-500 text-sm">Analise o perfil dos interessados e escolha os melhores inquilinos.</p>
      </div>

      <div className="space-y-4">
        {candidaturas.map(c => (
          <div key={c.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-sky-300 transition-all cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sky-50 rounded-full flex items-center justify-center font-bold text-sky-600">
                {c.nome.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{c.nome}</h3>
                <p className="text-xs text-slate-500">{c.imovel} • {c.data}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-bold">{c.status}</span>
              <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"><CheckCircle size={20}/></button>
              <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><XCircle size={20}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}