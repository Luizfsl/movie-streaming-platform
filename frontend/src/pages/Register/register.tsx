import React, { useState } from 'react';
import { Input } from '../../components/input/input'; 
import { LuUser, LuAtSign, LuLock, LuShieldCheck, LuArrowRight } from 'react-icons/lu';
import { FcGoogle } from 'react-icons/fc'; 
import './register.css'; 

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Estado para controlar mensagens de sucesso ou erro na tela
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede a página de recarregar
    setStatusMessage(null);

    // Validação básica de senha
    if (formData.password !== formData.confirmPassword) {
      setStatusMessage({ type: 'error', text: 'As senhas não coincidem!' });
      return;
    }

    try {
      // ⚠️ Altere o porto (ex: 3000, 5000) e a rota de acordo com o seu backend
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao criar conta.');
      }

      setStatusMessage({ type: 'success', text: 'Conta criada com sucesso! 🎉' });
      
      // Limpa o formulário após o sucesso
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });

    } catch (error: unknown) {
      // Verificamos se o erro é uma instância da classe Error padrão do JS
      const errorMessage = error instanceof Error ? error.message : 'Erro de conexão com o servidor.';
      
      setStatusMessage({ type: 'error', text: errorMessage });
    }
  };

  return (
    <div className="register-page-container">
      <div className="register-card">
        
        <div className="logo-section">
          <img src="/logo.png" alt="Cinema Filmes Antigos" className="main-logo" />
        </div>

        <div className="header-section">
          <h1 className="register-title">Create your account</h1>
          <p className="register-subtitle">Begin your journey into the cinematic collective.</p>
        </div>

        {/* Mensagem de Feedback Visual */}
        {statusMessage && (
          <div className={`status-alert ${statusMessage.type}`}>
            {statusMessage.text}
          </div>
        )}

        {/* FORM - Agora chama o handleSubmit */}
        <form className="register-form" onSubmit={handleSubmit}>
          
          <Input 
            label="Full Name"
            placeholder="Enter your name"
            icon={<LuUser />} 
            value={formData.name}
            required
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />

          <Input 
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            icon={<LuAtSign />}
            value={formData.email}
            required
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />

          <div className="form-row-password">
            <Input 
              label="Password"
              type="password"
              placeholder="........"
              icon={<LuLock />}
              value={formData.password}
              required
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <Input 
              label="Confirm"
              type="password"
              placeholder="........"
              icon={<LuShieldCheck />}
              value={formData.confirmPassword}
              required
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>

          <button type="submit" className="btn-primary-gold">
            CREATE ACCOUNT <LuArrowRight className="btn-icon-right" />
          </button>
        </form>

        <div className="divider-section">
          <span className="divider-text">OR CONTINUE WITH</span>
        </div>

        <button type="button" className="btn-google">
          <FcGoogle className="btn-icon-google" /> Sign up with Google
        </button>

        <div className="footer-section">
          Already a member? <span className="gold-link">Log in here</span>
        </div>
      </div>
    </div>
  );
};