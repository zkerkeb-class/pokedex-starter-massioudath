import { useState } from "react";
import "./index.css";

function PokemonCard({ id, name, tabDeTypes, image, attack, defense, hp: initialHp, onNotify }) {
  const [currentHp, setCurrentHp] = useState(initialHp);
  const [isKO, setIsKO] = useState(false);

  const handleAttack = () => {
    setCurrentHp(prevHp => {
      const newHp = Math.max(0, prevHp - 5);
      if (newHp === 0) setIsKO(true);
      return newHp;
    });

    const attaque = Math.floor(Math.random() * 30) + 10;
    const defenseAdverse = Math.floor(Math.random() * 20) + 5;
    const degats = Math.max(0, attaque - defenseAdverse);

    if (onNotify) {
      onNotify(
        `${name.french} attaque !\nPuissance d'attaque : ${attaque}\nDéfense adverse : ${defenseAdverse}\nDégâts infligés : ${degats}`,
        "attack"
      );
    }
  };

  const handleDefense = () => {
    if (!isKO) {
      setCurrentHp(prevHp => Math.min(initialHp, prevHp + 5));
      if (onNotify) {
        onNotify(`${name.french} se défend ! HP récupérés : 5`, "defense");
      }
    } else {
      if (onNotify) {
        onNotify(`${name.french} est K.O. et ne peut pas se défendre !`, "ko");
      }
    }
  };

  const handleRevive = () => {
    setCurrentHp(initialHp);
    setIsKO(false);
    if (onNotify) {
      onNotify(`${name.french} a été soigné et est de retour au combat !`, "heal");
    }
  };

  const getHealthPercentage = () => {
    return (currentHp / initialHp) * 100;
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
          <li><strong>HP:</strong> {currentHp}/{initialHp}</li>
        </ul>

        {/* Barre de vie */}
        <div className="health-bar">
          <div
            className="health-bar-fill"
            style={{ width: `${getHealthPercentage()}%`, backgroundColor: currentHp > initialHp * 0.5 ? "limegreen" : currentHp > initialHp * 0.2 ? "orange" : "red" }}
          ></div>
        </div>

        {isKO && (
          <div className="ko-message">
            <p><strong>{name.french} est K.O. !</strong></p>
          </div>
        )}
      </div>

      <div className="pokemon-actions">
        {isKO ? (
          <button onClick={(e) => { e.stopPropagation(); handleRevive(); }} style={{ backgroundColor: "lightgreen" }}>
          Soigner
        </button>
        
        ) : (
          <>
            <button onClick={(e) => { e.stopPropagation(); handleAttack(); }}>
              Attaquer
            </button>
            <button onClick={(e) => { e.stopPropagation(); handleDefense(); }}>
              Défendre
            </button>

          </>
        )}
      </div>
    </div>
  );
}

export default PokemonCard;
