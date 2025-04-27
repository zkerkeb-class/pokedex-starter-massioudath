import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './index.css';

const LoginUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false); // ➔ Pour afficher le modal
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', { email, password });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('email', email);

      setShowSuccessModal(true); // ➔ Affiche le modal de succès
      
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate('/'); // ➔ Redirige proprement après 1.5 secondes
      }, 1500);
    } catch (err) {
      console.error('Erreur de connexion :', err);
      setError('Identifiants incorrects ou serveur inaccessible');
    }
  };

  const goToRegister = () => {
    navigate('/register');
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

      <button onClick={goToRegister} style={{ marginTop: '1rem' }}>
        S'inscrire
      </button>

      {error && <p className="error">{error}</p>}

      {/* Modal de succès */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>✅ Connexion réussie !</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginUser;
