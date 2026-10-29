---
icon: translate
order: 6
tab: Vue d'ensemble
parallel:
  - api
  - details
---

# Internationalisation

Chaque langue est un dossier de `docs` nommé d'après son code de langue, comme `zh-CN` ou `en-US`. La langue racine est servie à la racine du site ; les chemins des autres langues commencent par le nom de leur dossier. La langue de la page courante détermine les textes de l'interface, la navigation, le pied de page et la portée de la recherche.

## Ajouter une langue

1. Créez dans `docs` un dossier nommé d'après le code de langue, et écrivez-y un `config.ts` :

   ```ts
   // docs/fr-FR/config.ts
   import { defineAkariConfig } from "../.vitepress/theme/define.ts";

   export default defineAkariConfig({
     label: "Français",
     title: "Vitepress Theme Akari Docs",
     appBar: { title: "Vitepress Theme Akari Docs" },
     sidebar: {
       categories: {
         "getting-started": { text: "Premiers pas" },
         theme: { text: "Thème" },
       },
     },
     footer: { message: "Conçu avec VitePress et M3E Web Components" },
   });
   ```

2. Ajoutez des pages avec la même structure que la langue racine : `docs/fr-FR/index.md` est la page d'accueil de cette langue, et `docs/fr-FR/getting-started/installation/index.md` correspond à la page chinoise `/getting-started/installation`.
3. Si besoin, définissez `rootLanguage` dans la configuration partagée pour choisir la langue servie à la racine.

Une configuration de langue s'applique par-dessus la configuration partagée : elle n'a besoin que du nom de la langue, de ses titres et des noms de catégories. La version, les liens sociaux, les icônes des catégories, etc. viennent de la configuration partagée. Une langue qui s'écrit de droite à gauche (arabe, hébreu, etc.) définit aussi `dir: "rtl"` dans sa configuration de langue.

## Changer de langue

Quand le site a deux langues ou plus, un bouton de langue apparaît en bas du rail (en bas du tiroir de navigation sur écran étroit). Un clic dessus ouvre la boîte de dialogue « Choisir une langue ».

- Si la langue cible a une page correspondante, vous restez sur cette page ; sinon, vous arrivez sur sa page d'accueil. Une langue qui ne traduit qu'une partie des pages n'envoie donc jamais les lecteurs vers une erreur 404.
- Le logo, le nom du site dans le pied de page et « Retour à l'accueil » sur la page 404 pointent tous vers la page d'accueil de la langue courante.

## Textes de l'interface

Le thème intègre des textes en chinois simplifié, anglais, japonais, coréen, français et arabe pour les boutons, la table des matières, la pagination, les paramètres et la recherche, choisis d'après le code de langue. Les autres langues utilisent l'anglais, et vous pouvez compléter leurs textes avec `messages` dans la configuration de langue :

```ts
// docs/de-DE/config.ts
export default defineAkariConfig({
  label: "Deutsch",
  messages: {
    tocOverline: "Auf dieser Seite",
    previousPage: "Zurück",
    nextPage: "Weiter",
    searchPlaceholder: "Suchen",
  },
});
```

## Langues de ce site

Ce site propose six versions de chaque page : chinois (servi à la racine), anglais, japonais, coréen, français et arabe. Changer de langue vous garde sur la même page. La version arabe est mise en page de droite à gauche : vous pouvez vous en servir pour voir la mise en page RTL du thème.

Voir l'[API](/fr-FR/theme/i18n/api) pour tous les textes de l'interface et les fonctions de langue, et les [Détails](/fr-FR/theme/i18n/details) pour la façon dont les langues sont détectées et changées.
