import React from 'react'
import { Keyboard } from "lucide-react"; // icône clavier


const NavBar = () => {
    return (
        <nav className="w-full bg-black text-white px-6 py-3 flex items-center justify-between border-b border-gray-800æ">
          {/* Conteneur pour le logo, le nom et les liens */}
          <div className="flex items-center space-x-6">
            {/* Logo + Nom */}
            <div className="flex items-center space-x-2 ml-30">
              <Keyboard className="w-6 h-6 text-white" />
              <span className="text-lg font-bold">TypingFastGame</span>
            </div>
            {/* Liens */}
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-300 hover:text-white">Play</a>
              <a href="#" className="text-gray-300 hover:text-white">Leaderboard</a>
              <a href="#" className="text-gray-300 hover:text-white">Profile</a>
            </div>
          </div>
    
          {/* Bouton Sign In */}
          <button className="px-4 py-2 bg-white text-black rounded-md font-medium hover:bg-gray-200 mr-30">
            Sign In
          </button>
        </nav>
      );
}

export default NavBar
