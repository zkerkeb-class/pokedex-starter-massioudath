import React, { useState } from 'react';
import axios from 'axios';
import './index.css';

const RegisterUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:3000/api/auth/register',
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
            // On vide explicitement l'en-tête Authorization si jamais axios en ajoute un globalement
            'Authorization': ''
          }
        }
      );
  
      localStorage.setItem('token', res.data.token);
      alert("Inscription réussie !");
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'inscription");
    }
  };
  

  return (
    <div className="register-container">
      <h2>S'inscrire</h2>
      <form onSubmit={handleRegister} className="register-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Inscription</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default RegisterUser;
