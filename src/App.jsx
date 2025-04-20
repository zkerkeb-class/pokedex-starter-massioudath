//  Ancien code commenté (affichage statique des Pokémon)
/*
import React, { useEffect, useState } from "react";

import "./App.css";
import squirtleImage from "./assets/pokemons/7.png";
import pokemons from './assets/pokemons';
import PokemonCard from "./components/pokemonCard";
import SearchBar from "./components/searchBar";

// function App() {
//     // États pour la recherche et les types sélectionnés
//     const [search, setSearch] = useState("");
//     const [selectedTypes, setSelectedTypes] = useState([]);

//     // Fonction pour mettre à jour la recherche et les filtres
//     const handleSearch = (searchTerm, typeFilters) => {
//         setSearch(searchTerm);
//         setSelectedTypes(typeFilters);
//     };

//     // Filtrage des Pokémon
//     const filteredPokemons = pokemons.filter((pokemon) => {
//         const matchesSearch = pokemon.name.french.toLowerCase().includes(search.toLowerCase());
//         const matchesType = selectedTypes.length === 0 || selectedTypes.some(type => pokemon.type.includes(type));
//         return matchesSearch && matchesType;
//     });

//     return (
//         <div className="app-container">
//             <h1>Pokédex</h1>
//             <SearchBar onSearch={handleSearch} />

//             <div className="pokemon-list">
//                 {filteredPokemons.map((pokemon) => (
//                     <div key={pokemon.id} className="pokemon-card-container">
//                         <PokemonCard 
//                             name={pokemon.name.french} 
//                             tabDeTypes={pokemon.type} 
//                             image={pokemon.image}
//                             attack={pokemon.base.Attack}
//                             defense={pokemon.base.Defense}
//                             hp={pokemon.base.HP}
//                         />
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }
*/

//////////////////////////////////////////////////////////////////
// ✅ Nouveau code : Utilisation de React Router pour la navigation
//////////////////////////////////////////////////////////////////

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage'; // Page d'accueil
import PokemonDetail from './components/PokemonDetail'; // Détail d’un Pokémon
import CreatePokemon from './components/CreatePokemon'; // Création d’un Pokémon
import EditPokemon from './components/EditPokemon'; // Modification d’un Pokémon

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Page d'accueil */}
        <Route path="/pokemon/:id" element={<PokemonDetail />} /> {/* Page de détail */}
        <Route path="/create" element={<CreatePokemon />} /> {/* Formulaire de création */}
        <Route path="/edit/:id" element={<EditPokemon />} /> {/* Formulaire d’édition */}
        
        
        
      </Routes>
    </Router>
  );
}

export default App;
