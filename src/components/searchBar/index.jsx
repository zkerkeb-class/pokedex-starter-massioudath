import { useState, useEffect } from "react";
import "./index.css";

function SearchBar({ onSearch, onCreate, onStartGame,onShowCards, gameStarted  }) {
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  
  const POKEMON_TYPES = [
    { label: "Feu", value: "Fire" }, { label: "Eau", value: "Water" }, { label: "Plante", value: "Grass" },
    { label: "Électrik", value: "Electric" }, { label: "Sol", value: "Ground" }, { label: "Roche", value: "Rock" },
    { label: "Vol", value: "Flying" }, { label: "Insecte", value: "Bug" }, { label: "Poison", value: "Poison" },
    { label: "Spectre", value: "Ghost" }, { label: "Acier", value: "Steel" }, { label: "Dragon", value: "Dragon" },
    { label: "Ténèbres", value: "Dark" }, { label: "Psy", value: "Psychic" }, { label: "Combat", value: "Fighting" },
    { label: "Glace", value: "Ice" }, { label: "Fée", value: "Fairy" }, { label: "Normal", value: "Normal" },
  ];
  
  useEffect(() => {
    onSearch(search, selectedTypes);
  }, [search, selectedTypes, onSearch]);
  
  const handleTypeToggle = (value) => {
    setSelectedTypes(prev =>
      prev.includes(value) ? prev.filter(type => type !== value) : [...prev, value]
    );
  };
  
  const resetFilters = () => {
    setSelectedTypes([]);
    setSearch("");
  };
  
  return (
    <div className="filter-container">
      <div className="search-input">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          className="search-icon" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          placeholder="Rechercher un Pokémon"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="clear-search" onClick={() => setSearch("")}>
            ×
          </button>
        )}
      </div>
      
      <div className="filter-header">
        <span>Filtrer par type</span>
        {selectedTypes.length > 0 && (
          <button className="reset-filters" onClick={resetFilters}>
            🔄 Réinitialiser
          </button>
        )}
      </div>
      
      <div className="filter-options">
        {POKEMON_TYPES.map((type) => (
          <div
            key={type.value}
            className={`filter-option ${type.value.toLowerCase()}`}
          >
            <input
              type="checkbox"
              id={`type-${type.value}`}
              checked={selectedTypes.includes(type.value)}
              onChange={() => handleTypeToggle(type.value)}
            />
            <label htmlFor={`type-${type.value}`}>
              {type.label}
            </label>
          </div>
        ))}
      </div>
      
      {/* Container pour les deux boutons */}
      <div className="create-button-container">
        <button className="create-button" onClick={onCreate}>
          Créer un Pokémon
        </button>
        <button className="start-game-button" onClick={onStartGame}>
          Commencer le jeu
        </button>
        <button 
          className="show-cards-button" 
          onClick={onShowCards}
          disabled={gameStarted}
        >
          Afficher les cartes
        </button>




      </div>
    </div>
  );
}

export default SearchBar;