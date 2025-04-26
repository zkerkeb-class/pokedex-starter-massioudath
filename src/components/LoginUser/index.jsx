import React, { useState } from 'react';
import axios from 'axios';
import './index.css';

const LoginUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', { email, password });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('email', email); // AJOUT : On stocke aussi l'email saisi

      alert('Connexion réussie 🎉');
      window.location.href = '/'; // Redirection vers la HomePage
    } catch (err) {
      console.error(err);
      setError('Identifiants incorrects');
    }
  };

  return (
    <div className="login-container">
      <h2>Se connecter</h2>
      <form onSubmit={handleLogin} className="login-form">
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
        <button type="submit">Connexion</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default LoginUser;
