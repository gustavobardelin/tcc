import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AlterarPagamento() {
    // Código de Segurança
    const navigate = useNavigate();
    useEffect(() => {
        const usuario = localStorage.getItem('usuario');
        if (!usuario) {
            navigate('/');
        }
    }, [navigate]);

    const { id, matriculaId } = useParams(); // Pega os dois IDs da URL
    const [dataPagamento, setDataPagamento] = useState('');
    const [valorPago, setValorPago] = useState('');
    const [dataVencimento, setDataVencimento] = useState('');

    useEffect(() => {
        async function buscarDadosPagamento() {
            try {
                const response = await axios.get(`http://localhost:3301/pagamentos/${id}`);
                const pagamento = response.data;
                // Formata as datas para o formato que o input type="date" aceita (AAAA-MM-DD)
                setDataPagamento(new Date(pagamento.data_pagamento).toISOString().split('T')[0]);
                setValorPago(pagamento.valor_pago);
                setDataVencimento(new Date(pagamento.data_vencimento).toISOString().split('T')[0]);
            } catch (erro) {
                console.error("Erro ao buscar dados do pagamento:", erro);
                alert("Erro ao carregar dados do pagamento.");
            }
        }
        buscarDadosPagamento();
    }, [id]);

    async function handleAlterar() {
        if (!dataVencimento || !dataPagamento || !valorPago) {
            alert("Preencha todos os campos!");
            return;
        }
        try {
            await axios.put(`http://localhost:3301/pagamentos/${id}`, {
                data_pagamento: dataPagamento,
                valor_pago: valorPago,
                data_vencimento: dataVencimento
            });
            alert("Pagamento atualizado com sucesso!");
            navigate(`/matricula/${matriculaId}/pagamentos`); // Volta para a lista de pagamentos da matrícula
        } catch (erro) {
            console.error("Erro ao alterar pagamento:", erro);
            alert("Erro ao alterar pagamento.");
        }
    }

    return (
        <div>
            <h3>Alterar Pagamento (ID: {id})</h3>
            <form>
                <label>Data de Vencimento:</label>
                <input type="date" value={dataVencimento} onChange={(e) => setDataVencimento(e.target.value)} required />

                <label>Data de Pagamento:</label>
                <input type="date" value={dataPagamento} onChange={(e) => setDataPagamento(e.target.value)} required />

                <label>Valor Pago:</label>
                <input type="number" placeholder="Valor Pago" value={valorPago} onChange={(e) => setValorPago(e.target.value)} required />

                <input type="button" value="Salvar Alterações" onClick={handleAlterar} />
                <input type="button" value="Voltar" onClick={() => navigate(`/matricula/${matriculaId}/pagamentos`)} />
            </form>
        </div>
    );
}