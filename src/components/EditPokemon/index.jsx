import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function EditPokemon() {
  const { id } = useParams();  // Récupérer l'ID du Pokémon à partir de l'URL
  const [pokemon, setPokemon] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    sprite: ''
  });

  useEffect(() => {
    // Charger le Pokémon à partir de l'ID
    axios.get(`http://localhost:3000/pokemons/${id}`)
      .then(response => {
        const pokemonData = response.data;
        setPokemon(pokemonData);
        setFormData({
          name: pokemonData.name.french,
          type: pokemonData.type.join(', '),
          sprite: pokemonData.image
        });
      })
      .catch(error => {
        console.error("Erreur lors de la récupération du Pokémon", error);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    const { name, type, sprite } = formData;
    const updatedPokemon = {
      name: { french: name },
      type: type.split(',').map(t => t.trim()), // Assurer que type est un tableau
      image: sprite
    };

    try {
      // Effectuer la requête PUT avec l'ID du Pokémon
      const response = await axios.put(`http://localhost:3000/pokemons/edit/${id}`, updatedPokemon);
      if (response.status === 200) {
        alert("✅ Pokémon modifié avec succès !");
        // Rediriger ou mettre à jour la liste des Pokémon selon ton besoin
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du Pokémon", error);
      alert("❌ Échec de la modification");
    }
  };

  if (!pokemon) {
    return <p>Chargement du Pokémon...</p>;
  }

  return (
    <div>
      <h2>Modifier le Pokémon</h2>
      <form onSubmit={handleEdit}>
        <label>Nom :</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <label>Type :</label>
        <input
          type="text"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        />
        <label>Image URL :</label>
        <input
          type="text"
          name="sprite"
          value={formData.sprite}
          onChange={handleChange}
          required
        />
        <button type="submit">Mettre à jour</button>
      </form>
    </div>
  );
}

export default EditPokemon;
