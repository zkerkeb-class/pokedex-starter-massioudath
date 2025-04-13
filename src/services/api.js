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
  const response = await api.get(`?page=${page}&limit=${limit}`);
  return response.data;
};

// Récupérer un Pokémon spécifique par ID
export const getPokemonById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du Pokémon avec l'ID ${id}`, error);
    throw error;  // Lance une erreur pour pouvoir la gérer côté appelant
  }
};

// Créer un nouveau Pokémon
export const createPokemon = async (data) => {
  try {
    const response = await api.post("/", data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création du Pokémon", error);
    throw error;
  }
};

// Mettre à jour un Pokémon existant
export const updatePokemon = async (id, data) => {
  try {
    const response = await api.put(`/${id}`, data);
    console.log('Réponse de la mise à jour du Pokémon:', response);  // Log de la réponse
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du Pokémon avec l'ID ${id}`, error);
    throw error;  // Lance une erreur pour pouvoir la gérer côté appelant
  }
};

// Supprimer un Pokémon
export const deletePokemon = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la suppression du Pokémon avec l'ID ${id}`, error);
    throw error;
  }
};
