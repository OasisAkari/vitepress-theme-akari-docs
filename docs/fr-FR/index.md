---
title: Vue d'ensemble
toc: false
category: getting-started
icon: home
---

# Vue d'ensemble

Vitepress Theme Akari Docs est un thème de documentation construit avec VitePress et `@m3e/web`.

<div class="demo-row">
  <m3e-button id="overview-demo-button" variant="filled">
    <m3e-icon slot="icon" name="rocket_launch"></m3e-icon>
    Commencer
  </m3e-button>
  <m3e-button variant="outlined" href="/fr-FR/getting-started/installation">Guide d'installation</m3e-button>
  <m3e-chip>
    <m3e-icon slot="icon" name="check"></m3e-icon>
    Thème prêt
  </m3e-chip>
  <m3e-chip variant="elevated">
    <m3e-icon slot="icon" name="layers"></m3e-icon>
    Web Components
  </m3e-chip>
  <m3e-badge size="large">v1.0.0</m3e-badge>
  <m3e-badge for="overview-demo-button" position="above-after">6</m3e-badge>
</div>

## Fonctionnalités

<div class="demo-grid">
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">Material 3 Expressive</m3e-heading>
    <div slot="content">Couleurs, formes, animations et typographie proviennent toutes des tokens de design m3e et correspondent au Material 3 officiel.</div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">Organisé par dossiers</m3e-heading>
    <div slot="content">Dans un dossier de langue, les dossiers sont des catégories et les dossiers qu'ils contiennent sont des articles. La navigation et la liste des langues sont construites à partir des dossiers et du frontmatter.</div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">Pages parallèles et hero</m3e-heading>
    <div slot="content">Un article peut être divisé en plusieurs pages, que l'on parcourt avec une barre d'onglets. Une page avec un hero prend ses couleurs dans l'image.</div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">Paramètres et apparence</m3e-heading>
    <div slot="content">Quatre options pour le mode clair et le mode sombre. La couleur, la variante, le contraste, les animations, le sens du texte et la taille du texte s'appliquent immédiatement et sont enregistrés dans le navigateur utilisé.</div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">Recherche et multilingue</m3e-heading>
    <div slot="content">L'index local fonctionne sans configuration, et vous pouvez le remplacer par un backend HTTP ou personnalisé. Changer de langue vous garde sur la page correspondante.</div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">Remplaçable et extensible</m3e-heading>
    <div slot="content">Remplacez des composants comme la barre d'application, la table des matières et le pied de page, ou redéfinissez des variables CSS pour ajuster l'apparence.</div>
  </m3e-card>
</div>

## Démarrage rapide

```bash
npm install
npm run dev
```

À lire ensuite :

- [Installation](/fr-FR/getting-started/installation) : créer un dépôt depuis le modèle, prérequis et déploiement.
- [Configuration](/fr-FR/getting-started/configuration) : configuration partagée et configuration de langue.
- [Rédiger des pages](/fr-FR/getting-started/writing) : nouveaux articles, frontmatter et Markdown.
- [Mise en page et barre d'application](/fr-FR/theme/layout), [Navigation latérale](/fr-FR/theme/sidebar) : les éléments de l'interface du thème.

Ce site existe en chinois, anglais, japonais, coréen, français et arabe. Changez de langue avec le bouton de langue en bas du rail de navigation.
