import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostData } from '../lib/posts';
import { Container, Card, Button } from 'react-bootstrap'; // Importe les composants Bootstrap

function PostPage() {
  const { slug } = useParams();
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPost() {
      try {
        const data = await getPostData(slug);
        setPostData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement de l\'article.');
        setLoading(false);
      }
    }

    loadPost();
  }, [slug]);

  if (loading) {
    return <Container className="text-center py-5">Chargement de l'article...</Container>;
  }

  if (error) {
    return <Container className="text-center py-5 text-danger">Erreur : {error}</Container>;
  }

  if (!postData) {
    return <Container className="text-center py-5">Article non trouvé.</Container>;
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">{postData.title}</h1>
      <p className="text-muted mb-4">
        Par {postData.author} le {postData.date}
      </p>
      {postData.image && (
        <img
          src={`${import.meta.env.BASE_URL}${postData.image.startsWith('/') ? postData.image.slice(1) : postData.image}`}
          alt={postData.title}
          className="img-fluid rounded mb-4" // img-fluid pour la responsivité
          style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
        />
      )}
      <Card className="shadow-sm">
        <Card.Body>
          {/* Le contenu HTML du Markdown. Pas de plugin 'typography' nécessaire ici,
              Bootstrap stylisera les éléments HTML de base. */}
          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </Card.Body>
      </Card>

      <div className="text-center mt-5">
        <Link to="/">
          <Button variant="secondary">&larr; Retour à la liste des articles</Button>
        </Link>
      </div>
    </Container>
  );
}

export default PostPage;