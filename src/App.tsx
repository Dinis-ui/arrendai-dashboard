import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import PortalInquilino from './components/PortalInquilino';
import DetalhesImovel from './components/DetalhesImovel';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/portal" element={<PortalInquilino />} />
        <Route path="/imovel/:id" element={<DetalhesImovel />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}