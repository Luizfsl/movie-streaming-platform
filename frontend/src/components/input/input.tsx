import React from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; 
  error?: string; 
}

export const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <div className="input-wrapper">
      {/* Exibe o label se ele for passado por propriedade */}
      {label && <label className="input-label">{label}</label>}
      
      {/* Repassamos todas as propriedades nativas para o input real */}
      <input 
        className={`input-element ${error ? 'input-element--error' : ''}`} 
        {...props} 
      />
      
      {/* Exibe a mensagem de erro se houver alguma */}
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};