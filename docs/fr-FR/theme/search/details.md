---
tab: Détails
---

# Recherche : détails

## Transformation de conteneur {#container-transform}

Le panneau de recherche est un `<dialog>` modal natif. Il se déploie avec une transformation de conteneur M3 construite sur la Web Animations API. Le sélecteur de langue et la boîte de dialogue des paramètres utilisent la même implémentation (`useContainerTransform`).

- Ce qui s'anime est toujours le vrai panneau, mis en page à sa taille finale dès la première image. Au départ, une fenêtre en forme de bouton (une capsule `clip-path`) ne laisse voir que le début de la barre de recherche du panneau, et une translation place cette fenêtre au-dessus du bouton. La première image ressemble donc toujours au champ de recherche « icône + texte indicatif ».
- Pendant le déploiement, la translation revient à zéro et la fenêtre s'agrandit jusqu'au panneau entier (ombre comprise). Le contenu se révèle progressivement, la zone des résultats et le bouton de fermeture apparaissent ensemble en fondu, et aucune surface vide n'apparaît en cours de route. L'état final de l'animation est le style au repos du panneau : retirer l'animation ne provoque donc aucun saut.
- Une copie en pixels du bouton se place sur la fenêtre et se déplace avec elle. Les contenus du bouton et du panneau ne se fondent pas l'un dans l'autre : l'un disparaît avant que l'autre n'apparaisse (fade through M3). À l'ouverture, la surface du panneau apparaît d'abord en fondu sous la copie, puis la copie disparaît, puis la barre de recherche du panneau apparaît. Deux textes de tailles différentes ne s'affichent jamais en même temps.
- À la fermeture, le panneau repart par le même chemin : la zone des résultats et la barre de recherche disparaissent d'abord, la copie du bouton réapparaît à mi-parcours pour prendre le relais, puis la surface du panneau disparaît en dessous. Dans la dernière portion du retour vers le bouton, rebond de l'animation expressive compris, ce que vous voyez est le bouton lui-même, et l'animation se termine exactement comme le vrai bouton. Un bouton sans fond (comme le bouton en forme d'engrenage) ne fait donc pas apparaître une tache de fond à la fin. Si l'ouverture ou la fermeture est interrompue, le mouvement repart en sens inverse depuis l'image courante.
- La taille et le rayon des coins de la fenêtre viennent de la position et de la taille actuelles du bouton. La position du panneau est de nouveau mesurée au début de l'animation ; rien ne dépend de coordonnées fixes.

| Animations | Déploiement | Repli |
| --- | --- | --- |
| Standard | Environ 300ms, `cubic-bezier(0.2, 0, 0, 1)` | Environ 250ms, sans rebond |
| Expressif | Environ 500ms, `cubic-bezier(0.38, 1.21, 0.22, 1)`, dépasse légèrement puis se stabilise | Environ 400ms, même courbe, avec un léger rebond au repli |

Quand l'option « réduire les animations » du système est activée, le panneau s'ouvre et se ferme sans animation. La boîte de dialogue native fournit l'affichage dans la couche supérieure (top layer), un arrière-plan inerte et la fermeture avec `Esc`. À l'ouverture, le focus passe dans le champ de saisie ; à la fermeture, il revient là où il était avant l'ouverture, ou sur le bouton de recherche si cet élément n'est plus disponible.

## Construction de l'index

- Un plugin Vite parcourt chaque fichier `.md` de `docs` (sauf dans `.vitepress`, `public` et les répertoires qui commencent par `.`) au démarrage du serveur de développement et au début d'un build, et écrit `docs/public/search-index.json`. Pendant le développement, il régénère l'index environ 150ms après l'ajout, la modification ou la suppression d'un fichier Markdown. À la fin du build, il copie le fichier à la racine de la sortie.
- Les URL des pages sont calculées par `content.route` : elles correspondent donc aux vraies URL des pages.
- Le titre de la page est le `title` du frontmatter, à défaut le premier titre de niveau 1, à défaut le nom du fichier.
- Chaque titre de niveau 2 et de niveau 3 produit une entrée de section. Son ancre correspond à l'id de titre que génère VitePress.
- Les blocs de code délimités sont exclus de l'index. Les balises HTML, les URL des liens et la syntaxe Markdown sont retirées pour ne garder que le texte. Le texte de chaque entrée fait au plus 4 000 caractères.

## Correspondance et classement

La requête est d'abord normalisée (casse, formes pleine chasse et demi-chasse, etc.), puis découpée en mots selon les espaces. Une entrée ne correspond que si chaque mot apparaît dans son titre, dans le titre de sa page ou dans son texte. Son score s'additionne comme suit, où « titre » désigne le titre propre de l'entrée : le titre de la page pour une entrée de page, le titre de section pour une entrée de section :

| Condition | Score |
| --- | --- |
| Le titre est exactement la requête entière | +100 |
| Le titre commence par la requête entière | +60 |
| Le titre contient la requête entière | +40 |
| Le titre de la page contient la requête entière | +20 |
| Le texte contient la requête entière | +10 |
| Chaque mot : dans le titre / le titre de la page / le texte | +24 / +10 / +6 |
| Niveau de l'entrée : page / titre de niveau 2 / titre de niveau 3 | +3 / +2 / +1 |

Les résultats sont triés par score décroissant, puis par titre à score égal. Un seul résultat est conservé par URL, et `maxResults` au plus sont renvoyés. Sur un site multilingue, l'index local contient les pages de toutes les langues, et seules les entrées situées sous le chemin de la langue courante sont conservées (la langue racine n'inclut pas les pages sous `/<dossier de langue>/`).

## Chargement et cache

- L'index local se charge à la première recherche, puis il est mis en cache dans la page. En mode développement, le cache du navigateur n'est pas utilisé : le contenu modifié est donc trouvable tout de suite.
- La saisie est soumise à un anti-rebond de `debounce`. Quand une nouvelle requête est saisie ou que le panneau se ferme, la requête en cours est interrompue au moyen d'`AbortSignal`.
- Si le fichier d'index est absent ou mal formé, le panneau affiche une erreur et un bouton pour réessayer.

## États du panneau

| État | Affichage |
| --- | --- |
| Saisie vide | Indication de recherche et aide sur le raccourci |
| Chargement | Indicateur de chargement M3 |
| Résultats | Titre de la page, titre de section, extrait et correspondances mises en évidence ; l'élément courant a un fond `secondary-container` |
| Aucun résultat | Une suggestion d'essayer un autre mot-clé |
| Échec | La cause de l'erreur et un bouton pour réessayer |

Ouvrir un résultat passe par le routeur de VitePress, ce qui conserve la navigation SPA. Le champ de saisie, la liste des résultats et le message d'erreur ont chacun un nom ARIA. Le rappel du raccourci dans la barre d'application utilise le style typographique `label-small` et des touches entièrement arrondies ; les indications des flèches, de `Enter` et de `Esc` dans le panneau utilisent des coins `shape-extra-small`.

## Limites connues

- L'index local utilise une simple recherche de sous-chaînes, sans correction orthographique ni recherche sémantique. Si vous en avez besoin, utilisez un backend HTTP ou un backend enregistré.
- L'index local n'est actualisé que pendant que le serveur de développement tourne ou pendant un build. Le Markdown modifié alors que le serveur de développement est arrêté devient trouvable après le prochain `npm run dev` ou `npm run build`.
