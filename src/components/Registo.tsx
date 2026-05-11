import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ShieldCheck, ArrowLeft, UserCircle } from 'lucide-react';

export default function Registo() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'inquilino' 
  });
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fazerRegisto = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem('');

    if (formData.password !== formData.confirmPassword) {
      setMensagem('As passwords nao coincidem.');
      setLoading(false);
      return;
    }

    try {
      // Aqui ligacao a API quando Dinis criar
    
      setTimeout(() => {
        setMensagem('Conta criada com sucesso!');
        setTimeout(() => navigate('/login'), 2000);
      }, 1500);
      
    } catch {
      setMensagem('Erro ao ligar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 font-sans text-slate-900 py-12 px-6">
      
      <div className="w-full max-w-xl">
        
        
        <div className="mb-8 flex flex-col items-center text-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-sky-500 text-3xl font-bold text-white shadow-lg shadow-sky-500/30">
            A
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Criar conta no ArrendAI
          </h1>
          <p className="text-slate-500">
            Junta-te a milhares de pessoas que ja utilizam a nossa plataforma.
          </p>
        </div>

        
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <form onSubmit={fazerRegisto} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <User size={16} className="text-slate-400" /> Nome Completo
                </label>
                <input 
                  type="text" 
                  name="nome"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  placeholder="Ex: Maria Ferreira"
                  onChange={handleInputChange}
                />
              </div>

              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <UserCircle size={16} className="text-slate-400" /> Username
                </label>
                <input 
                  type="text" 
                  name="username"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  placeholder="O teu utilizador"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Mail size={16} className="text-slate-400" /> Email
              </label>
              <input 
                type="email" 
                name="email"
                required
                className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                placeholder="exemplo@email.com"
                onChange={handleInputChange}
              />
            </div>

            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <ShieldCheck size={16} className="text-slate-400" /> Pretendes:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`cursor-pointer rounded-xl border p-4 text-center transition-all ${formData.userType === 'inquilino' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-gray-100 bg-slate-50 text-slate-500'}`}>
                  <input type="radio" name="userType" value="inquilino" className="hidden" onChange={handleInputChange} />
                  <p className="text-sm font-bold">Arrendar Casa</p>
                  <p className="text-xs opacity-70 italic">Inquilino</p>
                </label>
                <label className={`cursor-pointer rounded-xl border p-4 text-center transition-all ${formData.userType === 'senhorio' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-gray-100 bg-slate-50 text-slate-500'}`}>
                  <input type="radio" name="userType" value="senhorio" className="hidden" onChange={handleInputChange} />
                  <p className="text-sm font-bold">Publicar Casas</p>
                  <p className="text-xs opacity-70 italic">Senhorio</p>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Lock size={16} className="text-slate-400" /> Password
                </label>
                <input 
                  type="password" 
                  name="password"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  placeholder="••••••••"
                  onChange={handleInputChange}
                />
              </div>

              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Lock size={16} className="text-slate-400" /> Confirmar Password
                </label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  placeholder="••••••••"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full rounded-xl bg-sky-500 py-4 font-bold text-white shadow-md transition-all hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-70 text-lg"
            >
              {loading ? 'A processar...' : 'Criar minha conta'}
            </button>

            {mensagem && (
              <div className={`rounded-lg p-3 text-center text-sm font-medium border ${
                mensagem.includes('sucesso') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                {mensagem}
              </div>
            )}
          </form>
        </div>

        
        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-sky-600 transition-colors">
            <ArrowLeft size={16} /> Ja tens uma conta? Faz login aqui
          </Link>
        </div>

      </div>

    </div>
  );
}