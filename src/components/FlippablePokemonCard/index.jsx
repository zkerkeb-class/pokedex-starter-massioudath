import { useState, useEffect } from "react";

import "./index.css";
import PokemonCard from "../pokemonCard";

/**
 * Composant représentant une carte Pokémon retournable (flippable).
 * 
 * - Premier clic : retourne la carte et marque le Pokémon comme découvert.
 * - Deuxième clic : déclenche l'action `onChooseAction`.
 *
 * @param {Object} props
 * @param {Object} props.pokemon - Données du Pokémon affiché.
 * @param {function} props.onChooseAction - Fonction appelée au clic pour choisir une action (ouvrir modale...).
 * @param {Array<string>} props.foundPokemons - Liste des IDs des Pokémon déjà découverts.
 * @param {function} props.onNotify - Fonction appelée pour notifier d'un événement spécial (optionnel).
 * @param {boolean} props.forceFlip - Force l'état retourné (flip) de la carte depuis l'extérieur.
 */



function FlippablePokemonCard({ pokemon, onChooseAction, foundPokemons, onNotify,forceFlip  }) {
  const [flipped, setFlipped] = useState(false);
  const [actionReady, setActionReady] = useState(false);

    /**
   * Gère le clic sur la carte.
   * - Premier clic : retourne la carte et signale la découverte.
   * - Deuxième clic (et suivants) : ouvre directement une action (modale, etc.).
   */

  const handleClick = () => {
    if (!flipped) {
      setFlipped(true);
      setActionReady(true);
  
      // Premier clic : on retourne la carte et ajoute dans foundPokemons
      onChooseAction(pokemon, false);
    } else {
      // Deuxième clic et tous les suivants : toujours ouvrir le modal
      onChooseAction(pokemon, true);
    }
  };
  

   /**
   * Met à jour l'état retourné (flipped) si la prop `forceFlip` change.
   */ 

   
  useEffect(() => {
    setFlipped(forceFlip);

  }, [forceFlip]);
  return (
    <div className="flippable-card-wrapper">
      <div className="flippable-card" onClick={handleClick}>
        <div className={`flippable-card-inner ${flipped ? "flipped" : ""}`}>
          {foundPokemons.includes(pokemon._id) && (
            <div className="sparkle-effect"></div>
          )}
          <div className="card-front">
            <p style={{ fontWeight: "bold", fontSize: "18px", color: "crimson" }}>
              ❓ Cliquer pour révéler
            </p>
          </div>
          <div className="card-back">
            <div className="pokemon-card-container">
            <PokemonCard
            id={pokemon.id}
            name={pokemon.name}
            tabDeTypes={pokemon.type}
            image={pokemon.image}
            attack={pokemon.base?.Attack || 0}
            defense={pokemon.base?.Defense || 0}
            hp={pokemon.base?.HP || 0}
            onNotify={onNotify}
          />



            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlippablePokemonCard;
