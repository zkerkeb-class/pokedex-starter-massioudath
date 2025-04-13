import { useState } from "react";
import { createPokemon } from "../../services/api";
import "./index.css"; // Import du fichier CSS

function HomePage() {
  const [formData, setFormData] = useState({ name: "", type: "", sprite: "" });
  const [pokemons, setPokemons] = useState([]); // État pour stocker les Pokémon
  const [showModal, setShowModal] = useState(false); // État pour afficher la modale

  // Gère les changements dans les champs du formulaire
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Gère la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, type, sprite } = formData;

    const newPokemon = {
      id: Date.now(),
      name: { french: name },
      type: type.split(",").map((t) => t.trim()),  // Sépare les types par des virgules
      image: sprite,
    };

    try {
      // Crée le Pokémon via l'API
      await createPokemon(newPokemon);

      // Réinitialise le formulaire
      setFormData({ name: "", type: "", sprite: "" });

      // Ajoute le Pokémon créé à la première position de la liste
      setPokemons((prevPokemons) => [newPokemon, ...prevPokemons]);

      // Affiche la modale de succès
      setShowModal(true);
    } catch (error) {
      console.error("❌ Erreur lors de la création du Pokémon", error);
    }
  };

  // Ferme la modale après soumission
  const closeModal = () => {
    setShowModal(false);
  };

  // Affiche la modale de création
  const openModal = () => {
    setShowModal(true);
  };

  return (
    <div className="home-container">
      {/* Bouton pour ouvrir la modale de création */}
      <button onClick={openModal} className="create-pokemon-button">Créer un Pokémon</button>

      {/* Modale pour afficher le formulaire de création */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h1>Ajouter un Pokémon</h1>
            <form className="create-pokemon-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Nom"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="type"
                placeholder="Type (séparés par des virgules)"
                value={formData.type}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="sprite"
                placeholder="Image URL"
                value={formData.sprite}
                onChange={handleChange}
                required
              />
              <button type="submit">Créer</button>
              <button type="button" onClick={closeModal}>Fermer</button>
            </form>
          </div>
        </div>
      )}

      {/* Affichage de la modale de succès */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>✅ Pokémon ajouté avec succès !</h3>
            <button onClick={closeModal} className="update-button">
              OK
            </button>
          </div>
        </div>
      )}

      {/* Liste des Pokémon */}
      <div>
        <h2>Liste des Pokémon</h2>
        <ul>
          {pokemons.map((pokemon) => (
            <li key={pokemon.id}>
              {pokemon.name.french} - {pokemon.type.join(", ")}
              <img src={pokemon.image} alt={pokemon.name.french} width="50" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default HomePage;
