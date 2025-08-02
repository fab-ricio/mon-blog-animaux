import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

// IMPORTANT : Dans un environnement client-side comme Vite,
// tu ne peux PAS lire les fichiers directement avec 'fs'
// car le code s'exécute dans le navigateur.
// Pour un blog avec des fichiers Markdown, la meilleure approche pour Vite est de :
// 1. Charger les fichiers Markdown via un build step (par exemple, avec un plugin Vite)
// 2. Ou, plus simplement pour commencer, charger les données de manière 'statique'
//    en utilisant des chemins relatifs et en les incluant directement dans le bundle JS.

// Pour cette étape, nous allons simuler la lecture en important directement les fichiers.
// C'est une méthode courante et simple avec Vite pour les petits blogs statiques.

// Nous allons utiliser un import.meta.glob pour charger les fichiers Markdown
// C'est une fonctionnalité spécifique à Vite pour importer des modules en masse.
const postsImports = import.meta.glob("/posts/*.md", {
  as: "raw",
  eager: true,
});

export function getSortedPostsData() {
  const allPostsData = [];

  for (const filePath in postsImports) {
    const fileContents = postsImports[filePath];
    // Extraire le slug (nom du fichier sans l'extension)
    const slug = path.basename(filePath, ".md");

    // Utiliser gray-matter pour parser la section des métadonnées (front-matter)
    const matterResult = matter(fileContents);

    // Combiner les données avec le slug
    allPostsData.push({
      slug,
      ...matterResult.data, // Contient title, date, author, etc.
    });
  }

  // Trier les posts par date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

// Cette fonction ne sert pas directement à générer des paths comme avec Next.js,
// mais elle peut être utile pour lister tous les slugs disponibles.
export function getAllPostSlugs() {
  const slugs = [];
  for (const filePath in postsImports) {
    const slug = path.basename(filePath, ".md");
    slugs.push(slug);
  }
  return slugs;
}

export async function getPostData(slug) {
  const filePath = `/posts/${slug}.md`;
  const fileContents = postsImports[filePath];

  if (!fileContents) {
    throw new Error(`Article with slug "${slug}" not found.`);
  }

  // Utiliser gray-matter pour parser la section des métadonnées
  const matterResult = matter(fileContents);

  // Utiliser remark pour convertir le markdown en chaîne HTML
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combiner les données et le contenu HTML
  return {
    slug,
    contentHtml,
    ...matterResult.data,
  };
}
