import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AlterarMembro() {
    // CÓDIGO DE SEGURANÇA (agora no lugar certo)
    const navigate = useNavigate();
    useEffect(() => {
        const usuario = localStorage.getItem('usuario');
        if (!usuario) {
            navigate('/');
        }
    }, [navigate]);

    const { id } = useParams();
    // const navigate = useNavigate(); // REMOVIDO DAQUI POIS JÁ FOI DECLARADO ACIMA
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [resultado, setResultado] = useState('');

    // buscar os dados do membro q sera alterado
    async function buscarDadosMembro() {
        try {
            const res = await axios.get(`http://localhost:3301/membros/${id}`);
            setNome(res.data.nome);
            setEmail(res.data.email);
            setTelefone(res.data.telefone);
            const dataFormatada = new Date(res.data.data_nascimento).toISOString().split('T')[0];
            setDataNascimento(dataFormatada);
        } catch (erro) {
            alert(erro);
        }
    }

    //qnd aperta o botao p alterar é essa funcao q executa
    async function alterar() {
        try {
            setResultado("..Aguarde..");
            const response = await axios.put(`http://localhost:3301/membros/${id}`, { nome: nome, email: email, telefone: telefone, data_nascimento: dataNascimento });
            alert("Membro atualizado com sucesso");
            navigate('/membros');
        } catch (erro) {
            console.error(erro);
        }
    }

    function voltar() {
        navigate('/membros');
    }

    // faz a primeira consulta qnd o monta o comp
    useEffect(() => {
        buscarDadosMembro();
    }, [id]);

    return (
        <div>
            <h3>Alterar Membro (ID: {id})</h3>
            <form>
                <p>
                    <label>Nome:</label><br />
                    <input type="text" placeholder="Nome do membro" value={nome} onChange={(e) => setNome(e.target.value)} />
                </p>
                <p>
                    <label>Email:</label><br />
                    <input type="email" placeholder="Email do membro" value={email} onChange={(e) => setEmail(e.target.value)} />
                </p>
                <p>
                    <label>Telefone:</label><br />
                    <input type="text" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                </p>
                <p>
                    <label>Data de Nascimento:</label><br />
                    <input type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} />
                </p>
                <p>
                    <input type="button" value="Salvar Alterações" onClick={alterar} />
                    &nbsp;
                    <input type="button" value="Voltar" onClick={voltar} />
                </p>
            </form>
        </div>
    );
}

export default AlterarMembro;