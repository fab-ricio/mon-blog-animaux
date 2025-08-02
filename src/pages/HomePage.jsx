import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSortedPostsData } from '../lib/posts';

function HomePage() {
  const [allPostsData, setAllPostsData] = useState([]);

  useEffect(() => {
    // Nous appelons la fonction pour récupérer les données des articles
    // une fois que le composant est monté.
    const posts = getSortedPostsData();
    setAllPostsData(posts);
  }, []); // Le tableau vide signifie que cet effet ne s'exécute qu'une fois.

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Bienvenue sur mon Blog Animaux !</h1>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* On parcourt chaque article pour l'afficher */}
        {allPostsData.map(({ slug, date, title, excerpt, image }) => (
          <div key={slug} className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105">
            {/* Affichage de l'image si elle existe */}
            {image && (
              <img
                src={`${import.meta.env.BASE_URL}${image.startsWith('/') ? image.slice(1) : image}`}
                alt={title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2">
                {/* Lien vers la page de l'article */}
                <Link to={`/posts/${slug}`} className="text-blue-600 hover:underline">
                  {title}
                </Link>
              </h2>
              <p className="text-gray-600 text-sm mb-4">{date}</p>
              <p className="text-gray-700">{excerpt}</p>
              <Link to={`/posts/${slug}`} className="mt-4 inline-block text-blue-500 hover:underline font-medium">
                Lire la suite &rarr;
              </Link>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default HomePage;