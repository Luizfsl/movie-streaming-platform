import React, { useState } from 'react';
import { registerUser } from '../../services/authService';

export default function Register() {
    // Variáveis para guardar o que o usuário digita
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mensagem, setMensagem] = useState('');

    // Função que roda quando o botão "Cadastrar" é clicado
    const handleCadastro = async (e: React.FormEvent) => {
        e.preventDefault(); // Evita que a página recarregue
        
        try {
            // Chama a função do authService enviando os dados digitados
            await registerUser({ name, email, password });
            setMensagem('Conta criada com sucesso! Você já pode fazer login.');
            
            // Limpa os campos após o sucesso
            setName('');
            setEmail('');
            setPassword('');
        } catch (error) {
            setMensagem('Erro ao criar conta. Verifique os dados e tente novamente.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
            <h2>Criar nova conta</h2>
            
            <form onSubmit={handleCadastro} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label>Nome:</label><br />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%' }} />
                </div>
                <div>
                    <label>Email:</label><br />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%' }} />
                </div>
                <div>
                    <label>Senha:</label><br />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%' }} />
                </div>
                
                <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>
                    Cadastrar
                </button>
            </form>

            {mensagem && <p style={{ marginTop: '20px', fontWeight: 'bold' }}>{mensagem}</p>}
        </div>
    );
}