import React, { useState, useEffect } from "react";
import { getAllPokemons, deletePokemon } from "../../services/api"; // ✅ Importer deletePokemon ici

function PokemonList() {
  const [pokemons, setPokemons] = useState([]);

  // Récupère la liste des Pokémon au premier rendu
  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const data = await getAllPokemons(); // Charger les données
        setPokemons(data); // Ajuster en fonction de la structure de la réponse de l'API
      } catch (error) {
        console.error("Erreur lors de la récupération des Pokémon", error);
      }
    };
    fetchPokemons();
  }, []);

  // Fonction de suppression
 // Fonction de suppression
const handleDelete = async (mongoId, name) => {
  const confirmDelete = window.confirm(`Supprimer ${name} ?`);
  if (!confirmDelete) return;

  try {
    await deletePokemon(mongoId); // Utilise bien l'ID MongoDB
    alert("✅ Pokémon supprimé !");
    setPokemons((prev) => prev.filter((p) => p._id !== mongoId)); // Filtre avec _id
  } catch (err) {
    console.error("Erreur lors de la suppression :", err);
    alert("❌ Échec de la suppression");
  }
};


  return (
    <div>
      {pokemons.map((pokemon) => (
        <div key={pokemon.id} style={{ border: "1px solid #ccc", padding: "1rem", margin: "1rem" }}>
          <h3>{pokemon.name.french}</h3>
          <p>Type: {pokemon.type.join(", ")}</p>
          <img src={pokemon.image} alt={pokemon.name.french} width="100" height="100" />
          <button
            onClick={() => handleDelete(pokemon.id, pokemon.name.french)}
            style={{ backgroundColor: "crimson", color: "white", padding: "0.5rem 1rem", marginTop: "0.5rem" }}
          >
            Supprimer
          </button>
        </div>
      ))}
    </div>
  );
}

export default PokemonList;
