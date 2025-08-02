import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import PostPage from '../pages/PostPage';

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Route pour la page d'accueil */}
        <Route path="/" element={<HomePage />} />
        {/* Route pour les pages d'articles dynamiques, :slug est un paramètre */}
        <Route path="/posts/:slug" element={<PostPage />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;