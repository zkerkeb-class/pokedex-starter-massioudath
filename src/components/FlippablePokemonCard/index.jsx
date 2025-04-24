import { useState } from "react";
import "./index.css";
import PokemonCard from "../pokemonCard";

function FlippablePokemonCard({ pokemon, onChooseAction, foundPokemons }) {
  const [flipped, setFlipped] = useState(false);
  const [actionReady, setActionReady] = useState(false);

  const handleClick = () => {
    if (!flipped) {
      setFlipped(true);
      setActionReady(true);
      
      // Premier clic: ajouter à foundPokemons sans ouvrir le modal
      onChooseAction(pokemon, false);
    } else if (actionReady) {
      setActionReady(false);
      
      // Deuxième clic: ouvrir le modal
      onChooseAction(pokemon, true);
    }
  };

  return (
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
          <PokemonCard
            name={pokemon.name}
            tabDeTypes={pokemon.type}
            image={pokemon.image}
            attack={pokemon.stats?.attack}
            defense={pokemon.stats?.defense}
            hp={pokemon.stats?.hp}
          />
        </div>
      </div>
    </div>
  );
}
export default FlippablePokemonCard;
