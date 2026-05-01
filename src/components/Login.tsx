import { useState } from 'react';

export default function Login() {
  // Guardamos o que o utilizador escreve nestas variáveis
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensagem, setMensagem] = useState('');

  // Esta função corre quando clicamos no botão "Entrar"
  const fazerLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que a página faça refresh
    setMensagem('A verificar...');

    try {
      // O React bate à porta do servidor do Dinis
      const resposta = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (resposta.ok) {
        // Se a porta abrir, recebemos os tokens!
        const dados = await resposta.json();
        
        // Guardamos o Token no cofre do navegador (localStorage)
        localStorage.setItem('accessToken', dados.access);
        localStorage.setItem('refreshToken', dados.refresh);
        
        setMensagem('✅ Login com sucesso! Chave guardada.');
      } else {
        setMensagem('❌ Username ou password errados!');
      }
    } catch (erro) {
      setMensagem('⚠️ Erro de ligação ao servidor. O motor está ligado?');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={fazerLogin} className="w-96 rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Login ArrendAI</h2>
        
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">Username</label>
          <input 
            type="text" 
            className="w-full rounded border px-3 py-2 focus:border-blue-500 focus:outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-bold text-gray-700">Password</label>
          <input 
            type="password" 
            className="w-full rounded border px-3 py-2 focus:border-blue-500 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          className="w-full rounded bg-blue-600 py-2 font-bold text-white hover:bg-blue-700 transition"
        >
          Entrar
        </button>

        {/* Mostra mensagens de erro ou sucesso */}
        {mensagem && (
          <p className="mt-4 text-center font-semibold text-gray-700">{mensagem}</p>
        )}
      </form>
    </div>
  );
}