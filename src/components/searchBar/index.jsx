import { useState } from "react";

const typeList = [
  "Fire", "Water", "Grass", "Poison", "Bug", "Flying", "Normal",
  "Electric", "Ground", "Fairy", "Fighting", "Psychic", "Rock",
  "Steel", "Ice", "Ghost", "Dragon", "Dark"
];

const SearchBar = ({ onSearch }) => {
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    onSearch(e.target.value, selectedTypes);
  };

  const handleTypeChange = (type) => {
    let newSelectedTypes;
    if (selectedTypes.includes(type)) {
      // Si le type est déjà sélectionné, on l'enlève
      newSelectedTypes = selectedTypes.filter((t) => t !== type);
    } else {
      // Sinon, on l'ajoute
      newSelectedTypes = [...selectedTypes, type];
    }
    setSelectedTypes(newSelectedTypes);
    onSearch(search, newSelectedTypes);
  };

  return (
    <div className="search-container">
      {/* Champ de recherche */}
      <input
        value={search}
        onChange={handleSearchChange}
        type="text"
        placeholder="Rechercher un Pokémon"
        className="search-bar"
      />

      {/* Filtres par type (Checkboxes) */}
      <div className="type-filters">
        {typeList.map((type) => (
          <label key={type} className="type-checkbox">
            <input
              type="checkbox"
              value={type}
              checked={selectedTypes.includes(type)}
              onChange={() => handleTypeChange(type)}
            />
            {type}
          </label>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
