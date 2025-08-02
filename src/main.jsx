import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './router'; // Importe ton routeur
import './index.css'; // Garde l'import de ton CSS global

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRouter /> {/* Utilise ton composant routeur ici */}
  </React.StrictMode>
);