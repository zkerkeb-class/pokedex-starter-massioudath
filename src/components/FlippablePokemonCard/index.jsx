import { useState, useEffect } from "react";

import "./index.css";
import PokemonCard from "../pokemonCard";

function FlippablePokemonCard({ pokemon, onChooseAction, foundPokemons, onNotify,forceFlip  }) {
  const [flipped, setFlipped] = useState(false);
  const [actionReady, setActionReady] = useState(false);

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
