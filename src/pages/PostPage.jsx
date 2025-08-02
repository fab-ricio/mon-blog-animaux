import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostData } from '../lib/posts';

function PostPage() {
  // `useParams` permet de récupérer les paramètres de l'URL, ici le `slug`
  const { slug } = useParams();
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPost() {
      try {
        // On appelle la fonction pour obtenir les données de l'article par son slug
        const data = await getPostData(slug);
        setPostData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement de l\'article.');
        setLoading(false);
      }
    }

    loadPost();
  }, [slug]); // L'effet se ré-exécute si le slug change

  if (loading) {
    return <div className="text-center py-8">Chargement de l'article...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Erreur : {error}</div>;
  }

  if (!postData) {
    return <div className="text-center py-8">Article non trouvé.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-4">{postData.title}</h1>
      <p className="text-gray-600 text-sm mb-6">
        Par {postData.author} le {postData.date}
      </p>
      {postData.image && (
        <img
          src={`${import.meta.env.BASE_URL}${postData.image.startsWith('/') ? postData.image.slice(1) : postData.image}`}
          alt={postData.title}
          className="w-full h-64 object-cover mb-6 rounded-md"
        />
      )}
      <article className="bg-white p-8 rounded-lg shadow-md">
        {/* On insère le HTML généré à partir du Markdown */}
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} className="prose lg:prose-lg max-w-none">
          {/* Le contenu HTML de ton Markdown sera injecté ici */}
        </div>
      </article>

      <div className="mt-8 text-center">
        <Link to="/" className="text-blue-500 hover:underline text-lg">
          &larr; Retour à la liste des articles
        </Link>
      </div>
    </div>
  );
}

export default PostPage;