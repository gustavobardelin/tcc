import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMensagem('Verificando...');
        try {
            const response = await axios.post('http://localhost:3301/login', { email, senha });
            localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
            navigate('/home');
            window.location.reload(); // Força o recarregamento para o menu aparecer
        } catch (error) {
            setMensagem('Email ou senha incorretos.');
            console.error('Erro de login:', error);
        }
    };

    return (
        <div className="login-page"> {/* Container principal para centralizar */}
            <div className="login-container"> {/* O "card" do formulário */}
                <h2>Login do Sistema</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Digite seu email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Senha</label>
                        <input
                            type="password"
                            placeholder="Digite sua senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Entrar</button>
                </form>
                {mensagem && <p className="login-message">{mensagem}</p>}
            </div>
        </div>
    );
}