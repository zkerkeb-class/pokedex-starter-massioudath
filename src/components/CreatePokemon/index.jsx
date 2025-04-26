import { useState } from "react";
import Select from "react-select";
import { createPokemon } from "../../services/api";
import "./index.css";

const POKEMON_TYPES = [
  { label: "Feu", value: "Fire" },
  { label: "Eau", value: "Water" },
  { label: "Plante", value: "Grass" },
  { label: "Électrik", value: "Electric" },
  { label: "Sol", value: "Ground" },
  { label: "Roche", value: "Rock" },
  { label: "Vol", value: "Flying" },
  { label: "Insecte", value: "Bug" },
  { label: "Poison", value: "Poison" },
  { label: "Spectre", value: "Ghost" },
  { label: "Acier", value: "Steel" },
  { label: "Dragon", value: "Dragon" },
  { label: "Ténèbres", value: "Dark" },
  { label: "Psy", value: "Psychic" },
  { label: "Combat", value: "Fighting" },
  { label: "Glace", value: "Ice" },
  { label: "Fée", value: "Fairy" },
  { label: "Normal", value: "Normal" },
];

function CreatePokemon({ onClose, onCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    type: [],
    sprite: "",
  });
  const [successModal, setSuccessModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTypeChange = (selectedOptions) => {
    const types = selectedOptions.map((option) => option.value);
    setFormData({ ...formData, type: types });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, type, sprite } = formData;

    const newPokemon = {
      name: { french: name, english: name },
      type,
      image: sprite,
      stats: {
        hp: 0,
        attack: 0,
        defense: 0,
        specialAttack: 0,
        specialDefense: 0,
        speed: 0,
      },
    };

    try {
      const created = await createPokemon(newPokemon);
      if (onCreated) onCreated(created);
      setFormData({ name: "", type: [], sprite: "" });
      setSuccessModal(true);

      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error("❌ Erreur lors de la création du Pokémon", error);
      console.log("🧾 Détails de l'erreur :", error.response?.data);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
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

          <Select
            isMulti
            name="type"
            options={POKEMON_TYPES}
            value={POKEMON_TYPES.filter((option) =>
              formData.type.includes(option.value)
            )}
            onChange={handleTypeChange}
            className="react-select"
            classNamePrefix="react-select"
            placeholder="Types"
          />

          <input
            type="text"
            name="sprite"
            placeholder="URL de l’image"
            value={formData.sprite}
            onChange={handleChange}
            required
          />

          <div className="modal-buttons">
            <button type="submit" className="create-button">Créer</button>
            <button type="button" className="cancel-button" onClick={handleCancel}>Annuler</button>
          </div>
        </form>

        {successModal && (
          <div className="modal-success">
            <h3>✅ Pokémon ajouté avec succès !</h3>
            <button onClick={() => setSuccessModal(false)}>OK</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreatePokemon;
