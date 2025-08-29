import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AlterarMatricula() {
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
    const [dataInicio, setDataInicio] = useState('');
    const [status, setStatus] = useState('Ativa');
    const [resultado, setResultado] = useState('');

    //buscar os dados da matricula q sera alterada
    async function buscarDadosMatricula() {
        try {
            const response = await axios.get(`http://localhost:3301/matriculas/${id}`);
            const dataFormatada = new Date(response.data.data_inicio).toISOString().split('T')[0];
            setDataInicio(dataFormatada);
            setStatus(response.data.status);
        } catch (erro) {
            alert(erro);
        }
    }

    //qnd aperta o botao p salvar chama essa funcao p alterar a matricula
    async function alterar() {
        try {
            setResultado("..Aguarde..");
            const response = await axios.put(`http://localhost:3301/matriculas/${id}`, { data_inicio: dataInicio, status: status });
            alert("Matrícula atualizada com sucesso");
            navigate('/matriculas');
        }
        catch (erro) {
            alert(erro);
        }
    }

    function voltar() {
        navigate('/matriculas');
    }

    // faz a primeira consulta qnd o monta o comp
    useEffect(() => {
        buscarDadosMatricula();
    }, [id]);

    return (
        <div>
            <h3>Alterar Matrícula (ID: {id})</h3>
            <form>
                <p>
                    <label>Data de Início:</label><br />
                    <input
                        type="date"
                        value={dataInicio}
                        onChange={(e) => setDataInicio(e.target.value)}
                    />
                </p>
                <p>
                    <label>Status:</label><br />
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="Ativa">Ativa</option>
                        <option value="Cancelada">Inativa</option>
                    </select>
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

export default AlterarMatricula;