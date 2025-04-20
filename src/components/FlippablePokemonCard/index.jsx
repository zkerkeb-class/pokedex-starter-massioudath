import { useState } from "react";
import "./index.css";
import PokemonCard from "../pokemonCard";

function FlippablePokemonCard({ pokemon, onChooseAction }) {
  const [flipped, setFlipped] = useState(false);
  const [actionReady, setActionReady] = useState(false);

  const handleClick = () => {
    if (!flipped) {
      setFlipped(true);
      setActionReady(true); // Prépare le prochain clic
    } else if (actionReady) {
      setActionReady(false); // évite double clic
      onChooseAction(pokemon); // Appel du modal
    }
  };

  return (
    <div className="flippable-card" onClick={handleClick}>
      <div className={`flippable-card-inner ${flipped ? "flipped" : ""}`}>
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
