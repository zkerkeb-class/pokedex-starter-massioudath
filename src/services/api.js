import axios from "axios";



/**
 * Service d'API pour gérer les opérations sur les Pokémon.
 *
 * - Récupérer tous les Pokémon
 * - Récupérer un Pokémon par ID
 * - Créer un nouveau Pokémon
 * - Mettre à jour un Pokémon existant
 * - Supprimer un Pokémon
 *
 * Toutes les requêtes sont authentifiées par un token JWT stocké dans localStorage.
 *
 * @module services/api
 */


const API_URL = "http://localhost:3000/api/pokemons";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


// Récupérer tous les Pokémon

/**
 * Récupère tous les Pokémon avec pagination.
 *
 * @param {number} [page=1] - Numéro de la page à récupérer.
 * @param {number} [limit=10] - Nombre de Pokémon par page.
 * @returns {Promise<Object>} - Résultat contenant les Pokémon et la pagination.
 */

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

/**
 * Récupère un Pokémon spécifique par son identifiant.
 *
 * @param {string} id - L'identifiant du Pokémon à récupérer.
 * @returns {Promise<Object>} - Données du Pokémon récupéré.
 */

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

/**
 * Crée un nouveau Pokémon dans la base de données.
 *
 * @param {Object} data - Données du Pokémon à créer.
 * @returns {Promise<Object>} - Données du Pokémon créé.
 */


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
/**
 * Met à jour un Pokémon existant.
 *
 * @param {string} id - L'identifiant du Pokémon à mettre à jour.
 * @param {Object} data - Nouvelles données du Pokémon.
 * @returns {Promise<Object>} - Données mises à jour du Pokémon.
 */

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

/**
 * Supprime un Pokémon de la base de données.
 *
 * @param {string} id - L'identifiant du Pokémon à supprimer.
 * @returns {Promise<Object>} - Résultat de la suppression (succès).
 */

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



