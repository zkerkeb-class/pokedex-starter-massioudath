import { useState } from "react";
import "./index.css";

/**
 * Composant représentant une carte Pokémon interactive.
 *
 * - Affiche les informations du Pokémon (nom, types, attaque, défense, HP).
 * - Permet d'attaquer, de se défendre, ou de se soigner si le Pokémon est K.O.
 * - Met à jour dynamiquement la barre de vie en fonction des actions.
 * - Notifie les actions via le callback `onNotify`.
 *
 * @component
 *
 * @param {Object} props
 * @param {number} props.id - Identifiant unique du Pokémon.
 * @param {Object} props.name - Objet contenant les noms du Pokémon (`french`, `english`, etc.).
 * @param {Array<string>} props.tabDeTypes - Liste des types du Pokémon.
 * @param {string} props.image - URL de l'image du Pokémon.
 * @param {number} props.attack - Valeur d'attaque du Pokémon.
 * @param {number} props.defense - Valeur de défense du Pokémon.
 * @param {number} props.hp - Points de vie de départ du Pokémon.
 * @param {function} props.onNotify - Fonction pour envoyer des notifications d'actions (attaque, défense, soin, KO).
 */



function PokemonCard({ id, name, tabDeTypes, image, attack, defense, hp: initialHp, onNotify }) {
  const [currentHp, setCurrentHp] = useState(initialHp);
  const [isKO, setIsKO] = useState(false);


  /**
 * Gère l'action d'attaque :
 * - Réduit les HP.
 * - Simule une attaque et une défense pour calculer les dégâts.
 * - Notifie l'action.
 */


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

  /**
 * Gère l'action de défense :
 * - Récupère 5 HP si le Pokémon n'est pas K.O.
 * - Notifie l'action.
 */


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


  /**
 * Soigne le Pokémon s'il est K.O. :
 * - Restaure les HP à leur valeur initiale.
 * - Réinitialise l'état K.O.
 * - Notifie l'action.
 */


  const handleRevive = () => {
    setCurrentHp(initialHp);
    setIsKO(false);
    if (onNotify) {
      onNotify(`${name.french} a été soigné et est de retour au combat !`, "heal");
    }
  };


  /**
 * Calcule le pourcentage de vie actuel par rapport aux HP initiaux.
 *
 * @returns {number} Pourcentage de vie restante.
 */

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
