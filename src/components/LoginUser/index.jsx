import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './index.css';


/**
 * Composant de connexion utilisateur.
 *
 * - Permet de se connecter avec une adresse email et un mot de passe.
 * - Affiche un message d'erreur si les informations sont invalides.
 * - Stocke le token d'authentification et l'email en localStorage après succès.
 * - Redirige vers la page d'accueil après connexion.
 * - Propose un bouton pour aller vers la page d'inscription.
 *
 * @component
 */



const LoginUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false); // ➔ Pour afficher le modal
  const navigate = useNavigate();


  /**
 * Gère la tentative de connexion de l'utilisateur.
 * - Valide l'email et le mot de passe avant l'envoi.
 * - Envoie la requête POST à l'API pour s'authentifier.
 * - Stocke le token et l'email dans localStorage en cas de succès.
 * - Redirige vers la page d'accueil après succès.
 * - Affiche un message d'erreur en cas d'échec.
 *
 * @param {React.FormEvent<HTMLFormElement>} e - L'événement de soumission du formulaire.
 */

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email.includes('@')) {
      setError('Veuillez entrer une adresse email valide.');
      return;
    }
  
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
  
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('email', email);
  
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error('Erreur de connexion :', err);
      setError('Identifiants incorrects ou serveur inaccessible');
    }
  };
  

  /**
 * Redirige l'utilisateur vers la page d'inscription.
 */

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
