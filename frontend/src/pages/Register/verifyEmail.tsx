import React, { useState } from 'react';
import axios from 'axios';

// Recebe o email que o utilizador acabou de usar no registo
interface VerifyEmailProps {
  email: string;
  onSuccess: () => void; // Função para redirecionar o utilizador após o sucesso
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({ email, onSuccess }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      // Chama a rota que acabámos de criar no backend!
      const response = await axios.post('http://localhost:3000/api/verify-email', {
        email: email,
        code: code
      });

      setSuccessMsg(response.data.message); // "Conta ativada com sucesso..."
      
      // Aguarda 2 segundos para o utilizador ler a mensagem e redireciona
      setTimeout(() => {
        onSuccess();
      }, 2000);

    } catch (err: unknown) { // Mudamos de 'any' para 'unknown'
      
      // Verificamos se o erro foi gerado pelo Axios (ex: o backend retornou 400 ou 500)
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Ocorreu um erro ao verificar o código.');
      } 
      // Se for um erro nativo do JavaScript (ex: variável não definida, erro de rede genérico)
      else if (err instanceof Error) {
        setError(err.message);
      } 
      // Fallback genérico
      else {
        setError('Ocorreu um erro inesperado.');
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verificacao-container" style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Verifique o seu E-mail</h2>
      <p>Enviámos um código de 6 dígitos para <strong>{email}</strong>.</p>
      <p>Por favor, introduza-o abaixo para ativar a sua conta.</p>

      <form onSubmit={handleVerify} style={{ marginTop: '20px' }}>
        <input 
          type="text" 
          maxLength={6}
          placeholder="000000"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{ fontSize: '24px', letterSpacing: '5px', textAlign: 'center', width: '150px' }}
          required
        />
        
        <br /><br />

        <button type="submit" disabled={loading || code.length < 6}>
          {loading ? 'A verificar...' : 'Ativar Conta'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      {successMsg && <p style={{ color: 'green', marginTop: '10px' }}>{successMsg}</p>}
    </div>
  );
};

export default VerifyEmail;