import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, LogOut, ArrowLeft, X } from 'lucide-react';

interface PerfilProps {
  onBack?: () => void;
}

export default function PerfilInquilino({ onBack }: PerfilProps) {
  const navigate = useNavigate();

  // ESTADOS DOS MODAIS
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  // ESTADO DO UTILIZADOR REAL (Vindo da API)
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ESTADOS PARA O FORMULÁRIO DE EDIÇÃO (O que o utilizador digita)
  const [editUsername, setEditUsername] = useState('');
  const [editTelefone, setEditTelefone] = useState('');

  // DADOS DE TESTE PARA DESIGN
  const telefoneTemporario = '+351 912 345 678'; 

  // LÓGICA PARA CARREGAR OS DADOS DO BACKEND
  useEffect(() => {
    const carregarPerfil = async () => {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const res = await fetch('http://127.0.0.1:8000/api/users/me/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const dados = await res.json();
          setUser(dados);
        } else {
          terminarSessao();
        }
      } catch (e) {
        console.error("Erro ao carregar perfil:", e);
      } finally {
        setLoading(false);
      }
    };
    carregarPerfil();
  }, [navigate]);

  // FUNÇÃO PARA ATUALIZAR O PERFIL NO DJANGO
  const atualizarPerfil = async () => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    
    // Os dados que vão ser enviados para o Django
    const dadosAtualizados = {
        username: editUsername,
    };

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/users/${user.id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dadosAtualizados)
        });

        if (response.ok) {
            const dadosNovos = await response.json();
            alert('Perfil atualizado com sucesso na Base de Dados!');
            setUser(dadosNovos); // Atualiza o ecrã instantaneamente
            setIsEditOpen(false); // Fecha o modal
        } else {
            const erro = await response.json();
            console.error('Erro ao atualizar:', erro);
            alert('Erro ao atualizar o perfil. Verifica a consola.');
        }
    } catch (error) {
        console.error('Erro de rede:', error);
    }
  };

  const terminarSessao = () => {
    // ATENÇÃO AQUI: Limpar tanto o localStorage como o sessionStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role_teste');
    
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    
    navigate('/login');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">A carregar o teu perfil...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-16 animate-in fade-in duration-500 relative">
      
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-8 py-6 mb-8 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-sky-600 transition-colors bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 hover:border-sky-200"
          >
            <ArrowLeft size={18} /> Voltar
          </button>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-slate-800 tracking-tight">Definições de Conta</h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* AVATAR E AÇÕES */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm text-center">
              <div className="w-28 h-28 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-4xl mx-auto mb-6 border-4 border-white shadow-md uppercase">
                {user?.username ? user?.username.charAt(0) : '?'}
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{user?.username}</h2>
              <p className="text-slate-500 font-medium text-sm mb-6 capitalize">
                {user?.role === 'landlord' ? 'Senhorio' : 'Inquilino'}
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 p-4 shadow-sm">
              <button 
                onClick={() => {
                  setEditUsername(user?.username || '');
                  setEditTelefone(telefoneTemporario);
                  setIsEditOpen(true);
                }}
                className="w-full text-left p-4 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors"
              >
                Editar Perfil
              </button>
              <button 
                onClick={() => setIsPasswordOpen(true)}
                className="w-full text-left p-4 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors"
              >
                Alterar Password
              </button>
              <div className="h-px bg-gray-100 my-2 mx-4"></div>
              <button 
                onClick={terminarSessao}
                className="w-full flex items-center gap-3 p-4 text-sm font-bold text-red-600 hover:bg-red-50 rounded-2xl transition-colors"
              >
                <LogOut size={18} /> Terminar Sessão
              </button>
            </div>
          </div>

          {/* INFORMAÇÕES PESSOAIS */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl border border-gray-200 p-10 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                <User size={20} className="text-emerald-500" /> Informação Pessoal
              </h3>
              
              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nome de Utilizador</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <User size={18} className="text-slate-400" />
                    <span className="text-sm font-bold text-slate-800">{user?.username}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Email</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <Mail size={18} className="text-slate-400" />
                    <span className="text-sm font-bold text-slate-800">{user?.email || 'Sem email registado'}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Telefone de Contacto</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <Phone size={18} className="text-slate-400" />
                    <span className="text-sm font-bold text-slate-800">{telefoneTemporario}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">NIF</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <span className="font-bold text-slate-400 text-sm">NIF</span>
                    <span className="text-sm font-bold text-slate-800">{user?.nif || 'Não fornecido'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL EDITAR PERFIL */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">Editar Perfil</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Nome de Utilizador</label>
                <input 
                  type="text" 
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Telefone de Contacto</label>
                <input 
                  type="text" 
                  value={editTelefone}
                  onChange={(e) => setEditTelefone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none" 
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button onClick={() => setIsEditOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancelar</button>
              <button onClick={atualizarPerfil} className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors">Guardar Alterações</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ALTERAR PASSWORD */}
      {isPasswordOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">Alterar Password</h3>
              <button onClick={() => setIsPasswordOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Password Atual</label>
                <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Nova Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none" />
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button onClick={() => setIsPasswordOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancelar</button>
              <button onClick={() => setIsPasswordOpen(false)} className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors">Atualizar Password</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}