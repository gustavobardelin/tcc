import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    // Código de Segurança
    const navigate = useNavigate();
    useEffect(() => {
        const usuario = localStorage.getItem('usuario');
        if (!usuario) {
            navigate('/');
        }
    }, [navigate]);

    // Pega o nome do usuário que está no localStorage para dar um "Olá"
    const usuarioLogado = JSON.parse(localStorage.getItem('usuario'));
    const nomeUsuario = usuarioLogado ? usuarioLogado.nome : '';

    return (
        <div>
            <h2 className="page-title">Olá, {nomeUsuario}! Bem-vindo(a) ao Sistema.</h2>
            <p className="page-subtitle">Use o menu de navegação acima para gerenciar as seções do sistema</p>

            {/* Container dos cards atualizado com 4 itens */}
            <div className="card-container">

                <div className="info-card">
                    <h3>Gerenciar <br/> Membros</h3>
                    <p>Adicione, visualize, edite e remova os membros da academia.</p>
                </div>

                <div className="info-card">
                    <h3>Gerenciar <br/> Planos</h3>
                    <p>Crie e administre os planos e valores disponíveis para os membros.</p>
                </div>

                <div className="info-card">
                    <h3>Gerenciar <br/> Matrículas</h3>
                    <p>Associe membros a planos e controle o status de cada matrícula.</p>
                </div>

                {/* === CARD NOVO ADICIONADO === */}
                <div className="info-card">
                    <h3>Controle de Pagamentos</h3>
                    <p>Registre e gerencie as mensalidades de cada matrícula individualmente.</p>
                </div>

            </div>
        </div>
    );
}

export default Home;