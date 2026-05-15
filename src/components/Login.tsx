import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { Building2, Home, ShieldAlert } from 'lucide-react'; 

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); 

  const fazerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem('');

    // SIMULAÇÃO DE LOGIN 
    setTimeout(() => {
      setMensagem('Entraste com sucesso!');
      navigate('/portal');
    }, 1000);

    /* --- CÓDIGO REAL DA API (Desativado temporariamente) ---
    try {
      const resposta = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (resposta.ok) {
        const dados = await resposta.json();
        localStorage.setItem('accessToken', dados.access);
        localStorage.setItem('refreshToken', dados.refresh);
        setMensagem('Entraste com sucesso!');
        navigate('/portal'); 
      } else {
        setMensagem('Username ou password errados.');
      }
    } catch {
      setMensagem('Erro de ligacao ao servidor.');
    } finally {
      setLoading(false);
    }
    */
  };

  // TESTES
  const entrarComoSenhorio = () => navigate('/dashboard-senhorio'); 
  const entrarComoInquilino = () => navigate('/portal'); 

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 font-sans text-slate-900">
      
      <div className="w-full max-w-md px-6">
        
        <div className="mb-8 flex flex-col items-center justify-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-sky-500 text-3xl font-bold text-white shadow-lg shadow-sky-500/30">
            A
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            ArrendAI
          </h1>
          <p className="text-sm text-slate-500">
            Bem-vindo de volta! Insere os teus dados.
          </p>
        </div>

        
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <form onSubmit={fazerLogin} className="space-y-5">
            
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Username
              </label>
              <input 
                type="text" 
                className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm transition-colors focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                placeholder="O teu nome de utilizador"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input 
                type="password" 
                className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm transition-colors focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between pb-2">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" className="rounded border-gray-300 text-sky-500 focus:ring-sky-500" />
                Lembrar de mim
              </label>
              <Link to="/recuperar-password" className="text-sm font-medium text-sky-500 hover:text-sky-600">
                Esqueceu a password?
              </Link>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full rounded-xl bg-sky-500 py-3 font-semibold text-white shadow-sm transition-all hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-70"
            >
              {loading ? 'A verificar...' : 'Entrar na conta'}
            </button>

            {mensagem && (
              <div className={`mt-4 rounded-lg p-3 text-center text-sm font-medium ${
                mensagem.includes('sucesso') ? 'bg-green-50 text-green-700 border border-green-200' : 
                'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {mensagem}
              </div>
            )}
          </form>

          
          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Acesso Rápido (Dev)</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* TESTE */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <button 
              onClick={entrarComoInquilino}
              type="button"
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-emerald-100 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100 transition-all group"
            >
              <Home size={24} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold">Portal Inquilino</span>
            </button>
            
            <button 
              onClick={entrarComoSenhorio}
              type="button"
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-sky-100 bg-sky-50 text-sky-700 hover:border-sky-300 hover:bg-sky-100 transition-all group"
            >
              <Building2 size={24} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold">Painel Senhorio</span>
            </button>
          </div>
          
          <div className="mt-4 flex items-start gap-2 text-xs text-slate-400 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <ShieldAlert size={16} className="shrink-0 text-slate-400" />
            <p>Estes botões saltam o login real para facilitar os testes de interface. Devem ser removidos na versão final.</p>
          </div>

        </div>

        
        <p className="mt-8 text-center text-sm text-slate-500">
          Ainda não tens conta?{' '}
          <Link to="/registo" className="font-semibold text-sky-500 hover:text-sky-600">
            Registar conta
          </Link>
        </p>
      </div>

    </div>
  );
}