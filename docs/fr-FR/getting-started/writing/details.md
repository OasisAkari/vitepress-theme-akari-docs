---
tab: Détails
---

# Rédiger des pages : détails

## Règles de chemin {#path-rules}

VitePress décide où chaque page est servie grâce à la fonction `rewrites` que génère `akariContent` :

| Fichier source | Servi comme | Chemin |
| --- | --- | --- |
| `zh-CN/index.md` | `index.md` | `/` |
| `zh-CN/theme/layout/index.md` | `theme/layout.md` | `/theme/layout` |
| `zh-CN/styles/icons/using.md` | `styles/icons/using.md` | `/styles/icons/using` |
| `en-US/index.md` | `en-US/index.md` | `/en-US/` |
| `en-US/theme/i18n/index.md` | `en-US/theme/i18n.md` | `/en-US/theme/i18n` |
| `404.md` (hors des dossiers de langue) | Inchangé | Inchangé |

- Le nom du dossier de la langue racine disparaît du chemin. Les autres langues gardent le nom de leur dossier comme préfixe.
- Un fichier situé exactement à « langue/catégorie/article/index.md » est réécrit en « catégorie/article.md » : le chemin d'un article est donc le nom de son dossier, sans barre oblique finale. Les autres fichiers perdent seulement le nom du dossier de la langue racine.
- `cleanUrls` est activé : dans le résultat du build, `/theme/layout` correspond donc à `theme/layout.html`.

## Chemins relatifs

- **Liens** : VitePress produit les liens Markdown tels qu'ils sont écrits, et le navigateur les résout par rapport au chemin de la page. Le chemin d'un article est `/theme/layout`, pas `/theme/layout/` : `./sidebar` y pointe donc vers `/theme/sidebar`, pas vers un fichier du dossier de l'article. Écrivez donc les liens internes sous forme de chemins complets.
- **Images et ressources** : Vite importe les images comme des modules et les résout depuis l'emplacement du fichier source : `./image.png` pointe donc vers le fichier du dossier de l'article. Les petites images sont intégrées sous forme d'URL data ; les autres sont copiées dans le résultat avec un hash au moment du build.

## Génération de la navigation

La navigation de chaque langue est générée à partir de son dossier de langue, selon ces règles :

- **Catégories** : chaque dossier du dossier de langue est une catégorie. Elles suivent l'ordre des clés de `sidebar.categories` dans la configuration partagée, puis les clés qui n'apparaissent que dans la configuration de langue, puis les dossiers absents de `categories`, triés par nom. Une catégorie sans article n'est pas affichée. Le nom d'une catégorie est son `text`, ou à défaut le nom du dossier.
- **Articles** : chaque dossier d'un dossier de catégorie qui contient un `index.md`. Le nom est le `title` du frontmatter, puis le premier titre de niveau 1, puis le nom du dossier. Le tri compare d'abord `order` ; les articles sans `order` passent en dernier, et les égalités sont départagées par nom de dossier.
- **Page d'accueil** : le `index.md` du dossier de langue n'est pas dans la navigation par défaut. Avec `category`, elle rejoint cette catégorie ; sans `order`, elle passe en premier dans la catégorie.
- **Pages parallèles** : chaque entrée de `parallel` crée un onglet, dans l'ordre, et l'article lui-même est le premier onglet. L'élément n'a pas de lien propre dans la navigation ; le premier onglet le représente. Les pages parallèles n'apparaissent pas seules dans la navigation.
- **Recherche du titre de niveau 1** : les blocs de code délimités sont ignorés, la première ligne qui commence par `# ` est retenue, et sa syntaxe Markdown est retirée.

La navigation générée a la même structure qu'un `sidebar.items` écrit à la main (`AkariSidebarItem`) : le dépliage, la mise en évidence, la pagination et les colonnes de liens du pied de page se comportent donc exactement de la même façon.

## Avertissements

Pendant la génération de la navigation, le terminal affiche un avertissement dans les cas suivants. Chaque avertissement n'apparaît qu'une fois.

- Un fichier listé dans `parallel` n'existe pas, ou n'est pas un nom de fichier du dossier de l'article (par exemple, un chemin a été écrit). L'entrée est ignorée.
- Une page n'est pas dans la structure de navigation : un `.md` placé directement dans un dossier de catégorie, un fichier imbriqué plus profondément, ou un fichier qu'aucun article ne liste comme page parallèle. Ces fichiers deviennent quand même des pages ; ils n'apparaissent simplement pas dans la navigation.
- Le dossier nommé par `rootLanguage` n'est pas un dossier de langue.

## Pages correspondantes

Quand vous changez de langue, le thème transpose le chemin actuel dans la langue cible (`/theme/i18n` ↔ `/en-US/theme/i18n`). Si la navigation de la langue cible contient ce chemin, le thème l'ouvre ; sinon, il ouvre la page d'accueil de la langue cible. Changer de langue reste donc sur la même page quand les deux pages ont le même chemin dans leurs dossiers de langue et que la page cible figure dans la navigation de la langue cible.

## Index de recherche

VitePress construit l'index de recherche local : ses liens sont donc les chemins réels des pages (après les réécritures ci-dessus). Il y a un index par langue. Chaque page est découpée en sections à ses titres ; la partie sous le titre de niveau 1 représente la page elle-même, et les pages parallèles sont des pages à part entière.
