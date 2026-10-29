---
icon: search
order: 5
tab: Vue d'ensemble
parallel:
  - api
  - details
---

# Recherche

La recherche se trouve à droite de la barre d'application. Sur grand écran, c'est un champ de recherche avec un texte indicatif et un rappel du raccourci ; sur écran étroit, elle se réduit à un bouton rond. Cliquez dessus ou appuyez sur `⌘K` (`Ctrl K` sous Windows et Linux), et le champ de recherche se déploie en panneau de recherche.

## Utilisation

| Touche | Action |
| --- | --- |
| `⌘K` / `Ctrl K` | Ouvrir la recherche depuis n'importe quelle page |
| `↑` / `↓` | Passer d'un résultat à l'autre |
| `Enter` | Ouvrir le résultat courant |
| `Esc` | Fermer la recherche |

Les résultats sont listés par page et par section, chacun avec un extrait de la correspondance. Ouvrir le résultat d'une section fait défiler la page jusqu'à son titre. Sur un site multilingue, seules les pages de la langue courante sont renvoyées.

## Index local

Par défaut, aucun backend n'est nécessaire. Le thème utilise l'index que construit la recherche locale de VitePress, un par langue, téléchargé seulement à la première recherche dans cette langue. Les pages sont découpées en sections à leurs titres, et [MiniSearch](https://lucaong.github.io/minisearch/) fait la correspondance : le chinois et le japonais sont découpés en mots, un mot peut n'être saisi qu'en partie, et les mots plus longs tolèrent une faute de frappe ou deux. Tant que le serveur de développement tourne, l'index suit vos modifications.

## Utiliser une autre recherche

Si vous avez besoin de recherche sémantique ou de contenu extérieur au site, passez à un endpoint HTTP ou à une fonction JS de votre choix :

```ts
// docs/config.ts
search: {
  backend: { type: "http", endpoint: "/api/docs/search" },
},
```

Voir l'[API](/fr-FR/theme/search/api) pour écrire un backend et pour le format des résultats, et les [Détails](/fr-FR/theme/search/details) pour l'animation du panneau, ainsi que la construction et le classement de l'index.
