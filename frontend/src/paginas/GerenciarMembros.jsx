import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function GerenciarMembros() {

  const navigate = useNavigate();
  useEffect(() => {
    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
      navigate('/');
    }
  }, [navigate]);

  const [membros, setMembros] = useState([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [resultado, setResultado] = useState('');

  //funcao q busca a lista de membros
  async function buscarListaMembro() {
    try {
      const response = await axios.get('http://localhost:3301/membros');
      setMembros(response.data);
    } catch (erro) {
      alert(erro);
    }
  }

  //funcao p cadastrar um membro novo
  async function cadastrar() {
    if (!nome || !email || !telefone || !dataNascimento) {
      return alert('Por favor, preencha todos os campos');
    }
    try {
      setResultado("..Aguarde..");
      const response = await axios.post('http://localhost:3301/membros', { nome, email, telefone, data_nascimento: dataNascimento });
      setResultado(response.data.message);
      buscarListaMembro();
      setNome('');
      setEmail('');
      setTelefone('');
      setDataNascimento('');
    }
    catch (erro) {
      setResultado(erro.response?.data?.error || "Erro desconhecido");
    }
  }

  //deleta um membro
  async function excluir(id) {
    if (window.confirm("Tem certeza que deseja excluir este membro?")) {
      try {
        await axios.delete(`http://localhost:3301/membros/${id}`);
        alert('Membro excluído com sucesso');
        buscarListaMembro();
      }
      catch (erro) {
        alert(erro);
      }
    }
  }

  function alterar(id) {
    navigate(`/alterar-membro/${id}`);
  }

  // executa assim q a pag carrega p exibir a lista dos membr
  useEffect(() => {
    buscarListaMembro();
  }, []);

  return (
    <div>
      <h3>Adicionar Novo Membro</h3>
      <form>
        <input type="text" placeholder="Nome do membro" value={nome} onChange={(e) => setNome(e.target.value)} />
        <input type="email" placeholder="Email do membro" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="text" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
        <input type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} />
        <input type="button" value="Adicionar" onClick={cadastrar} />
        <p>{resultado}</p>
      </form>

      <hr />

      <h3>Lista de Membros</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Data de Nasc.</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {membros.map((membro) => (
            <tr key={membro.membro_id}>
              <td>{membro.membro_id}</td>
              <td>{membro.nome}</td>
              <td>{membro.email}</td>
              <td>{membro.telefone}</td>
              <td>{membro.data_nascimento ? new Date(membro.data_nascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : ''}</td>
              <td>
                <a href="#" onClick={(e) => { e.preventDefault(); alterar(membro.membro_id); }} className="btn-acao btn-alterar">Alterar</a>
                <a href="#" onClick={(e) => { e.preventDefault(); excluir(membro.membro_id); }} className="btn-acao btn-excluir">Excluir</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GerenciarMembros;