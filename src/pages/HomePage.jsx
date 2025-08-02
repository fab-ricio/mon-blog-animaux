import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSortedPostsData } from '../lib/posts';
import { Container, Row, Col, Card, Button } from 'react-bootstrap'; // Importe les composants Bootstrap

function HomePage() {
  const [allPostsData, setAllPostsData] = useState([]);

  useEffect(() => {
    const posts = getSortedPostsData();
    setAllPostsData(posts);
  }, []);

  return (
    <Container className="py-5"> {/* Utilisation du Container Bootstrap */}
      <h1 className="text-center mb-5">Bienvenue sur mon Blog Animaux !</h1>

      <Row className="g-4"> {/* Utilisation de Row et g-4 (gap) pour la grille */}
        {allPostsData.map(({ slug, date, title, excerpt, image }) => (
          <Col md={6} lg={4} key={slug}> {/* Col pour la responsivité */}
            <Card className="h-100 shadow-sm"> {/* Card Bootstrap */}
              {image && (
                <Card.Img
                  variant="top"
                  src={`${import.meta.env.BASE_URL}${image.startsWith('/') ? image.slice(1) : image}`}
                  alt={title}
                  style={{ height: '200px', objectFit: 'cover' }} // Styles inline ou CSS personnalisé
                />
              )}
              <Card.Body className="d-flex flex-column">
                <Card.Title>{title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{date}</Card.Subtitle>
                <Card.Text className="flex-grow-1">{excerpt}</Card.Text>
                <Link to={`/posts/${slug}`}>
                  <Button variant="primary" className="mt-auto"> {/* Button Bootstrap */}
                    Lire la suite &rarr;
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default HomePage;