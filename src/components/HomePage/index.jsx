


import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllPokemons, deletePokemon, updatePokemon } from "../../services/api";
import SearchBar from "../searchBar";
import PokemonCard from "../pokemonCard";
import CreatePokemon from "../CreatePokemon";
import Select from "react-select"; 
import FlippablePokemonCard from "../FlippablePokemonCard";
import "./index.css";

/**
 * Page d'accueil affichant la liste des Pokémon avec fonctionnalités :
 * 
 * - Recherche par nom et par type
 * - Création d'un nouveau Pokémon
 * - Modification et suppression d'un Pokémon
 * - Système de jeu : trouver tous les Pokémon dans un temps limité
 * - Gestion utilisateur (affichage email, déconnexion)
 * - Notifications, timer, niveau de difficulté
 *
 * Fonctionnalités principales :
 * - Double clic sur une carte pour choisir une action.
 * - Sélection du niveau de jeu (facile, moyen, difficile).
 * - Sons de victoire et de défaite.
 * - Gestion de modales pour création, édition, suppression, et notifications.
 * 
 * @component
 */


function HomePage() {

  const [userEmail, setUserEmail] = useState(localStorage.getItem('email') || "");




  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) {
      setUserEmail(email);
    }
  }, []);
  


  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", type: "", sprite: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", type: "", image: "" });
  const [editingPokemon, setEditingPokemon] = useState(null);
  const [successModalMessage, setSuccessModalMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [pokemonToDelete, setPokemonToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notification, setNotification] = useState("");
  const [notificationType, setNotificationType] = useState("attack");
  const [allCardsFlipped, setAllCardsFlipped] = useState(false);
  const [forceFlip, setForceFlip] = useState(false);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const [foundPokemons, setFoundPokemons] = useState([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const POKEMON_TYPES = [
    { label: "Feu", value: "Fire" }, { label: "Eau", value: "Water" }, { label: "Plante", value: "Grass" },
    { label: "Électrik", value: "Electric" }, { label: "Sol", value: "Ground" }, { label: "Roche", value: "Rock" },
    { label: "Vol", value: "Flying" }, { label: "Insecte", value: "Bug" }, { label: "Poison", value: "Poison" },
    { label: "Spectre", value: "Ghost" }, { label: "Acier", value: "Steel" }, { label: "Dragon", value: "Dragon" },
    { label: "Ténèbres", value: "Dark" }, { label: "Psy", value: "Psychic" }, { label: "Combat", value: "Fighting" },
    { label: "Glace", value: "Ice" }, { label: "Fée", value: "Fairy" }, { label: "Normal", value: "Normal" },
  ];
  

    /**
 * Récupère tous les Pokémon à l'initialisation de la page.
 * Utilise la pagination pour charger toutes les pages.
 */


  useEffect(() => {
    async function fetchData() {
      let allPokemons = [];
      let currentPage = 1;
      let totalPages = 1;
      try {
        while (currentPage <= totalPages) {
          const data = await getAllPokemons(currentPage);
          if (data?.pokemons?.length) {
            allPokemons = allPokemons.concat(data.pokemons);
            totalPages = data.totalPages;
          }
          currentPage++;
        }
        setPokemons(allPokemons);
      } catch (error) {
        setError("Erreur lors du chargement des Pokémon");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [location]);

  //Pour le timer décompte

 // Modifiez l'useEffect pour le timer afin de mieux gérer la condition de défaite

 /**
 * Démarre le compte à rebours si le jeu est lancé.
 * Déclenche la défaite si le temps atteint zéro avant la victoire.
 */

useEffect(() => {
  if (!gameStarted || timeLeft <= 0 || gameWon) return;

  const timer = setTimeout(() => {
    setTimeLeft((prev) => {
      const next = prev - 1;

      // Si on arrive à zéro, on vérifie qu'on n'a pas déjà gagné
      if (next <= 0) {
        if (foundPokemons.length < pokemons.length) {
          setGameOver(true);
          // Le son de gameover sera joué grâce à l'useEffect qui surveille gameOver
        }
        return 0;
      }

      return next;
    });
  }, 1000);

  return () => clearTimeout(timer);
}, [gameStarted, timeLeft, gameWon, foundPokemons, pokemons]);




/**
 * Vérifie la condition de victoire en comparant le nombre de Pokémon trouvés.
 */


// Modifiez l'useEffect pour la vérification de victoire
// Unique useEffect pour vérifier la condition de victoire
useEffect(() => {
  // Log pour débogage
  console.log("Vérification victoire:", {
    found: foundPokemons.length,
    total: pokemons.length,
    gameStarted: gameStarted,
    condition: foundPokemons.length >= 151
  });

  // Vérifier la victoire uniquement si:
  // 1. Le jeu est en cours
  // 2. Le joueur n'a pas déjà perdu
  // 3. Le joueur n'a pas déjà gagné
  if (gameStarted && !gameOver && !gameWon) {
    // Si le joueur a trouvé au moins 151 Pokémon
    if (foundPokemons.length >= 151) {
      console.log("🎉 VICTOIRE DÉTECTÉE!");
      setGameWon(true);
    }
  }
}, [foundPokemons.length, pokemons.length, gameStarted, gameOver, gameWon]);

/**
 * Joue le son de victoire lorsqu'une victoire est détectée.
 */

useEffect(() => {
  if (gameWon) {
    const audio = new Audio("/sounds/victory.wav");
    audio.play();
  }
}, [gameWon]);


/**
 * Joue le son de game over lorsqu'une défaite est détectée.
 */


useEffect(() => {
  if (gameOver) {
    const audio = new Audio("/sounds/gameover.wav");
    audio.play();
  }
}, [gameOver]);

/**
 * Filtre les Pokémon en fonction du nom et des types sélectionnés.
 * @param {string} searchTerm
 * @param {Array<string>} typeFilters
 */

    
  const handleSearch = (searchTerm, typeFilters) => {
    setSearch(searchTerm);
    setSelectedTypes(typeFilters);
  };


  //  Le useEffect suivant s’active automatiquement


  
// Vérifie victoire

useEffect(() => {
  // Vérifier si le jeu est commencé, qu'on n'a pas déjà perdu et qu'il y a des Pokémon chargés
  if (gameStarted && !gameOver && pokemons.length > 0) {
    // Si tous les Pokémon disponibles ont été trouvés
    if (foundPokemons.length >= pokemons.length) {
      setGameWon(true);
    }
  }
}, [foundPokemons, pokemons, gameStarted, gameOver]);

// Pour jouer le son de victoire (ce useEffect peut rester inchangé)
useEffect(() => {
  if (gameWon) {
    const audio = new Audio("/sounds/victory.wav");
    audio.play();
  }
}, [gameWon]);


// Pour jouer le son de game over (ce useEffect peut rester inchangé)
useEffect(() => {
  if (gameOver) {
    const audio = new Audio("/sounds/gameover.wav");
    audio.play();
  }
}, [gameOver]);


/**
 * Lance le jeu en affichant la sélection du niveau.
 */

const handleStartGame = () => {
  setShowLevelModal(true);
};


/**
 * Démarre le jeu avec un temps en fonction du niveau choisi.
 * @param {number} level - Niveau de difficulté choisi (1, 2 ou 3).
 */


const startGameWithLevel = (level) => {
  if (level === 1) {
    setTimeLeft(300); // 5 minutes
  } else if (level === 2) {
    setTimeLeft(180); // 3 minutes
  } else if (level === 3) {
    setTimeLeft(120); // 2 minutes
  }
  setGameStarted(true);
  setShowLevelModal(false); // 🔥 Ferme le modal après avoir choisi
};

 
  const filteredPokemons = pokemons.filter((pokemon) => {
    const matchesSearch = pokemon.name?.french?.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedTypes.length === 0 || selectedTypes.some((type) => pokemon.type.includes(type));
    return matchesSearch && matchesType;
  });
  
  const showNotification = (message, type = "attack") => {
    setNotification(message);
    setNotificationType(type);
    setTimeout(() => {
      setNotification("");
    }, 3000);
  };
  

  /**
 * Met à jour un Pokémon existant dans la base de données.
 * @param {React.FormEvent<HTMLFormElement>} e
 */


  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedData = {
      ...editingPokemon,
      name: { ...editingPokemon.name, french: editForm.name, english: editForm.name },
      type: Array.isArray(editForm.type) ? editForm.type : editForm.type.split(",").map((t) => t.trim()),
      image: editForm.image,
      stats: editingPokemon.stats,
    };
    delete updatedData.__v;
    try {
      await updatePokemon(editingPokemon._id, updatedData);
      setSuccessModalMessage("✅ Pokémon mis à jour !");
      setShowSuccessModal(true);
      setPokemons((prev) => prev.map((p) => (p._id === editingPokemon._id ? updatedData : p)));
      setEditModalOpen(false);
      setEditingPokemon(null);
    } catch (error) {
      alert("Erreur lors de la mise à jour.");
    }
  };


  /**
 * Supprime un Pokémon de la base de données.
 * @param {string} mongoId - ID MongoDB du Pokémon.
 * @param {string} name - Nom du Pokémon à afficher en notification.
 */


  const handleDelete = async (mongoId, name) => {
    try {
      await deletePokemon(mongoId);
      setShowDeleteModal(false); // 🔥 ferme le modal
      setPokemonToDelete(null); // 🔥 nettoie la sélection
      setPokemons((prev) => prev.filter((p) => p._id !== mongoId));
      setSuccessModalMessage(`✅ ${name} supprimé avec succès !`);
      setShowSuccessModal(true);
    } catch (error) {
      setShowDeleteModal(false); // 🔥 ferme même en cas d'erreur
      alert("❌ Échec de la suppression");
    }
  };
  
  
  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setSuccessModalMessage("");
  };
   
  //Formate le temps 

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  /**
 * Déconnecte l'utilisateur et vide les données locales.
 */

  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setUserEmail(""); // ⚡ Mettre à jour directement
    navigate('/login');
  };
  const maskEmail = (email) => {
    const [name, domain] = email.split("@");
    const visiblePart = name.slice(0, 2); // Garde les 2 premières lettres
    const maskedPart = "*".repeat(Math.max(0, name.length - 2)); // Remplace le reste par des *
    return `${visiblePart}${maskedPart}@${domain}`;
  };
  
  const getInitials = (email) => {
    if (!email) return '';
    return email.slice(0, 2).toUpperCase(); // Prend les 2 premières lettres en majuscule
  };
  
  
  return (
   
      <div className="home-layout">
    
        <div className="sidebar">
        <div className="user-profile">
          <div className="avatar" onClick={() => setShowUserMenu(!showUserMenu)}>
            {getInitials(userEmail)}
          </div>

          {showUserMenu && (
            <div className="user-menu">
              <div>{userEmail}</div>
              <button onClick={handleLogout} className="logout-button">
                Déconnexion
              </button>
            </div>
          )}
        </div>

        </div>
    
        <div className="main-content">
          
        <SearchBar 
        onSearch={handleSearch}
        onCreate={() => setShowModal(true)}
        onStartGame={handleStartGame}
        onShowCards={() => setAllCardsFlipped(prev => !prev)}
        gameStarted={gameStarted}
      />

          {successMessage && <div className="success-message">{successMessage}</div>}
    
      { /* Chronomètre pour timer*/}
          
          {gameStarted && (
            <div className="timer">⏱️ Temps restant : {formatTime(timeLeft)}</div>
          )}
    
          <div className="pokemon-list">
            {filteredPokemons.map((pokemon) => (
              <FlippablePokemonCard
              key={pokemon._id}
              pokemon={pokemon}
              foundPokemons={foundPokemons}
              onChooseAction={(p, openModal = false) => {
                if (!foundPokemons.includes(p._id)) {
                  setFoundPokemons((prev) => [...prev, p._id]);
                }
                if (openModal) {
                  setSelectedPokemon(p);
                }
              }}
              onNotify={showNotification}
              forceFlip={allCardsFlipped}   
            />
            
            ))}
    
    {/* Modale de Game Over :Affichée lorsque le temps est écoulé sans avoir trouvé tous les Pokémon.
    Déclenchée par : gameOver === true. */}
            {gameOver && (
              <div className="modal-overlay">
                <div className="modal">
                  <h2>⏰ Temps écoulé !</h2>
                  <p>Désolé, vous n'avez pas trouvé tous les Pokémon.</p>
                  <button onClick={() => window.location.reload()}>Recommencer</button>
                </div>
              </div>
            )}
    
              {gameWon && (
            <div className="modal-overlay">
              <div className="modal">
                <h2>🎉 Félicitations !</h2>
                <p>Vous avez trouvé tous les Pokémon !</p>
                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <button 
                    style={{ backgroundColor: "gold", padding: "0.5rem 1rem", fontWeight: "bold", flex: 1 }} 
                    onClick={() => window.location.reload()}
                  >
                    Rejouer
                  </button>
                  <button 
                    style={{ backgroundColor: "#ccc", padding: "0.5rem 1rem", fontWeight: "bold", flex: 1 }} 
                    onClick={() => {
                      setGameWon(false);          // 🔥 Ferme le modal
                      setFoundPokemons([]);        // 🔥 Remet la liste vide
                      setGameStarted(false);       // 🔥 Arrête la partie
                    }}
                  >
                    Annuler
                  </button>

                </div>
              </div>
            </div>
          )}

          </div>

        

    {/* Affiche le formulaire pour ajouter un nouveau Pokémon déclenchée par : showModal === true.  */}
          {showModal && (
            <CreatePokemon
              onClose={() => setShowModal(false)}
              onCreated={(newPokemon) => setPokemons((prev) => [newPokemon, ...prev])}
            />
          )}
    
    {/*  Modale de choix d'action sur un Pokémon :Propose de modifier ou de supprimer le Pokémon sélectionné.Déclenchée
     par : selectedPokemon !== null. selectedPokemon && */}
          {selectedPokemon && (
            <div className="modal-overlay">
              <div className="modal">
                <h2>Que voulez-vous faire avec {selectedPokemon.name.french} ?</h2>
                <img src={selectedPokemon.image} alt={selectedPokemon.name.french} width="150" />
                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <button
                    onClick={() => {
                      setEditingPokemon(selectedPokemon);
                      setEditForm({
                        name: selectedPokemon.name.french,
                        type: selectedPokemon.type.join(", "),
                        image: selectedPokemon.image,
                      });
                      setEditModalOpen(true);
                      setSelectedPokemon(null);
                    }}
                    style={{ backgroundColor: "gold", padding: "0.5rem", flex: 1 }}
                  >Modifier</button>
                  <button
                    onClick={() => {
                      setPokemonToDelete(selectedPokemon);
                      setShowDeleteModal(true);
                      setSelectedPokemon(null);
                    }}
                    style={{ backgroundColor: "crimson", color: "white", padding: "0.5rem", flex: 1 }}
                  >Supprimer</button>
                  <button
                    onClick={() => setSelectedPokemon(null)}
                    style={{ backgroundColor: "#ccc", padding: "0.5rem", flex: 1 }}
                  >Annuler</button>
                </div>
              </div>
            </div>
          )}
    
    {/* Modale d'édition : Affiche un formulaire prérempli pour modifier un Pokémon.
Déclenchée par : editModalOpen === true. */}
          {editModalOpen && (
            <div className="modal-overlay">
              <div className="modal">
                <h2>Modifier {editForm.name}</h2>
                <img src={editForm.image} alt={editForm.name} width="150" />
                <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    required
                  />
                  <Select
                    isMulti
                    name="type"
                    options={POKEMON_TYPES}
                    value={POKEMON_TYPES.filter(option => editForm.type.includes(option.value))}
                    onChange={(selected) => setEditForm({ ...editForm, type: selected.map(o => o.value) })}
                  />
                  <input
                    type="text"
                    name="image"
                    value={editForm.image}
                    onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                    required
                  />
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <button type="submit" style={{ backgroundColor: "gold", flex: 1 }}>Mettre à jour</button>
                    <button type="button" onClick={() => setEditModalOpen(false)} style={{ flex: 1 }}>Annuler</button>
                  </div>
                </form>
              </div>
            </div>
          )}
  
  {/* Modale de confirmation de suppression :Demande confirmation avant de supprimer
   définitivement un Pokémon.Déclenchée par : showDeleteModal === true
*/}
          {showDeleteModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h2>Supprimer {pokemonToDelete.name.french} ?</h2>
                <img src={pokemonToDelete.image} alt={pokemonToDelete.name.french} width="150" />
                <p style={{ marginTop: "1rem" }}>Cette action est irréversible.</p>
                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <button
                    onClick={() => handleDelete(pokemonToDelete._id, pokemonToDelete.name.french)}
                    style={{ backgroundColor: "crimson", color: "white", flex: 1 }}
                  >Supprimer</button>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    style={{ backgroundColor: "#ccc", flex: 1 }}
                  >Annuler</button>
                </div>
              </div>
            </div>
          )}
      {/* Modale de succès :Affiche un message de réussite après modification ou suppression.
     Déclenchée par : successModalMessage ou showSuccessModal === true*/}
     
          {successModalMessage && (
            <div className="modal-overlay">
              <div className="modal">
                <h2 className="success-modal">{successModalMessage}</h2>
                <button onClick={() => setShowSuccessModal(false)} className="success-button">
                  Fermer
                </button>
              </div>
            </div>
          )}
    
          {showSuccessModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h2 className="success-modal">{successModalMessage}</h2>
                <button onClick={closeSuccessModal} className="success-button">
                  Fermer
                </button>
              </div>
            </div>
          )}
    
        </div>

        {notification && (
          <div className={`notification ${notificationType}`}>
            {notification.split('\n').map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        )}

          {showLevelModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h2>Choisissez votre niveau</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                  <button onClick={() => startGameWithLevel(1)} style={{ backgroundColor: "lightgreen", padding: "1rem" }}>
                    Niveau 1 : Facile (5 min)
                  </button>
                  <button onClick={() => startGameWithLevel(2)} style={{ backgroundColor: "orange", padding: "1rem" }}>
                    Niveau 2 : Moyen (3 min)
                  </button>
                  <button onClick={() => startGameWithLevel(3)} style={{ backgroundColor: "crimson", color: "white", padding: "1rem" }}>
                    Niveau 3 : Difficile (2 min)
                  </button>
                  <button onClick={() => setShowLevelModal(false)} style={{ marginTop: "1rem" }}>
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          )}


      </div>
    );
  
}

export default HomePage;
