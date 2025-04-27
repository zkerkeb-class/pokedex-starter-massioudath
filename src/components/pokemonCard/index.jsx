import { Link } from "react-router-dom";
import "./index.css";

function PokemonCard({ id, name, tabDeTypes, image, attack, defense, hp }) {
  const handleAttack = () => {
    const attaque = Math.floor(Math.random() * 30) + 10; // attaque entre 10 et 39
    const defenseAdverse = Math.floor(Math.random() * 20) + 5; // défense entre 5 et 24
    const degats = Math.max(0, attaque - defenseAdverse);

    alert(
      `${name.french} attaque !\n` +
      `Puissance d'attaque : ${attaque}\n` +
      `Défense adverse : ${defenseAdverse}\n` +
      `Dégâts infligés : ${degats}`
    );
  };

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
      <button onClick={handleAttack}>
        Attaquer
      </button>
    </div>
  );
}

export default PokemonCard;
