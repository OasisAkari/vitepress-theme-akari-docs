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

Par défaut, aucun backend n'est nécessaire. Pendant le développement et les builds, le thème parcourt chaque page Markdown et écrit `docs/public/search-index.json` : une entrée par page, plus une pour chaque titre de niveau 2 et de niveau 3. L'index n'est pas versionné dans le dépôt ; `npm run dev` et `npm run build` le régénèrent automatiquement.

## Utiliser une autre recherche

Si vous avez besoin de correction orthographique, de recherche sémantique ou de contenu extérieur au site, passez à un endpoint HTTP ou à une fonction JS de votre choix :

```ts
// docs/config.ts
search: {
  backend: { type: "http", endpoint: "/api/docs/search" },
},
```

Voir l'[API](/fr-FR/theme/search/api) pour écrire un backend et pour le format des résultats, et les [Détails](/fr-FR/theme/search/details) pour l'animation du panneau, ainsi que la construction et le classement de l'index.
