import React, { useState } from 'react';
import { Input } from '../../components/input/input'; 
import { LuUser, LuAtSign, LuLock, LuShieldCheck, LuArrowRight } from 'react-icons/lu';
import { FcGoogle } from 'react-icons/fc'; 
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google'; 
import './register.css'; 
import VerifyEmail from './verifyEmail';

const GoogleLoginButton = ({ onGoogleSuccess }: { onGoogleSuccess: (token: string) => void }) => {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => onGoogleSuccess(tokenResponse.access_token),
    onError: () => console.error('Login com o Google falhou')
  });

  return (
    <button type="button" className="btn-google" onClick={() => login()}>
      <FcGoogle className="btn-icon-google" /> Cadastre-se com o Google
    </button>
  );
};

export const Register = ({ onGoToHome, onGoToLogin }: { onGoToHome: () => void, onGoToLogin?: () => void }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: ''
  });
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [showVerification, setShowVerification] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setStatusMessage(null);

    // 1. Validações de Frontend baseadas no BDD
    if (formData.password !== formData.confirmPassword) {
      setStatusMessage({ type: 'error', text: 'As senhas não coincidem!' });
      return;
    }

    if (formData.password.length < 8) { 
      setStatusMessage({ type: 'error', text: 'Aviso: tamanho de senha inválida. Use pelo menos 8 caracteres.' });
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name, email: formData.email, password: formData.password,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        // 2. Intercepta erros de conta duplicada e traduz para o formato do BDD
        let errorMessage = data.message || data.error || 'Erro ao criar conta.';
        const lowerError = errorMessage.toLowerCase();
        
        if (lowerError.includes('exists') || lowerError.includes('already') || lowerError.includes('uso') || lowerError.includes('vinculada')) {
          errorMessage = 'Atenção: Esta conta já está vinculada a um utilizador.';
          
          // 3. Redireciona para o login após 2 segundos 
          if (onGoToLogin) {
            setTimeout(() => onGoToLogin(), 2000);
          }
        }

        throw new Error(errorMessage);
      }

      setStatusMessage({ type: 'success', text: 'Quase lá! Verifique o seu e-mail.' });
      setShowVerification(true); 

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro de conexão com o servidor.';
      setStatusMessage({ type: 'error', text: errorMessage });
    }
  };

  const handleGoogleRegister = async (googleToken: string) => {
    setStatusMessage(null);
    try {
      const response = await fetch('http://localhost:3000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: googleToken }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro no login social.');

      setStatusMessage({ type: 'success', text: `Bem-vindo, ${data.user?.name || 'Usuário'}! 🎉` });
      
      setTimeout(() => {
        onGoToHome();
      }, 1500);

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao comunicar com o servidor.';
      setStatusMessage({ type: 'error', text: errorMessage });
    }
  };

  return (
    <GoogleOAuthProvider clientId="697219302454-be539ui4c4cvr1rc1d0bo3kqbvi7vpe7.apps.googleusercontent.com">
      <div className="register-page-container">
        <div className="register-card">
          
          <div className="logo-section">
            <img src="/logo.png" alt="Cinema Filmes Antigos" className="main-logo" />
          </div>

          <div className="header-section">
            <h1 className="register-title">Crie sua conta</h1>
            <p className="register-subtitle">Comece sua jornada no universo cinematográfico.</p>
          </div>

          {statusMessage && (
            <div className={`status-alert ${statusMessage.type}`}>
              {statusMessage.text}
            </div>
          )}

          {showVerification ? (
            <VerifyEmail 
              email={formData.email} 
              onSuccess={() => {
                setStatusMessage({ type: 'success', text: 'Conta verificada! Redirecionando...' });
                setTimeout(() => {
                  onGoToHome();
                }, 1500);
              }} 
            />
          ) : (
            <>
              <form className="register-form" onSubmit={handleSubmit}>
                <Input label="Nome Completo" placeholder="Digite seu nome" icon={<LuUser />} value={formData.name} required onChange={(e) => setFormData({...formData, name: e.target.value})} />
                <Input label="E-mail" type="email" placeholder="nome@exemplo.com" icon={<LuAtSign />} value={formData.email} required onChange={(e) => setFormData({...formData, email: e.target.value})} />
                <div className="form-row-password">
                  <Input label="Senha" type="password" placeholder="........" icon={<LuLock />} value={formData.password} required onChange={(e) => setFormData({...formData, password: e.target.value})} />
                  <Input label="Confirmar Senha" type="password" placeholder="........" icon={<LuShieldCheck />} value={formData.confirmPassword} required onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
                </div>
                <button type="submit" className="btn-primary-gold">CRIAR CONTA <LuArrowRight className="btn-icon-right" /></button>
              </form>

              <div className="divider-section"><span className="divider-text">OU CONTINUE COM</span></div>

              <GoogleLoginButton onGoogleSuccess={handleGoogleRegister} />
            </>
          )}

          {/* Note o uso do onGoToLogin no link do rodapé também */}
          <div className="footer-section">Já tem uma conta? <span className="gold-link" onClick={onGoToLogin} style={{cursor: 'pointer'}}>Entre aqui</span></div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};