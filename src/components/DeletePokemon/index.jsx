import React from "react"; //Importer React depuis la bibliothèque react


/**
 * Composant affichant une modale de confirmation pour supprimer un Pokémon.
 *
 * @param {Object} props
 * @param {Object} props.pokemon - Le Pokémon à supprimer (doit contenir `name.french` et `image`).
 * @param {function} props.onConfirm - Fonction appelée pour confirmer la suppression.
 * @param {function} props.onCancel - Fonction appelée pour annuler la suppression.
 */ 

function DeletePokemon({ pokemon, onConfirm, onCancel }) {
  if (!pokemon) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Supprimer {pokemon.name.french} ?</h2>
        <img src={pokemon.image} alt={pokemon.name.french} width="150" />
        <p>Cette action est irréversible.</p>
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button
            onClick={onConfirm}
            style={{ backgroundColor: "crimson", color: "white", flex: 1 }}
          >
            Supprimer
          </button>
          <button
            onClick={onCancel}
            style={{ backgroundColor: "#ccc", flex: 1 }}
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeletePokemon;
