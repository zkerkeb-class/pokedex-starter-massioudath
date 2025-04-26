import axios from "axios";

const API_URL = "http://localhost:3000/api/pokemons";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


// Récupérer tous les Pokémon
export const getAllPokemons = async (page = 1, limit = 10) => {
  const token = localStorage.getItem('token'); // récupère ton token stocké après login/register
  const response = await api.get(`?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`, // injecte le token ici
    },
  });
  return response.data;
};


// Récupérer un Pokémon spécifique par ID
export const getPokemonById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data.pokemon; // ✅ ici on extrait directement le Pokémon
  } catch (error) {
    console.error(`Erreur lors de la récupération du Pokémon avec l'ID ${id}`, error);
    throw error;
  }
};
 
// Créer un nouveau Pokémon
export const createPokemon = async (data) => {
  try {
    const token = localStorage.getItem('token'); // 🔥 récupère le token
    const response = await api.post("/", data, {
      headers: {
        Authorization: `Bearer ${token}`, // 🔥 injecte le token ici aussi
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création du Pokémon", error);
    throw error;
  }
};


// Mettre à jour un Pokémon existant

// Mettre à jour un Pokémon existant
export const updatePokemon = async (id, data) => {
  try {
    const token = localStorage.getItem('token'); // 🔥 récupère le token
    const response = await api.put(`/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`, // 🔥 injecte le token dans la requête PUT
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du Pokémon avec l'ID ${id}`, error);
    if (error.response && error.response.data) {
      console.log("Message d'erreur du serveur:", error.response.data);
    }
    throw error;
  }
};


// Supprimer un Pokémon
export const deletePokemon = async (id) => {
  try {
    const token = localStorage.getItem('token');
    await api.delete(`/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { success: true };
  } catch (error) {
    console.error(`Erreur lors de la suppression du Pokémon avec l'ID ${id}`, error);
    throw error;
  }
};



