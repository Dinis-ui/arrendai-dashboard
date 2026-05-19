import { useState } from 'react';
import { 
  Check, 
  X, 
  Mail, 
  Phone,
  CheckCircle2,
  FileText,
  ShieldCheck,
  UserCheck,
  AlertCircle
} from 'lucide-react';

//Perfis com sistema de Verificação

const candidaturasIniciais = [
  {
    id: 1,
    nome: 'Ricardo Pereira',
    iniciais: 'R',
    imovel: 'Apartamento T2 Vista Rio',
    localizacao: 'Lisboa',
    tempo: 'Há 2 dias',
    estado: 'Em Análise',
    estadoCor: 'text-amber-600 bg-amber-50',
    avatarCor: 'bg-sky-50 text-sky-600',
    email: 'ricardo.p@email.com',
    telefone: '+351 912 345 678',
    identidadeVerificada: true,
    financasVerificadas: true,
    mensagem: 'Olá! Adorei as fotografias do apartamento e o facto de ter vista para o rio. Tenho contrato de trabalho sem termo e fiador caso seja necessário. Gostaria muito de agendar uma visita presencial para esta semana, se for possível.'
  },
  {
    id: 2,
    nome: 'Ana Martins',
    iniciais: 'A',
    imovel: 'Quarto em Entrecampos',
    localizacao: 'Porto',
    tempo: 'Há 5 horas',
    estado: 'Pendente',
    estadoCor: 'text-slate-600 bg-slate-100',
    avatarCor: 'bg-emerald-50 text-emerald-600',
    email: 'ana.martins@email.com',
    telefone: '+351 934 567 890',
    identidadeVerificada: true,
    financasVerificadas: false, 
    mensagem: 'Procuro um quarto sossegado para o meu último ano de mestrado. Sou muito organizada, limpa e não fumo. Posso fornecer referências do meu senhorio anterior.'
  }
];

export default function Candidaturas() {
  const [candidaturas, setCandidaturas] = useState(candidaturasIniciais);
  const [candidatoSelecionado, setCandidatoSelecionado] = useState<any>(null);
  
  const [toastMsg, setToastMsg] = useState('');
  const [toastTipo, setToastTipo] = useState<'sucesso' | 'erro'>('sucesso');

  const mostrarAviso = (mensagem: string, tipo: 'sucesso' | 'erro' = 'sucesso') => {
    setToastMsg(mensagem);
    setToastTipo(tipo);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleAprovar = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setCandidaturas(candidaturas.map(c => 
      c.id === id ? { ...c, estado: 'Aprovado', estadoCor: 'text-emerald-700 bg-emerald-50' } : c
    ));
    mostrarAviso('Candidatura aprovada! O inquilino será notificado.', 'sucesso');
  };

  const handleRejeitar = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); 
    setCandidaturas(candidaturas.map(c => 
      c.id === id ? { ...c, estado: 'Rejeitado', estadoCor: 'text-red-700 bg-red-50' } : c
    ));
    mostrarAviso('Candidatura rejeitada e arquivada.', 'erro');
  };

  return (
    <div className="animate-in fade-in duration-500 relative pb-10">
      
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Candidaturas de Inquilinos</h2>
        <p className="text-sm text-slate-500">Analise o perfil dos interessados e escolha os melhores inquilinos com segurança.</p>
      </div>

      {/* Lista Candidaturas */}
      <div className="space-y-4">
        {candidaturas.map((cand) => (
          <div 
            key={cand.id}
            onClick={() => setCandidatoSelecionado(cand)}
            className={`bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex items-center justify-between cursor-pointer group ${cand.estado === 'Rejeitado' ? 'opacity-60' : ''}`}
          >
            <div className="flex items-center gap-5">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold ${cand.avatarCor} group-hover:scale-105 transition-transform`}>
                {cand.iniciais}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                  {cand.nome}
                  {cand.identidadeVerificada && cand.financasVerificadas && (
                    <ShieldCheck size={16} className="text-emerald-500" title="Perfil Totalmente Verificado" />
                  )}
                </h3>
                <p className="text-sm text-slate-500 font-medium mt-0.5">
                  {cand.imovel} • {cand.localizacao} • <span className="text-slate-400">{cand.tempo}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${cand.estadoCor}`}>
                {cand.estado}
              </span>

              {(cand.estado === 'Pendente' || cand.estado === 'Em Análise') && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => handleAprovar(e, cand.id)}
                    className="w-10 h-10 rounded-full border border-emerald-200 text-emerald-500 flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition-colors tooltip-trigger"
                  >
                    <Check size={20} />
                  </button>
                  <button 
                    onClick={(e) => handleRejeitar(e, cand.id)}
                    className="w-10 h-10 rounded-full border border-red-200 text-red-500 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors tooltip-trigger"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>


      {/* Detalhes do Candidato */}
      {candidatoSelecionado && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="bg-slate-50 p-8 border-b border-slate-100 flex justify-between items-start">
              <div className="flex items-center gap-5">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold ${candidatoSelecionado.avatarCor} shadow-sm border-4 border-white`}>
                  {candidatoSelecionado.iniciais}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{candidatoSelecionado.nome}</h2>
                  <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                    Interessado em: <strong className="text-slate-700">{candidatoSelecionado.imovel}</strong>
                  </p>
                </div>
              </div>
              <button onClick={() => setCandidatoSelecionado(null)} className="text-slate-400 hover:text-slate-600 bg-white border border-slate-200 p-2 rounded-full transition-colors shadow-sm">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
              
              {/* Status Verificação */}
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ShieldCheck size={16} /> Status de Verificação ArrendAI
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Card Identidade */}
                  <div className={`flex items-center gap-4 rounded-2xl p-4 border transition-colors ${candidatoSelecionado.identidadeVerificada ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${candidatoSelecionado.identidadeVerificada ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                      <UserCheck size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Identidade</p>
                      <p className={`font-bold text-sm ${candidatoSelecionado.identidadeVerificada ? 'text-emerald-700' : 'text-slate-500'}`}>
                        {candidatoSelecionado.identidadeVerificada ? 'Cartão de Cidadão Validado' : 'Não Verificada'}
                      </p>
                    </div>
                  </div>

                  {/* Card Finanças */}
                  <div className={`flex items-center gap-4 rounded-2xl p-4 border transition-colors ${candidatoSelecionado.financasVerificadas ? 'bg-sky-50/50 border-sky-100' : 'bg-amber-50 border-amber-100'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${candidatoSelecionado.financasVerificadas ? 'bg-sky-100 text-sky-600' : 'bg-amber-100 text-amber-500'}`}>
                      {candidatoSelecionado.financasVerificadas ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Capacidade Financeira</p>
                      <p className={`font-bold text-sm ${candidatoSelecionado.financasVerificadas ? 'text-sky-700' : 'text-amber-600'}`}>
                        {candidatoSelecionado.financasVerificadas ? 'Verificada pelo ArrendAI' : 'Documentação Pendente'}
                      </p>
                    </div>
                  </div>

                </div>
                <p className="text-xs text-slate-400 mt-3 italic">
                  * Por motivos de privacidade, a equipa do ArrendAI valida os recibos de vencimento e fiadores, não partilhando os montantes exatos.
                </p>
              </div>

              {/* Mensagem do Candidato */}
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Mensagem de Apresentação</h3>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 relative">
                  <FileText className="absolute top-5 right-5 text-slate-200" size={24} />
                  <p className="text-slate-700 text-sm leading-relaxed relative z-10 italic">
                    "{candidatoSelecionado.mensagem}"
                  </p>
                </div>
              </div>

              {/* Contactos */}
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Contactos Diretos</h3>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-xl">
                    <Mail size={16} className="text-slate-400" /> {candidatoSelecionado.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-xl">
                    <Phone size={16} className="text-slate-400" /> {candidatoSelecionado.telefone}
                  </div>
                </div>
              </div>

            </div>

            
            <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3">
              <button 
                onClick={(e) => { handleRejeitar(e, candidatoSelecionado.id); setCandidatoSelecionado(null); }}
                className="px-6 py-2.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-100"
              >
                Rejeitar Candidatura
              </button>
              <button 
                onClick={(e) => { handleAprovar(e, candidatoSelecionado.id); setCandidatoSelecionado(null); }}
                className="px-8 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-lg shadow-emerald-600/20"
              >
                Aprovar & Contactar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Aviso */}
      {toastMsg && (
        <div className={`fixed bottom-10 right-10 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-8 z-50 ${toastTipo === 'sucesso' ? 'bg-emerald-600' : 'bg-red-600'}`}>
          <div className="bg-white/20 p-2 rounded-full">
            {toastTipo === 'sucesso' ? <CheckCircle2 size={24} /> : <X size={24} />}
          </div>
          <div>
            <p className="font-bold text-sm">Ação Concluída</p>
            <p className={`text-xs font-medium mt-0.5 ${toastTipo === 'sucesso' ? 'text-emerald-100' : 'text-red-100'}`}>
              {toastMsg}
            </p>
          </div>
          <button onClick={() => setToastMsg('')} className={`ml-4 transition-colors ${toastTipo === 'sucesso' ? 'text-emerald-200 hover:text-white' : 'text-red-200 hover:text-white'}`}>
            <X size={18} />
          </button>
        </div>
      )}

    </div>
  );
}