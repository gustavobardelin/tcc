import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from "axios";

export default function GerenciarPagamentos() {
  // Código de Segurança
  const navigate = useNavigate();
  useEffect(() => {
    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
      navigate('/');
    }
  }, [navigate]);

  const { id } = useParams(); // id da matrícula
  const [pagamentos, setPagamentos] = useState([]);
  const [nomeMembro, setNomeMembro] = useState('');
  const [dataPagamento, setDataPagamento] = useState('');
  const [valorPago, setValorPago] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');
  const [resultado, setResultado] = useState('');

  useEffect(() => {
    async function buscarDadosMatricula() {
      try {
        const response = await axios.get(`http://localhost:3301/matriculas/${id}`);
        setNomeMembro(response.data.nome_membro);
      } catch (erro) {
        console.error("Erro ao buscar dados da matrícula:", erro);
        setNomeMembro("Não encontrado");
      }
    }
    buscarDadosMatricula();
    buscarListaPagamentos(); // Chamada inicial da lista
  }, [id]);

  async function buscarListaPagamentos() {
    try {
      const response = await axios.get(`http://localhost:3301/matriculas/${id}/pagamentos`);
      setPagamentos(response.data);
    } catch (erro) {
      alert(erro);
    }
  }

  async function registrarPagamento() {
    if (!dataVencimento || !dataPagamento || !valorPago) {
      alert("Preencha todos os campos");
      return;
    }
    try {
      setResultado("..Aguarde..");
      await axios.post("http://localhost:3301/pagamentos", {
        matricula_id: id,
        data_pagamento: dataPagamento,
        valor_pago: valorPago,
        data_vencimento: dataVencimento
      });
      setResultado("Pagamento registrado com sucesso!");
      setDataPagamento('');
      setValorPago('');
      setDataVencimento('');
      buscarListaPagamentos();
    } catch (erro) {
      setResultado("Ocorreu um erro ao registrar.");
    }
  }

  function alterar(pagamentoId) {
    navigate(`/matricula/${id}/pagamento/${pagamentoId}/alterar`);
  }

  async function excluir(pagamentoId) {
    if (window.confirm("Tem certeza que deseja excluir este pagamento?")) {
      try {
        await axios.delete(`http://localhost:3301/pagamentos/${pagamentoId}`);
        alert("Pagamento excluído com sucesso!");
        buscarListaPagamentos();
      } catch (erro) {
        console.error("Erro ao excluir pagamento:", erro);
        alert("Erro ao excluir pagamento.");
      }
    }
  }

  return (
    <div>
      <h3>Pagamentos de: {nomeMembro}</h3>
      <h4>Registrar Novo Pagamento</h4>
      <form>
        <label>Data de Vencimento:</label>
        <input type="date" value={dataVencimento} onChange={(e) => setDataVencimento(e.target.value)} required />
        <label>Data de Pagamento:</label>
        <input type="date" value={dataPagamento} onChange={(e) => setDataPagamento(e.target.value)} required />
        <label>Valor Pago:</label>
        <input type="number" placeholder="Valor Pago" value={valorPago} onChange={(e) => setValorPago(e.target.value)} required />
        <input type="button" value="Registrar" onClick={registrarPagamento} />
        <p>{resultado}</p>
      </form>
      <hr />
      <h4>Histórico de Pagamentos</h4>
      <table>
        <thead>
          <tr>
            <th>ID Pag.</th>
            <th>Vencimento</th>
            <th>Data Pag.</th>
            <th>Valor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pagamentos.map((pag) => (
            <tr key={pag.pagamento_id}>
              <td>{pag.pagamento_id}</td>
              <td>{new Date(pag.data_vencimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
              <td>{new Date(pag.data_pagamento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
              <td>R$ {pag.valor_pago}</td>
              <td>
                <a href="#" onClick={(e) => { e.preventDefault(); alterar(pag.pagamento_id); }} className="btn-acao btn-alterar">Alterar</a>
                <a href="#" onClick={(e) => { e.preventDefault(); excluir(pag.pagamento_id); }} className="btn-acao btn-excluir">Excluir</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <Link to="/matriculas" className="btn-voltar">Voltar para Matrículas</Link>
    </div>
  );
}