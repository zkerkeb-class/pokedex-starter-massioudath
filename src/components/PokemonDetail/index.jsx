import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getPokemonById, deletePokemon } from "../../services/api";
import "./index.css";


/**
 * Composant d'affichage des détails d'un Pokémon.
 *
 * - Affiche les informations détaillées du Pokémon (nom, image, types, stats).
 * - Permet de naviguer vers la page d'édition du Pokémon.
 * - Permet de supprimer le Pokémon avec confirmation par modale.
 * - Gère les erreurs de récupération ou de suppression.
 *
 * @component
 */

function PokemonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // Pour afficher la modale


  /**
 * Récupère les données du Pokémon à partir de son ID.
 * Gère également les erreurs de récupération.
 */


  useEffect(() => {
    if (!id || id === "undefined") {
      setError("ID invalide");
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const data = await getPokemonById(id);
        setPokemon(data);
      } catch (err) {
        setError("Erreur lors de la récupération des données.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  /**
 * Supprime le Pokémon actuel via l'API.
 * Redirige vers la page d'accueil en cas de succès.
 */

  const handleDelete = async () => {
    try {
      await deletePokemon(id);
      setShowModal(false);
      navigate("/");
    } catch (err) {
      alert("❌ Échec de la suppression.");
      console.error(err);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;
  if (!pokemon) return <p>Aucun Pokémon trouvé.</p>;

  return (
    <div className="pokemon-detail">
      <h1>{pokemon.name.french}</h1>
      <img src={pokemon.image} alt={pokemon.name.french} className="pokemon-image" />
      <p><strong>Type :</strong> {pokemon.type.join(", ")}</p>
      <p><strong>Attack :</strong> {pokemon.base.Attack}</p>
      <p><strong>Defense :</strong> {pokemon.base.Defense}</p>
      <p><strong>HP :</strong> {pokemon.base.HP}</p>

      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <Link to={`/edit/${pokemon.id}`}>
          <button className="update-button">Mettre à jour</button>
        </Link>

        <button className="delete-button" onClick={() => setShowModal(true)}>
          Supprimer
        </button>
      </div>

     {/* Modale de confirmation affichée avant suppression du Pokémon */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirmer la suppression</h3>
            <p>Supprimer <strong>{pokemon.name.french}</strong> ?</p>
            <div className="modal-actions">
              <button className="delete-button" onClick={handleDelete}>Oui</button>
              <button className="cancel-button" onClick={() => setShowModal(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PokemonDetail;
