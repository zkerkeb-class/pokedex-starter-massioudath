import React from "react";

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
