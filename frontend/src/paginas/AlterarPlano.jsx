import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AlterarPlano() {
    // CÓDIGO DE SEGURANÇA (agora no lugar certo)
    const navigate = useNavigate();
    useEffect(() => {
        const usuario = localStorage.getItem('usuario');
        if (!usuario) {
            navigate('/');
        }
    }, [navigate]);

    const { id } = useParams();
    // const navigate = useNavigate(); 
    const [nomePlano, setNomePlano] = useState('');
    const [valor, setValor] = useState('');
    const [resultado, setResultado] = useState('');

    //busca os dados do plano q sera alterado
    async function buscarDadosPlano() {
        try {
            const res = await axios.get(`http://localhost:3301/planos/${id}`);
            setNomePlano(res.data.nome_plano);
            setValor(res.data.valor);
        } catch (erro) {
            console.error(erro);
        }
    }

    // qnd aperta o botao p alterar executa essa funçao
    async function alterar() {
        try {
            setResultado("..Aguarde..");
            const response = await axios.put(`http://localhost:3301/planos/${id}`, { nome_plano: nomePlano, valor: valor });
            alert("Plano atualizado com sucesso");
            navigate('/planos');
        } catch (erro) {
            alert(erro);
        }
    }

    function voltar() {
        navigate('/planos');
    }

    // faz a primeira consulta qnd o monta o comp
    useEffect(() => {
        buscarDadosPlano();
    }, [id]);

    return (
        <div>
            <h3>Alterar Plano (ID: {id})</h3>
            <form>
                <p>
                    <label>Nome do Plano:</label><br />
                    <input
                        type="text"
                        placeholder="Nome do plano"
                        value={nomePlano}
                        onChange={(e) => setNomePlano(e.target.value)}
                    />
                </p>
                <p>
                    <label>Valor (R$):</label><br />
                    <input
                        type="number"
                        step="0.01"
                        placeholder="Valor do plano"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                    />
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

export default AlterarPlano;