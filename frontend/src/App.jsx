import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";

import Home from "./paginas/Home.jsx";
import GerenciarMembros from "./paginas/GerenciarMembros.jsx";
import GerenciarPlanos from "./paginas/GerenciarPlanos.jsx";
import GerenciarMatriculas from "./paginas/GerenciarMatriculas.jsx";
import AlterarMembro from './paginas/AlterarMembro.jsx';
import AlterarPlano from './paginas/AlterarPlano.jsx';
import AlterarMatricula from './paginas/AlterarMatricula.jsx';
import Login from './paginas/Login.jsx';
import GerenciarPagamentos from './paginas/GerenciarPagamentos.jsx';
import AlterarPagamento from './paginas/AlterarPagamento.jsx'; // <<< LINHA ADICIONADA

import './App.css';

function AppContent() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('usuario');
    // Força o recarregamento para garantir que o menu suma
    window.location.href = '/'; 
  }

  // ---- LÓGICA ADICIONADA ----
  // Verifica no localStorage se existe um usuário logado
  const usuarioLogado = localStorage.getItem('usuario');
  // -------------------------

  return (
    <>
      {/* ---- CONDIÇÃO ADICIONADA ---- */}
      {/* O header com o menu só será mostrado na tela se 'usuarioLogado' for verdadeiro */}
      {usuarioLogado && (
        <header className="main-header">
          <h1>Academia</h1>
          <nav>
            <Link to="/home">Home</Link>
            <Link to="/membros">Membros</Link>
            <Link to="/planos">Planos</Link>
            <Link to="/matriculas">Matrículas</Link>
            <a href="#" onClick={handleLogout} className="logout-button">Sair</a>
          </nav>
        </header>
      )}
      {/* ------------------------- */}

      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/membros" element={<GerenciarMembros />} />
          <Route path="/planos" element={<GerenciarPlanos />} />
          <Route path="/matriculas" element={<GerenciarMatriculas />} />
          <Route path="/alterar-membro/:id" element={<AlterarMembro />} />
          <Route path="/alterar-plano/:id" element={<AlterarPlano />} />
          <Route path="/alterar-matricula/:id" element={<AlterarMatricula />} />
          <Route path="/matricula/:id/pagamentos" element={<GerenciarPagamentos />} />
          
          {/* === ROTA ADICIONADA === */}
          <Route path="/matricula/:matriculaId/pagamento/:id/alterar" element={<AlterarPagamento />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;