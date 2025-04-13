import { Link } from "react-router-dom";
import "./index.css";

function PokemonCard({ id, name, tabDeTypes, image, attack, defense, hp }) {
  return (
    <div className="pokemon-card">
      <img src={image} alt={name.french} className="pokemon-image" />
      <div className="pokemon-info">
        <h3>{name.french}</h3>
        <ul>
          <li><strong>Types:</strong> {tabDeTypes.join(", ")}</li>
          <li><strong>Attack:</strong> {attack}</li>
          <li><strong>Defense:</strong> {defense}</li>
          <li><strong>HP:</strong> {hp}</li>
        </ul>
      </div>
      {/* Bouton Attaquer */}
      <button onClick={() => alert(`${name.french} attaque !`)}>Attaquer</button>
    </div>
  );
}

export default PokemonCard;
