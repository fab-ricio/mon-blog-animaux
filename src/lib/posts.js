// Les modules Node.js 'fs' et 'path' ne sont pas utilisés directement côté client.
// import fs from "fs";
// import path from "path";

// Nous utilisons 'front-matter' car il est compatible avec les navigateurs
// et ne dépend pas de modules Node.js comme 'Buffer'.
import fm from "front-matter";

// Ces modules sont pour la conversion du Markdown en HTML, et sont compatibles navigateur.
import { remark } from "remark";
import html from "remark-html";

// Cette fonctionnalité de Vite permet de charger le contenu de tous les fichiers Markdown
// du dossier '/posts' directement dans le bundle JavaScript sous forme de chaînes de caractères brutes.
const postsImports = import.meta.glob("/posts/*.md", {
  as: "raw", // Importe le contenu du fichier comme une chaîne de caractères brute.
  eager: true, // Charge tous les modules immédiatement au lieu de lazy-loading.
});

export function getSortedPostsData() {
  const allPostsData = [];

  for (const filePath in postsImports) {
    const fileContents = postsImports[filePath];

    // Extrait le slug (nom du fichier sans l'extension) du chemin.
    // Exemple : "/posts/mon-article.md" -> "mon-article"
    const slug = filePath.split("/").pop().replace(/\.md$/, "");

    // Utilise 'front-matter' pour parser le contenu du fichier.
    // 'fm' retourne un objet avec 'attributes' (le front matter) et 'body' (le contenu Markdown).
    const content = fm(fileContents);

    // Combine les données extraites avec le slug.
    allPostsData.push({
      slug,
      ...content.attributes, // Les métadonnées (title, date, author, etc.)
    });
  }

  // Trie les posts par date du plus récent au plus ancien.
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostSlugs() {
  const slugs = [];
  for (const filePath in postsImports) {
    // Extrait le slug de la même manière.
    const slug = filePath.split("/").pop().replace(/\.md$/, "");
    slugs.push(slug);
  }
  return slugs;
}

export async function getPostData(slug) {
  // Construit le chemin normalisé pour accéder au contenu du fichier via 'postsImports'.
  const filePathNormalized = `/posts/${slug}.md`;
  const fileContents = postsImports[filePathNormalized];

  if (!fileContents) {
    // Si le fichier n'est pas trouvé, lève une erreur.
    throw new Error(`Article with slug "${slug}" not found.`);
  }

  // Utilise 'front-matter' pour parser le contenu du fichier spécifique.
  const content = fm(fileContents);

  // Convertit le contenu Markdown (content.body) en chaîne HTML.
  const processedContent = await remark().use(html).process(content.body); // Utilise content.body pour le Markdown
  const contentHtml = processedContent.toString();

  // Retourne toutes les données nécessaires pour afficher l'article.
  return {
    slug,
    contentHtml,
    ...content.attributes, // Les métadonnées de l'article
  };
}
