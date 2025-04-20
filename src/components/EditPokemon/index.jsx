import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPokemonById, updatePokemon } from "../../services/api";
import "./index.css";

function EditPokemon() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pokemon, setPokemon] = useState(null);
  const [formData, setFormData] = useState({ name: "", type: "", image: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mongoId, setMongoId] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPokemonById(id);
        setMongoId(data._id);

        setPokemon(data);
        setFormData({
          name: data.name.french,
          type: data.type.join(', '), // utilise bien les données de la BDD
          image: data.image
        });
      } catch (err) {
        setError("Erreur lors de la récupération du Pokémon");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => { 
    e.preventDefault();
    
    // Création d'un nouvel objet pour ne pas modifier l'original
    const updatedPokemon = {
      ...pokemon,
      name: {
        ...pokemon.name,
        french: formData.name,
        english: formData.name
      },
      type: formData.type
        .split(',')
        .map(t => t.trim())
        .filter(t => t !== ""), // ✅ corrige l'erreur mongoose
      image: formData.image,
      stats: pokemon.stats, // obligatoire pour éviter les erreurs de validation
      evolutions: pokemon.evolutions || []
    };
    
    
    
    
    // Supprime les propriétés qui pourraient causer des problèmes
    delete updatedPokemon.__v;  // Supprime la version de mongoose si elle existe
    
    console.log("Données envoyées au serveur:", mongoId, updatedPokemon);

    try {
      await updatePokemon(mongoId, updatedPokemon);
      alert("✅ Pokémon mis à jour avec succès !");
      navigate("/", { replace: true });


    } catch (error) {
      console.error("Erreur lors de la modification", error);
      if (error.response && error.response.data) {
        console.log("Message d'erreur du serveur:", error.response.data);
      }
      alert("❌ Erreur lors de la mise à jour du Pokémon");
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;
  if (!pokemon) return <p>Pokémon non trouvé</p>;

  return (
    <div className="edit-pokemon">
      <h1>Modifier {pokemon.name.french}</h1>
      <form onSubmit={handleSubmit}>
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

        <label>Image :</label>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          required
        />

        <button type="submit">Mettre à jour</button>
      </form>
    </div>
  );
}

export default EditPokemon;