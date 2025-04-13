import { useEffect, useState } from "react";
import { getAllPokemons, deletePokemon, updatePokemon } from "../../services/api";
import SearchBar from "../SearchBar";
import PokemonCard from "../pokemonCard";
import "./index.css";
import axios from 'axios';

function HomePage() {
  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [formData, setFormData] = useState({ name: "", type: "", sprite: "" });
  const [successMessage, setSuccessMessage] = useState("");

  // Récupération des Pokémon
  useEffect(() => {
    async function fetchData() {
      let allPokemons = [];
      let currentPage = 1;
      let totalPages = 1;

      try {
        while (currentPage <= totalPages) {
          const data = await getAllPokemons(currentPage);
          if (data && data.pokemons && Array.isArray(data.pokemons)) {
            allPokemons = allPokemons.concat(data.pokemons);
            totalPages = data.totalPages;
          }
          currentPage += 1;
        }
        setPokemons(allPokemons);
      } catch (error) {
        console.error("Erreur lors du chargement des Pokémon", error);
        setError("Erreur lors du chargement des Pokémon");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSearch = (searchTerm, typeFilters) => {
    setSearch(searchTerm);
    setSelectedTypes(typeFilters);
  };

  const filteredPokemons = pokemons.filter((pokemon) => {
    const matchesSearch = pokemon.name?.french
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchesType =
      selectedTypes.length === 0 || selectedTypes.some((type) => pokemon.type.includes(type));
    return matchesSearch && matchesType;
  });

  // Ouvre la modale pour modifier ou supprimer
  const openModal = (pokemon) => {
    setSelectedPokemon(pokemon);
    setFormData({
      name: pokemon.name.french,
      type: pokemon.type.join(", "),
      sprite: pokemon.image,
    });
    setShowModal(true);
  };

  // Ferme la modale
  const closeModal = () => {
    setShowModal(false);
    setModalAction(null);
    setSelectedPokemon(null);
    setSuccessMessage(""); // Réinitialiser le message de succès
  };

  // Gère la suppression
  const handleDelete = async () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedPokemon.name.french} ?`)) {
      try {
        await deletePokemon(selectedPokemon.id);
        setPokemons((prev) => prev.filter((p) => p.id !== selectedPokemon.id));
        alert("✅ Pokémon supprimé avec succès !");
        closeModal();
      } catch (error) {
        console.error("Erreur lors de la suppression du Pokémon", error);
        alert("❌ Échec de la suppression");
      }
    }
  };

  // Gère la modification
  const handleEdit = async (e) => {
    e.preventDefault();
    const { name, type, sprite } = formData;
    const updatedPokemon = {
      id: selectedPokemon.id,  // L'ID du Pokémon
      name: { french: name },
      type: type.split(",").map(t => t.trim()), 
      image: sprite,
    };
  
    console.log(`ID du Pokémon à modifier : ${selectedPokemon.id}`);  // Vérifie l'ID dans les logs
  
    try {
      // Effectue la requête PUT à l'API
      const response = await axios.put(`http://localhost:3000/pokemons/${selectedPokemon.id}`, updatedPokemon);
  
      if (response.status === 200) {
        console.log('Réponse de la mise à jour:', response);
        setPokemons((prev) => prev.map((p) => (p.id === updatedPokemon.id ? updatedPokemon : p)));
        alert("✅ Pokémon modifié avec succès !");
        closeModal();
      } else {
        throw new Error('Échec de la mise à jour');
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du Pokémon", error);
      alert("❌ Échec de la modification");
    }
  };
  
  
  

  // Gère les changements dans les champs du formulaire
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <p>Chargement des Pokémon...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="home-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <SearchBar onSearch={handleSearch} />
        <button onClick={() => openModal(null)} className="create-button">Créer un Pokémon</button>
      </div>

      <div className="pokemon-list" style={{ overflowY: "scroll", maxHeight: "80vh" }}>
        {filteredPokemons.length === 0 ? (
          <p>Aucun Pokémon trouvé.</p>
        ) : (
          filteredPokemons.map((pokemon) => (
            <div key={pokemon.id} className="pokemon-card-container" onClick={() => openModal(pokemon)}>
              <PokemonCard
                name={pokemon.name}
                tabDeTypes={pokemon.type}
                image={pokemon.image}
                attack={pokemon.base?.Attack}
                defense={pokemon.base?.Defense}
                hp={pokemon.base?.HP}
              />
            </div>
          ))
        )}
      </div>

      {/* Modal pour modifier ou supprimer */}
      {showModal && selectedPokemon && modalAction === null && (
        <div className="modal-overlay">
          <div className="modal">
            <img src={selectedPokemon.image} alt={selectedPokemon.name.french} style={{ width: '100px', height: '100px', marginBottom: '20px' }} />
            <h2>Que voulez-vous faire avec {selectedPokemon.name.french} ?</h2>
            <div className="modal-buttons">
              <button onClick={() => setModalAction('edit')} className="modal-btn edit-btn">Modifier</button>
              <button onClick={() => setModalAction('delete')} className="modal-btn delete-btn">Supprimer</button>
              <button onClick={closeModal} className="modal-btn close-btn">Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de modification */}
      {showModal && modalAction === 'edit' && selectedPokemon && (
        <div className="modal-overlay">
          <div className="modal">
            <img src={selectedPokemon.image} alt={selectedPokemon.name.french} style={{ width: '100px', height: '100px', marginBottom: '20px' }} />
            <h1>Modifier le Pokémon</h1>
            <form onSubmit={handleEdit}>
              <label>Nom :</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              <label>Type :</label>
              <input type="text" name="type" value={formData.type} onChange={handleChange} required />
              <label>Image URL :</label>
              <input type="text" name="sprite" value={formData.sprite} onChange={handleChange} required />
              <div className="modal-buttons">
                <button type="submit" className="modal-btn edit-btn">Mettre à jour</button>
                <button type="button" onClick={closeModal} className="modal-btn close-btn">Fermer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showModal && modalAction === 'delete' && selectedPokemon && (
        <div className="modal-overlay">
          <div className="modal">
            <img src={selectedPokemon.image} alt={selectedPokemon.name.french} style={{ width: '100px', height: '100px', marginBottom: '20px' }} />
            <h2>Êtes-vous sûr de vouloir supprimer {selectedPokemon.name.french} ?</h2>
            <div className="modal-buttons">
              <button onClick={handleDelete} className="modal-btn delete-btn">Supprimer</button>
              <button onClick={closeModal} className="modal-btn close-btn">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* Affichage du message de succès */}
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
    </div>
  );
}

export default HomePage;
