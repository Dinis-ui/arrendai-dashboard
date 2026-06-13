import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; 

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [lembrar, setLembrar] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); 
  const location = useLocation();

  // Quando o componente monta (ou quando o utilizador escreve /login à mão),
  // garantimos que o estado está limpo, a não ser que tenha o "lembrar de mim" ativado
  useEffect(() => {
    // Se o utilizador não tem "Lembrar de mim", ou se forçou a navegação para /login
    // devemos limpar a sessão para evitar logins fantasmas.
    const hasLocalStorageToken = localStorage.getItem('accessToken');
    
    // Se só tem no session (janela atual), limpa-o (porque significa que fechou a janela ou veio aqui parar)
    if (!hasLocalStorageToken) {
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
    }
  }, [location.pathname]);


  // Função manual de emergência para limpar tudo
  const limparLixo = () => {
    localStorage.clear();
    sessionStorage.clear();
    setMensagem('Sessão fantasma limpa. Podes fazer login.');
    setUsername('');
    setPassword('');
  };

  const fazerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem('');

    try {
      // 1. Pedir o Token ao Backend
      const resposta = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (resposta.ok) {
        const dados = await resposta.json();
        
        // Limpar qualquer lixo antes de gravar o novo token
        localStorage.clear();
        sessionStorage.clear();

        // Lógica "Lembrar de mim": se ativo, guarda no localStorage, senão no sessionStorage
        const storage = lembrar ? localStorage : sessionStorage;
        storage.setItem('accessToken', dados.access);
        storage.setItem('refreshToken', dados.refresh);
        
        // 2. BUSCAR OS DADOS DO UTILIZADOR
        const resUser = await fetch('http://127.0.0.1:8000/api/users/me/', {
          headers: { 'Authorization': `Bearer ${dados.access}` }
        });
        
        if (resUser.ok) {
          const userData = await resUser.json();
          setMensagem('Entraste com sucesso!');
          
          // 3. Redirecionamento Inteligente
          if (userData.role === 'landlord') {
            navigate('/dashboard-senhorio'); 
          } else {
            navigate('/portalinquilino'); 
          }
        }
      } else {
        setMensagem('Username ou password errados.');
      }
    } catch (error) {
      setMensagem('Erro de ligação ao servidor.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 font-sans text-slate-900 relative">
      
      {/* Botão de Emergência para limpar a cache (útil para desenvolvimento) */}
      <button 
        onClick={limparLixo}
        className="absolute top-4 right-4 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"
      >
        Limpar Sessão
      </button>

      <div className="w-full max-w-md px-6">
        <div className="mb-8 flex flex-col items-center justify-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-sky-500 text-3xl font-bold text-white shadow-lg shadow-sky-500/30">A</div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">ArrendAI</h1>
          <p className="text-sm text-slate-500">Bem-vindo de volta! Insere os teus dados.</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <form onSubmit={fazerLogin} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Username</label>
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
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
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
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input 
                    type="checkbox" 
                    checked={lembrar}
                    onChange={(e) => setLembrar(e.target.checked)}
                    className="rounded border-gray-300 text-sky-500 focus:ring-sky-500 cursor-pointer" 
                />
                Lembrar de mim
              </label>
              <Link to="/recuperar-password" className="text-sm font-medium text-sky-500 hover:text-sky-600 transition-colors">
                Esqueceste a password?
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
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          Ainda não tens conta?{' '}
          <Link to="/registo" className="font-semibold text-sky-500 hover:text-sky-600 transition-colors">Registar conta</Link>
        </p>
      </div>
    </div>
  );
}