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
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import PokemonDetail from './components/PokemonDetail';
import CreatePokemon from './components/CreatePokemon';
import EditPokemon from './components/EditPokemon';
import LoginUser from './components/LoginUser';
import RegisterUser from './components/RegisterUser';


/**
 * Composant principal de l'application.
 *
 * - Définit toutes les routes de l'application.
 * - Gère la protection des routes : certaines pages nécessitent un utilisateur connecté (token valide).
 * - Redirige automatiquement vers la page de connexion si l'utilisateur n'est pas authentifié.
 *
 * @component
 */


function App() {
  const token = localStorage.getItem('token'); // 📦 On récupère le token


  /**
 * Si `token` est présent dans localStorage :
 *    - Accès autorisé à HomePage, PokemonDetail, CreatePokemon, EditPokemon.
 * Sinon :
 *    - Redirection automatique vers la page de connexion (/login).
 */

  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={<LoginUser />} />
        <Route path="/register" element={<RegisterUser />} />

        {/* Routes protégées */}
        <Route path="/" element={token ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/pokemon/:id" element={token ? <PokemonDetail /> : <Navigate to="/login" />} />
        <Route path="/create" element={token ? <CreatePokemon /> : <Navigate to="/login" />} />
        <Route path="/edit/:id" element={token ? <EditPokemon /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
