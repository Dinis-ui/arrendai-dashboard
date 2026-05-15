import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import PortalInquilino from './components/PortalInquilino';
import DetalhesImovel from './components/DetalhesImovel';
import Perfil from './components/Perfil';
import Registo from './components/Registo';
import EsqueceuPassword from './components/EsqueceuPassword';
import Mensagens from './components/Mensagens';
import DashboardSenhorio from './components/DashboardSenhorio';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registo" element={<Registo />} />
        <Route path="/recuperar-password" element={<EsqueceuPassword />} />
        <Route path="/portal" element={<PortalInquilino />} />
        <Route path="/imovel/:id" element={<DetalhesImovel />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/mensagens" element={<Mensagens />} />
        <Route path="/dashboard-senhorio" element={<DashboardSenhorio />} />
      </Routes>
    </BrowserRouter>
  );
}