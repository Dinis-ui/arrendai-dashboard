import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ShieldCheck, ArrowLeft, UserCircle, UploadCloud } from 'lucide-react';

export default function Registo() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nome: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'tenant', // O Django espera 'tenant' ou 'landlord'
    nif: '' 
  });
  
  const [documento, setDocumento] = useState<File | null>(null);
  
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

    // Validações mantêm-se iguais
    if (formData.password !== formData.confirmPassword) {
      setMensagem('As passwords não coincidem.');
      setLoading(false);
      return;
    }

    if (formData.nif.length !== 9 || isNaN(Number(formData.nif))) {
      setMensagem('O NIF tem de ter exatamente 9 números.');
      setLoading(false);
      return;
    }

    try {
      // Aqui está a chave: Os nomes aqui (ex: 'nome_completo') 
      // TÊM DE SER IGUAIS aos nomes que puseste no models.py do Django
      const formDataToSend = new FormData();
      formDataToSend.append('nome_completo', formData.nome); // O Django espera 'nome_completo'
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('role', formData.userType);     // O Django espera 'role'
      formDataToSend.append('nif', formData.nif);           // O Django espera 'nif'

      // Se for senhorio, anexa o documento
      if (formData.userType === 'landlord' && documento) {
        formDataToSend.append('documento', documento);
      }

      const resposta = await fetch('http://127.0.0.1:8000/api/users/register/', {
        method: 'POST',
        body: formDataToSend,
        // IMPORTANTE: Não definas 'Content-Type' aqui. 
        // Quando usas FormData, o browser define o header correto (multipart/form-data) sozinho.
      });

      if (resposta.ok) {
        setMensagem('Conta criada com sucesso! Redirecionando...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        const erros = await resposta.json();
        console.log("Erros do servidor:", erros);
        // O Django devolve os erros em formato JSON, podes tentar mostrar um deles
        setMensagem('Erro: ' + JSON.stringify(erros));
      }

    } catch (error) {
      console.error(error);
      setMensagem('Erro de ligação ao servidor.');
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
            Junta-te a milhares de pessoas que já utilizam a nossa plataforma.
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
                <ShieldCheck size={16} className="text-slate-400" /> NIF (Número de Contribuinte)
              </label>
              <input 
                type="text" 
                name="nif"
                maxLength={9}
                required
                value={formData.nif}
                className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                placeholder="Ex: 123456789"
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <ShieldCheck size={16} className="text-slate-400" /> Pretendes:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`cursor-pointer rounded-xl border p-4 text-center transition-all ${formData.userType === 'tenant' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-gray-100 bg-slate-50 text-slate-500'}`}>
                  <input type="radio" name="userType" value="tenant" className="hidden" onChange={handleInputChange} />
                  <p className="text-sm font-bold">Arrendar Casa</p>
                  <p className="text-xs opacity-70 italic">Inquilino</p>
                </label>
                <label className={`cursor-pointer rounded-xl border p-4 text-center transition-all ${formData.userType === 'landlord' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-gray-100 bg-slate-50 text-slate-500'}`}>
                  <input type="radio" name="userType" value="landlord" className="hidden" onChange={handleInputChange} />
                  <p className="text-sm font-bold">Publicar Casas</p>
                  <p className="text-xs opacity-70 italic">Senhorio</p>
                </label>
              </div>
            </div>

            {formData.userType === 'landlord' && (
              <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Verificação de Senhorio <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-slate-500 mb-2">
                  Para garantir a segurança, precisamos de um comprovativo (Cartão de Cidadão ou Registo Predial).
                </p>
                
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 hover:border-sky-300 transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setDocumento(e.target.files ? e.target.files[0] : null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <UploadCloud size={28} className="mx-auto text-sky-500 mb-2" />
                  
                  {documento ? (
                    <p className="text-sm font-bold text-green-600">{documento.name}</p>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-slate-700">Clica ou arrasta para anexar documento</p>
                      <p className="text-xs text-slate-400 mt-1">PDF, JPG ou PNG (Máx 5MB)</p>
                    </>
                  )}
                </div>
              </div>
            )}

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
            <ArrowLeft size={16} /> Já tens uma conta? Faz login aqui
          </Link>
        </div>

      </div>

    </div>
  );
}