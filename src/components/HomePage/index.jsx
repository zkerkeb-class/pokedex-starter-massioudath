// HomePage.jsx corrigé avec interaction par double clic uniquement
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllPokemons, deletePokemon, updatePokemon } from "../../services/api";
import SearchBar from "../SearchBar";
import PokemonCard from "../pokemonCard";
import CreatePokemon from "../CreatePokemon";
import Select from "react-select"; 
import FlippablePokemonCard from "../FlippablePokemonCard";
import "./index.css";

function HomePage() {
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

  const location = useLocation();
  const navigate = useNavigate();

  const POKEMON_TYPES = [
    { label: "Feu", value: "Fire" }, { label: "Eau", value: "Water" }, { label: "Plante", value: "Grass" },
    { label: "Électrik", value: "Electric" }, { label: "Sol", value: "Ground" }, { label: "Roche", value: "Rock" },
    { label: "Vol", value: "Flying" }, { label: "Insecte", value: "Bug" }, { label: "Poison", value: "Poison" },
    { label: "Spectre", value: "Ghost" }, { label: "Acier", value: "Steel" }, { label: "Dragon", value: "Dragon" },
    { label: "Ténèbres", value: "Dark" }, { label: "Psy", value: "Psychic" }, { label: "Combat", value: "Fighting" },
    { label: "Glace", value: "Ice" }, { label: "Fée", value: "Fairy" }, { label: "Normal", value: "Normal" },
  ];

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

  const handleSearch = (searchTerm, typeFilters) => {
    setSearch(searchTerm);
    setSelectedTypes(typeFilters);
  };

  const filteredPokemons = pokemons.filter((pokemon) => {
    const matchesSearch = pokemon.name?.french?.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedTypes.length === 0 || selectedTypes.some((type) => pokemon.type.includes(type));
    return matchesSearch && matchesType;
  });

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

  const handleDelete = async (mongoId, name) => {
    try {
      await deletePokemon(mongoId);
      setPokemons((prev) => prev.filter((p) => p._id !== mongoId));
      setSuccessModalMessage(`✅ ${name} supprimé avec succès !`);
      setShowSuccessModal(true);
    } catch (error) {
      alert("❌ Échec de la suppression");
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setSuccessModalMessage("");
  };
   
  return (
    <div className="home-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <SearchBar onSearch={handleSearch} />
        <button onClick={() => setShowModal(true)} className="create-button">Créer un Pokémon</button>
      </div>

      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="pokemon-list" >
        {filteredPokemons.map((pokemon) => (
          <FlippablePokemonCard
            key={pokemon._id}
            pokemon={pokemon}
            onChooseAction={(p) => setSelectedPokemon(p)}
          />
        ))}
      </div>

      {showModal && (
        <CreatePokemon
          onClose={() => setShowModal(false)}
          onCreated={(newPokemon) => setPokemons((prev) => [newPokemon, ...prev])}
        />
      )}

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

      {editModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Modifier {editForm.name}</h2>
            <img src={editForm.image} alt={editForm.name} width="150" />
            <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input type="text" name="name" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} required />
              <Select
                isMulti
                name="type"
                options={POKEMON_TYPES}
                value={POKEMON_TYPES.filter(option => editForm.type.includes(option.value))}
                onChange={(selected) => setEditForm({ ...editForm, type: selected.map(o => o.value) })}
              />
              <input type="text" name="image" value={editForm.image} onChange={e => setEditForm({ ...editForm, image: e.target.value })} required />
              <div style={{ display: "flex", gap: "1rem" }}>
                <button type="submit" style={{ backgroundColor: "gold", flex: 1 }}>Mettre à jour</button>
                <button type="button" onClick={() => setEditModalOpen(false)} style={{ flex: 1 }}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

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

      {successModalMessage && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="success-modal">{successModalMessage}</h2>
            <button onClick={() => setShowSuccessModal(false)} className="success-button">Fermer</button>
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
  );
}

export default HomePage;
