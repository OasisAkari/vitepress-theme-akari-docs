---
title: Icônes
hero:
  image: /hero/icons-hero.svg
  alt: Des icônes sur une série de carrés arrondis, et des traits du plus fin au plus épais
  tagline: Le thème utilise les icônes Material Symbols, enregistrées à la demande, sans police d'icônes ni CDN.
  fit: contain
order: 2
tab: Vue d'ensemble
parallel:
  - choosing
  - using
---

# Icônes

Toutes les icônes du thème sont des [Material Symbols](https://fonts.google.com/icons). `@m3e/icons` les fournit sous forme de tracés SVG, et `<m3e-icon>` les affiche. [Choisir les icônes](/fr-FR/styles/icons/choosing) traite des styles, du remplissage et de la taille ; [Utiliser les icônes](/fr-FR/styles/icons/using) traite de l'enregistrement et des exigences d'accessibilité.

<div class="demo-row">
  <m3e-icon name="home"></m3e-icon>
  <m3e-icon name="search"></m3e-icon>
  <m3e-icon name="settings"></m3e-icon>
  <m3e-icon name="palette"></m3e-icon>
  <m3e-icon name="translate"></m3e-icon>
  <m3e-icon name="schedule"></m3e-icon>
  <m3e-icon name="dark_mode"></m3e-icon>
  <m3e-icon name="light_mode"></m3e-icon>
</div>

## Caractéristiques

- **Enregistrées à la demande** : chaque icône est un module distinct. Seules les icônes importées dans `icons.ts` se retrouvent dans le résultat du build : le poids du premier écran ne dépend donc pas du nombre total d'icônes.
- **Aucun réseau nécessaire** : les icônes sont installées avec `@m3e/icons` et s'affichent en SVG inline. Il n'y a pas de fichiers de police, ni de texte affiché brièvement avant le chargement d'une police d'icônes.
- **Elles suivent le thème** : les icônes utilisent `currentColor` ; elles prennent donc leur couleur dans le rôle de couleur M3 du composant qui les contient, et suivent automatiquement les changements de mode clair ou sombre, de contraste et de couleur dynamique.
- **Contour et plein** : chaque icône a une forme pleine, et l'attribut `filled` permet de passer de l'une à l'autre. L'élément sélectionné de la navigation l'utilise pour marquer l'emplacement actuel.

## Icônes du thème

| Emplacement | Source de l'icône | Remarques |
| --- | --- | --- |
| Rail de navigation et tiroir de navigation mobile | L'`icon` de chaque catégorie dans `sidebar.categories` de la configuration partagée | `category` par défaut ; la catégorie actuelle affiche la forme pleine |
| Barre d'application | Intégrées au thème | Menu, recherche, « Plus », paramètres et liens sociaux |
| Boutons d'action flottants | Intégrées au thème | « Haut de page » utilise `keyboard_arrow_up` ; la table des matières utilise `format_list_bulleted` |
| Bas du rail | Intégrées au thème | L'icône du bouton d'apparence change avec le mode ; le bouton de langue utilise `translate` |
| Corps de l'article | `<m3e-icon>` dans le Markdown | Doivent d'abord être enregistrées dans `icons.ts` |

## Pages de ce groupe

Ces trois pages forment un ensemble de pages parallèles : elles apparaissent comme un seul élément « Icônes » dans la barre latérale, et la barre d'onglets en haut de la page permet de passer de l'une à l'autre. Ce sont `index.md`, `choosing.md` et `using.md` dans le dossier `styles/icons/`. Pour écrire des pages de ce type, voir [Rédiger des pages](/fr-FR/getting-started/writing#parallel-pages).
