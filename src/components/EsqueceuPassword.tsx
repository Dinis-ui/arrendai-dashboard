import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ShieldCheck, Send } from 'lucide-react';

export default function EsqueceuPassword() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  const lidarComEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulacao de envio para o backend 
    try {
      // Aqui faras o fetch('/api/password-reset/')
      await new Promise(resolve => setTimeout(resolve, 1500));
      setEnviado(true);
    } catch {
      // Erro generico
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 font-sans text-slate-900 px-6">
      <div className="w-full max-w-md">
        
        <div className="mb-8 flex flex-col items-center text-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-sky-500 text-3xl font-bold text-white shadow-lg shadow-sky-500/30">
            A
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Recuperar Password
          </h1>
          <p className="text-sm text-slate-500 max-w-[280px]">
            Insere o teu email para receberes as instrucoes de recuperacao.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          {!enviado ? (
            <form onSubmit={lidarComEnvio} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Mail size={16} className="text-slate-400" /> Endereco de Email
                </label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  placeholder="exemplo@email.com"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-sky-500 py-3.5 font-bold text-white shadow-md transition-all hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-70"
              >
                {loading ? 'A processar...' : (
                  <>Enviar link de acesso <Send size={18} /></>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Verifica o teu email</h3>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                Se existir uma conta associada ao email {email}, receberas um link para criar uma nova password em poucos minutos.
              </p>
              <button 
                onClick={() => setEnviado(false)}
                className="text-sm font-semibold text-sky-500 hover:text-sky-600"
              >
                Nao recebi nada, tentar novamente
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-sky-600 transition-colors">
            <ArrowLeft size={16} /> Voltar ao Login
          </Link>
        </div>
      </div>
    </div>
  );
}