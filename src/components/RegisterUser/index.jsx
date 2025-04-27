import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './index.css';




/**
 * Composant d'inscription utilisateur.
 *
 * - Permet à un utilisateur de créer un nouveau compte avec email et mot de passe.
 * - Valide le format de l'email et la longueur minimale du mot de passe.
 * - Envoie une requête POST à l'API pour enregistrer l'utilisateur.
 * - Stocke le token dans localStorage après inscription.
 * - Affiche une modale de succès puis redirige vers la page de connexion.
 *
 * @component
 */



const RegisterUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate(); 

  /**
 * Gère l'inscription de l'utilisateur.
 * - Valide les entrées avant l'envoi.
 * - Appelle l'API pour enregistrer le nouvel utilisateur.
 * - Stocke le token et affiche une modale de succès.
 * - Redirige vers la page de connexion après 1,5 seconde.
 *
 * @param {React.FormEvent<HTMLFormElement>} e - L'événement de soumission du formulaire.
 */


  const handleRegister = async (e) => {
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
      setShowSuccessModal(true);
  
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate('/login');
      }, 1500);
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

      

      {/* Modale affichée après inscription réussie */}
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
