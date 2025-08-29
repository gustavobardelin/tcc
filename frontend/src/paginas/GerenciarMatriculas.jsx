import React, { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";

export default function GerenciarMatriculas() {
  // --- CÓDIGO DE SEGURANÇA ---
  const navigate = useNavigate();
  useEffect(() => {
    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
      navigate('/');
    }
  }, [navigate]);
  // --- FIM DO CÓDIGO DE SEGURANÇA ---

  const [matriculas, setMatriculas] = useState([]);
  const [membros, setMembros] = useState([]);
  const [planos, setPlanos] = useState([]);
  const [membroId, setMembroId] = useState('');
  const [planoId, setPlanoId] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [resultado, setResultado] = useState('');

  //funcao q cadastra a matricula
  async function matricular() {
    if (!membroId || !planoId || !dataInicio) {
      alert("Preencha todos os campos para realizar a matricula");
      return;
    }
    try {
      setResultado("..Aguarde..");
      await axios.post("http://localhost:3301/matriculas", { membro_id: membroId, plano_id: planoId, data_inicio: dataInicio, status: "Ativa", });
      setResultado("Matrícula realizada com sucesso!");
      setMembroId('');
      setPlanoId('');
      setDataInicio('');
      buscarListaMatriculas();
    } catch (erro) {
      setResultado(erro);
    }
  }

  //funcao q busca a lista de matriculas p exibir
  async function buscarListaMatriculas() {
    try {
      const response = await axios.get("http://localhost:3301/matriculas");
      setMatriculas(response.data);
    } catch (erro) {
      alert(erro);
    }
  }

  //funcao q carrega os dados do select qnd aperta em cima
  async function carregarDadosSelect() {
    try {
      const resMembros = await axios.get("http://localhost:3301/membros");
      setMembros(resMembros.data);
      const resPlanos = await axios.get("http://localhost:3301/planos");
      setPlanos(resPlanos.data);
    } catch (erro) {
      alert(erro);
    }
  }

  //funcao p excluir uma matricula
  async function excluir(id) {
    if (window.confirm("Tem certeza que deseja excluir esta matrícula?")) {
      try {
        await axios.delete(`http://localhost:3301/matriculas/${id}`);
        alert("Exclusão efetuada com sucesso");
        buscarListaMatriculas();
      }
      catch (erro) {
        alert(erro);
      }
    }
  }

  function alterar(id) {
    navigate(`/alterar-matricula/${id}`);
  }

  // faz a primeira consulta qnd o monta o comp
  useEffect(() => {
    buscarListaMatriculas();
    carregarDadosSelect();
  }, []);

  return (
    <div>
      <h3>Nova Matrícula</h3>
      <form>
        <select onChange={(e) => setMembroId(e.target.value)} value={membroId} required>
          <option value="">Selecione um Membro</option>
          {membros.map((membro) => (
            <option key={membro.membro_id} value={membro.membro_id}>{membro.nome}</option>
          ))}
        </select>
        <select onChange={(e) => setPlanoId(e.target.value)} value={planoId} required>
          <option value="">Selecione um Plano</option>
          {planos.map((plano) => (
            <option key={plano.plano_id} value={plano.plano_id}>{plano.nome_plano}</option>
          ))}
        </select>
        <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} required />
        <input type="button" value="Matricular" onClick={matricular} />
        <p>{resultado}</p>
      </form>
      <hr />
      <h3>Matrículas Ativas</h3>
      <table>
        <thead>
          <tr>
            <th>Membro</th>
            <th>Plano</th>
            <th>Data de Início</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {matriculas.map((mat) => (
            <tr key={mat.matricula_id}>
              <td>{mat.nome}</td>
              <td>{mat.nome_plano}</td>
              <td>{new Date(mat.data_inicio).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
              <td>{mat.status}</td>
              <td>
                <Link to={`/matricula/${mat.matricula_id}/pagamentos`} className="btn-acao btn-pagamento">Pagamentos</Link>
                <a href="#" onClick={(e) => { e.preventDefault(); alterar(mat.matricula_id); }} className="btn-acao btn-alterar">Alterar</a>
                <a href="#" onClick={(e) => { e.preventDefault(); excluir(mat.matricula_id); }} className="btn-acao btn-excluir">Excluir</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}