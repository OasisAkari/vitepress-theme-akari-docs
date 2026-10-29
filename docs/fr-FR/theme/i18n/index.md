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

Ce qui appartient à la langue elle-même (ses textes d'interface, ses polices, son sens du texte et ses textes dans le Markdown) ne s'écrit pas dans la configuration du site. Cela se trouve dans un [pack de langue](#language-packs), choisi d'après le code de langue. Ajouter une langue ne demande donc que ce qui est propre à ce site.

## Ajouter une langue

1. Créez dans `docs` un dossier nommé d'après le code de langue, et écrivez-y un `config.ts` :

   ```ts
   // docs/fr-FR/config.ts
   import { defineAkariConfig } from "../.vitepress/theme/define.ts";

   export default defineAkariConfig({
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

Une configuration de langue s'applique par-dessus la configuration partagée : elle n'a besoin que des titres de la langue et des noms de catégories. La version, les liens sociaux, les icônes des catégories, etc. viennent de la configuration partagée. Le nom dans le menu des langues est par défaut le nom de la langue dans sa propre langue (English, 日本語), et le sens du texte, les textes de l'interface, le bouton de copie des blocs de code et les titres des conteneurs viennent du pack de langue. La configuration de langue peut remplacer chacun d'eux.

## Changer de langue

Quand le site a deux langues ou plus, un bouton de langue apparaît en bas du rail (en bas du tiroir de navigation sur écran étroit). Un clic dessus ouvre la boîte de dialogue « Choisir une langue ».

- Si la langue cible a une page correspondante, vous restez sur cette page ; sinon, vous arrivez sur sa page d'accueil. Une langue qui ne traduit qu'une partie des pages n'envoie donc jamais les lecteurs vers une erreur 404.
- Le logo, le nom du site dans le pied de page et « Retour à l'accueil » sur la page 404 pointent tous vers la page d'accueil de la langue courante.

## Packs de langue {#language-packs}

Un pack de langue décrit une langue : ses textes d'interface (dans les boutons, la table des matières, la pagination, les paramètres et la recherche), ses polices, son sens du texte et ses textes dans le Markdown (le bouton de copie des blocs de code et les titres des conteneurs). Le thème en fournit six : chinois simplifié, anglais, japonais, coréen, français et arabe. Une page trouve son pack d'après `lang` : d'abord par le code complet, puis par la langue principale (`zh-TW` utilise `zh`), et l'anglais quand aucun des deux ne correspond. Les textes qu'un pack omet sont eux aussi en anglais.

Pour une langue que le thème ne fournit pas, écrivez un pack de langue et placez-le dans `languages` dans la configuration partagée :

```ts
// docs/.vitepress/languages/de.ts
import { defineAkariLanguage } from "../theme/define.ts";

export default defineAkariLanguage({
  code: "de",
  messages: {
    tocOverline: "Auf dieser Seite",
    previousPage: "Zurück",
    nextPage: "Weiter",
    searchPlaceholder: "Suchen",
  },
  markdown: {
    codeCopyButton: { tooltipText: "Code kopieren", copiedText: "Kopiert" },
    container: { tipLabel: "Tipp", warningLabel: "Warnung" },
  },
});
```

```ts
// docs/config.ts
import de from "./.vitepress/languages/de.ts";

export default defineAkariConfig({
  languages: [de],
});
```

Dès lors, `de-DE`, `de-AT` et tout autre dossier de langue allemande utilisent ce pack. Un pack qui porte le code d'un pack intégré s'applique par-dessus celui-ci : les textes qu'il écrit remplacent les entrées correspondantes, et `fonts` et `dir` sont remplacés en entier. Pour changer quelques textes d'une langue sur ce site uniquement, vous pouvez aussi écrire `messages` dans sa configuration de langue.

## Langues de ce site

Ce site propose six versions de chaque page : chinois (servi à la racine), anglais, japonais, coréen, français et arabe. Changer de langue vous garde sur la même page. La version arabe est mise en page de droite à gauche : vous pouvez vous en servir pour voir la mise en page RTL du thème.

Voir l'[API](/fr-FR/theme/i18n/api) pour tous les textes de l'interface et les fonctions de langue, et les [Détails](/fr-FR/theme/i18n/details) pour la façon dont les langues sont détectées et changées.
