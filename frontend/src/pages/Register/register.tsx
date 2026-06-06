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
    confirmPassword: '',
    agreeTerms: false
  });

  return (
    <div className="register-page-container">
      <div className="register-card">
        
        {/* LOGO AREA - Agora com a imagem inserida */}
        <div className="logo-section">
          {/* Certifique-se de salvar o arquivo 'logo-cinema.png' na pasta 'public' */}
          <img src="/logo.png" alt="Clnema Filmes Antigos" className="main-logo" />
        </div>

        {/* HEADER */}
        <div className="header-section">
          <h1 className="register-title">Create your account</h1>
          <p className="register-subtitle">Begin your journey into the cinematic collective.</p>
        </div>

        {/* FORM */}
        <form className="register-form">
          
          <Input 
            label="Full Name"
            placeholder="Enter your name"
            icon={<LuUser />} 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />

          <Input 
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            icon={<LuAtSign />}
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />

          <div className="form-row-password">
            <Input 
              label="Password"
              type="password"
              placeholder="........"
              icon={<LuLock />}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <Input 
              label="Confirm"
              type="password"
              placeholder="........"
              icon={<LuShieldCheck />}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>
          
          {/* MAIN CTA BUTTON */}
          <button type="submit" className="btn-primary-gold">
            CREATE ACCOUNT <LuArrowRight className="btn-icon-right" />
          </button>
        </form>

        {/* DIVIDER */}
        <div className="divider-section">
          <span className="divider-text">OR CONTINUE WITH</span>
        </div>

        {/* GOOGLE BUTTON */}
        <button type="button" className="btn-google">
          <FcGoogle className="btn-icon-google" /> Sign up with Google
        </button>

        {/* FOOTER LINK */}
        <div className="footer-section">
          Already a member? <span className="gold-link">Log in here</span>
        </div>
      </div>
    </div>
  );
};