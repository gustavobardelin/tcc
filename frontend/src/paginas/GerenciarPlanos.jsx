import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function GerenciarPlanos() {
  // CÓDIGO DE SEGURANÇA
  const navigate = useNavigate();
  useEffect(() => {
    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
      navigate('/');
    }
  }, [navigate]);

  const [planos, setPlanos] = useState([]);
  const [nomePlano, setNomePlano] = useState('');
  const [valor, setValor] = useState('');
  const [resultado, setResultado] = useState('');

  //funcao q busca a lista de planos
  async function buscarListaPlanos() {
    try {
      const response = await axios.get('http://localhost:3301/planos');
      setPlanos(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  //funcao p cadastrar os planos
  async function cadastrar() {
    if (!nomePlano || !valor) {
      return alert('Por favor, preencha todos os campos');
    }
    try {
      setResultado("..Aguarde..");
      const response = await axios.post('http://localhost:3301/planos', { nome_plano: nomePlano, valor: valor });
      setResultado(response.data.message);
      buscarListaPlanos();
      setNomePlano('');
      setValor('');
    }
    catch (erro) {
      setResultado(erro.response?.data?.error || "Erro desconhecido");
    }
  }

  //deleta um plano
  async function excluir(id) {
    if (window.confirm("Tem certeza que deseja excluir este plano?")) {
      try {
        await axios.delete(`http://localhost:3301/planos/${id}`);
        alert('Plano excluído com sucesso');
        buscarListaPlanos();
      }
      catch (erro) {
        alert(erro);
      }
    }
  }

  function alterar(id) {
    navigate(`/alterar-plano/${id}`);
  }

  //executa a funcao da lista assim q carrega a pag
  useEffect(() => {
    buscarListaPlanos();
  }, []);

  return (
    <div>
      <h3>Adicionar Novo Plano</h3>
      <form>
        <input
          type="text"
          placeholder="Nome do plano"
          value={nomePlano}
          onChange={(e) => setNomePlano(e.target.value)}
        />
        <input
          type="number"
          step="0.01"
          placeholder="Valor do plano"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
        <input type="button" value="Adicionar" onClick={cadastrar} />
        <p>{resultado}</p>
      </form>
      <hr />
      <h3>Lista de Planos</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome do Plano</th>
            <th>Valor (R$)</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {planos.map((plano) => (
            <tr key={plano.plano_id}>
              <td>{plano.plano_id}</td>
              <td>{plano.nome_plano}</td>
              <td>{plano.valor}</td>
              <td>
                <a href="#" onClick={(e) => { e.preventDefault(); alterar(plano.plano_id); }} className="btn-acao btn-alterar">Alterar</a>
                <a href="#" onClick={(e) => { e.preventDefault(); excluir(plano.plano_id); }} className="btn-acao btn-excluir">Excluir</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GerenciarPlanos;