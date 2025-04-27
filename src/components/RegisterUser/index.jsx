import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ➔ Ajouté
import axios from 'axios';
import './index.css';

const RegisterUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate(); // ➔ Ajouté

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:3000/api/auth/register',
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': '',
          },
        }
      );

      localStorage.setItem('token', res.data.token);
      setShowSuccessModal(true); // ✅ Afficher le modal

      setTimeout(() => {
        setShowSuccessModal(false);
        navigate('/login'); // ✅ Rediriger proprement vers /login
      }, 1500); // 1,5 secondes
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

      {/* Modal de succès */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>✅ Inscription réussie !</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterUser;
