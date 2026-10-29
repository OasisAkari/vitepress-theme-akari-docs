---
tab: API
---

# Étendre le thème : API

## provideAkariComponents

```ts
import { provideAkariComponents } from "./composables/useAkariConfig";

function provideAkariComponents(
  app: App,
  components: Partial<Record<AkariComponentSlot, Component>>,
): void;
```

Appelez-la dans `enhanceApp` du point d'entrée du thème. Chaque composant passé remplace la partie correspondante ; les parties omises utilisent les composants intégrés. Les fichiers de configuration ne peuvent contenir que des données, c'est pourquoi les composants sont fournis ici et non dans la configuration.

| Emplacement | Remplace | Composant intégré |
| --- | --- | --- |
| `AppBar` | Barre d'application | Barre d'application `m3e-app-bar` |
| `DesktopNav` | Rail et tiroir de navigation sur ordinateur | `m3e-nav-rail` et `m3e-nav-menu` ; l'élément racine est en `display: contents`, le rail occupe toute la hauteur de la colonne 1 de la grille de la page, et le tiroir permanent se place en colonne 2, ligne 2 |
| `Sidebar` | Tiroir de navigation sur écran étroit | `m3e-nav-menu` récursif |
| `Settings` | Panneau de la boîte de dialogue des paramètres | Six groupes d'options ; le titre, le bouton de fermeture et l'animation viennent de la boîte de dialogue |
| `Hero` | Hero de la page | Carte de titre et carte d'image, rendues seulement si le frontmatter contient `hero` |
| `Toc` | Table des matières à droite | Table des matières suspendue |
| `Pager` | Pagination en fin de contenu | Cartes de page précédente et de page suivante |
| `Footer` | Pied de page | Séparateur ondulé et surface du pied de page |
| `Content` | Conteneur extérieur du contenu Markdown | `div` sans style |

Une barre d'application minimale :

```vue
<script setup lang="ts">
import { useAkariConfig } from "@theme";

const config = useAkariConfig();
</script>

<template>
  <m3e-app-bar>
    <span slot="title">{{ config.appBar.title }}</span>
    <m3e-chip v-if="config.appBar.version" slot="trailing">
      {{ config.appBar.version }}
    </m3e-chip>
  </m3e-app-bar>
</template>
```

Si vous remplacez vraiment la barre d'application, gardez aussi le bouton qui ouvre le tiroir de navigation sur écran étroit (`<m3e-drawer-toggle for="akari-sidebar">`). Sans lui, la navigation ne peut pas s'ouvrir sur écran étroit.

## Composables

Ils sont tous exportés par le point d'entrée du thème (`import { … } from "@theme"`) et ne peuvent être appelés que dans des composants situés dans la mise en page.

| Fonction | Renvoie | Voir |
| --- | --- | --- |
| `useAkariConfig()` | `ComputedRef<ResolvedAkariThemeConfig>` : la configuration du thème fusionnée avec les valeurs par défaut | Ci-dessous |
| `useSidebar()` | `{ items, prevNext, tabGroup, isActive, hasActive }` | [Navigation latérale](/fr-FR/theme/sidebar/api#usesidebar) |
| `useAkariSettings()` | `{ settings, setSetting, reset, isDefault, defaults, sections, labels }` | [Paramètres](/fr-FR/theme/settings/api#useakarisettings) |
| `useAkariColorScheme()` | `{ mode, resolved, cycle }` | [Paramètres](/fr-FR/theme/settings/api#useakaricolorscheme) |
| `useAkariI18n()` | `{ lang, messages, t }` | [Internationalisation](/fr-FR/theme/i18n/api#useakarii18n) |
| `useAkariLocales()` | `{ locales, homeHref }` | [Internationalisation](/fr-FR/theme/i18n/api#useakarilocales) |
| `useAkariSearch()` | État et actions du panneau de recherche | [Recherche](/fr-FR/theme/search/api#useakarisearch) |

Le résultat de `useAkariConfig()` contient `lang`, `messages`, `appBar`, `sidebar`, `settings`, `toc`, `footer`, `search`, `fonts` et `components`. Chaque groupe a ses valeurs par défaut renseignées et a été validé (par exemple, `toc.maxDepth` est ramené entre 1 et 6).

## Autres exports

| Export | Type | Rôle |
| --- | --- | --- |
| `defineAkariConfig` | `(config: AkariSiteConfig) => AkariDirectoryConfig` | Écrire les fichiers de configuration ; voir [Configuration](/fr-FR/getting-started/configuration/api#defineakariconfig) |
| `defineAkariThemeConfig` | `(config: AkariThemeConfig) => AkariThemeConfig` | Aide au typage quand vous n'écrivez que des champs du thème |
| `registerSearchBackend` | `(id, handler) => void` | Enregistre un backend de recherche ; voir [Recherche](/fr-FR/theme/search/api#registered-backends) |
| `defineAkariLanguage` | `(language: AkariLanguage) => AkariLanguage` | Écrire un pack de langue ; voir [Internationalisation](/fr-FR/theme/i18n/api#akarilanguage) |
| `AKARI_LANGUAGES` | `AkariLanguage[]` | Les packs de langue intégrés |
| `resolveLanguage` | `(lang, languages?) => ResolvedAkariLanguage` | Le pack qu'obtient finalement une langue |
| `AKARI_CONTENT_ID` | `"akari-doc-content"` | id du conteneur de contenu |
| `AKARI_SIDEBAR_ID` | `"akari-sidebar"` | id du tiroir de navigation sur écran étroit |
| `AKARI_SETTINGS_ID` | `"akari-settings"` | id du panneau des paramètres |

Les types (`AkariThemeConfig`, `AkariSidebarItem`, `AkariSearchResult` et les autres) sont tous exportés depuis `types.ts`.

## Variables CSS

| Portée | Variables | Voir |
| --- | --- | --- |
| Surface du document, table des matières, pied de page | `--akari-doc-*`, `--akari-toc-width`, `--akari-wavy-divider-color` | [Mise en page et barre d'application](/fr-FR/theme/layout/api#css-variables) |
| Barre d'onglets des pages parallèles | `--akari-app-bar-tabs-gap`, `--akari-page-tabs-docked-max-width` | [Navigation latérale](/fr-FR/theme/sidebar/api#tab-bar-css-variables) |
| Hero et motifs | `--akari-doc-hero-*`, `--akari-pattern-*` | [Hero](/fr-FR/theme/hero/api#css-variables) |
| Couleur | `--md-sys-color-*` | [Couleur](/fr-FR/styles/color/api) |
| Typographie | `--md-sys-typescale-*` | [Typographie](/fr-FR/styles/typography/api) |
| Composants m3e | Par exemple `--m3e-card-shape`, `--m3e-button-*` | Documentation des composants m3e |

## Organisation du code source {#source-layout}

```text
docs/.vitepress/
├── config.mts             relie le thème à VitePress
├── content/               langues, chemins et navigation tirés des dossiers (Node)
└── theme/
    ├── index.ts           point d'entrée du thème et exports publics
    ├── define.ts          defineAkariConfig et defineAkariLanguage
    ├── config.ts          valeurs par défaut et validation de la configuration
    ├── types.ts           définitions de types
    ├── constants.ts       valeurs par défaut, points de rupture et id
    ├── i18n/              packs de langue et résolution d'une langue
    │   └── languages/     packs de langue intégrés, un fichier par langue
    ├── locales.ts         correspondance des chemins pour changer de langue
    ├── sidebar.ts         normalisation, correspondance et pagination de la navigation
    ├── settings.ts        validation et stockage des paramètres
    ├── scheme.ts          résolution du mode clair et du mode sombre, script de la première image
    ├── hero.ts            analyse du frontmatter hero
    ├── loading.ts         calcul de la progression de la barre de chargement
    ├── head.ts / fonts.ts akariHead et fonts
    ├── markdown.ts        akariMarkdown
    ├── m3e.ts / icons.ts  enregistrement à la demande des composants et des icônes
    ├── layouts/           AkariLayout.vue
    ├── components/
    │   ├── shell/         barre d'application, menu « Plus », boutons d'apparence et de langue, boîtes de dialogue, barre de chargement
    │   ├── sidebar/       rail, tiroir de navigation sur ordinateur, navigation sur écran étroit
    │   ├── content/       hero, barre d'onglets, table des matières, pagination, FAB, pied de page
    │   └── settings/      boîte de dialogue et panneau des paramètres
    ├── composables/       composables
    ├── search/            panneau de recherche, backends et état
    └── styles/            styles des jetons, du shell, du contenu, des motifs et de la barre d'onglets
```

La logique qui ne dépend pas du navigateur (résolution de la configuration, correspondance de la navigation, chemins des langues, validation des paramètres, analyse du hero, courbes d'animation, etc.) est écrite sous forme de fonctions pures, avec des tests unitaires dans `tests/` à la racine du dépôt.
