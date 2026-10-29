---
tab: API
---

# Internationalisation : API

## Configuration de langue

| Champ | Type | Par défaut | Description |
| --- | --- | --- | --- |
| `rootLanguage` | `string` | Le premier dossier de langue par ordre alphabétique | Valable uniquement dans la configuration partagée : la langue servie à la racine du site |
| `lang` | `string` | Le nom du dossier de langue | Code de langue, utilisé pour `<html lang>` et pour choisir les textes intégrés de l'interface |
| `label` | `string` | `lang` | Nom dans le menu des langues |
| `dir` | `"ltr" \| "rtl" \| "auto"` | `"ltr"` | Sens du texte. Indiquez `rtl` pour une langue qui s'écrit de droite à gauche. Utilisé quand le paramètre « Sens du texte » vaut « Selon la langue » |
| `markdown` | `MarkdownLocaleOptions` | Aucune | Textes de cette langue dans le Markdown, comme `codeCopyButton: { tooltipText, copiedText }` |
| `messages` | `Partial<AkariMessages>` | Aucune | Remplace ou complète des textes de l'interface |

Les autres champs (`title`, `description`, `appBar`, `footer`, `search`, etc.) peuvent aussi figurer dans une configuration de langue ; voir [Configuration](/fr-FR/getting-started/configuration/api).

## messages

Le thème intègre six jeux de textes d'interface : chinois simplifié (`zh`), anglais (`en`), japonais (`ja`), coréen (`ko`), français (`fr`) et arabe (`ar`). Les entrées écrites dans `messages` remplacent les textes intégrés ; les entrées omises gardent les valeurs intégrées. Dans les entrées qui contiennent `{name}`, la valeur correspondante est insérée à l'exécution.

### Navigation et barre d'application

| Clé | Valeur par défaut en français |
| --- | --- |
| `navigationToggle` | Afficher ou masquer la navigation |
| `navigationLabel` | Documentation |
| `railLabel` | Rubriques de la documentation |
| `categoryNavigation` | Navigation : {category} |
| `categoryPages` | Pages : {category} |
| `homeLink` | Accueil de {title} |
| `moreActions` | Plus |
| `backToTop` | Haut de page |
| `tocButton` | Sommaire |
| `languageLabel` | Changer de langue |
| `languageDialogTitle` | Choisir une langue |
| `languageDialogClose` | Fermer |

### Table des matières, pagination et pied de page

| Clé | Valeur par défaut en français |
| --- | --- |
| `tocOverline` | Sur cette page |
| `pagerLabel` | Pagination |
| `previousPage` | Précédent |
| `nextPage` | Suivant |
| `footerMessage` | Conçu avec VitePress et M3E |
| `footerLinks` | Liens du pied de page |
| `notFoundTitle` | Page introuvable |
| `notFoundText` | La page que vous cherchez a peut-être été déplacée ou supprimée. |
| `notFoundLink` | Retour à l'accueil |

### Paramètres

| Clé | Valeur par défaut en français |
| --- | --- |
| `settingsTitle` | Paramètres |
| `settingsClose` | Fermer les paramètres |
| `settingsColor` | Couleur |
| `settingsVariant` | Variante |
| `settingsContrast` | Contraste |
| `settingsMotion` | Animations |
| `settingsDirection` | Sens du texte |
| `settingsTextSize` | Taille du texte |
| `contrastStandard` | Par défaut |
| `contrastMedium` | Moyen |
| `contrastHigh` | Élevé |
| `motionStandard` | Standard |
| `motionExpressive` | Expressif |
| `directionAuto` | Selon la langue |
| `directionLtr` | De gauche à droite |
| `directionRtl` | De droite à gauche |

### Apparence

| Clé | Valeur par défaut en français |
| --- | --- |
| `schemeToggle` | Apparence : {mode} |
| `schemeLight` | Clair |
| `schemeAuto` | Système |
| `schemeDark` | Sombre |
| `schemeTime` | Selon l'heure |
| `schemeChanged` | Thème changé : {mode} |
| `schemeChangedFollowing` | Thème changé : {mode} ({scheme}) |

### Recherche

| Clé | Valeur par défaut en français |
| --- | --- |
| `searchPlaceholder` | Rechercher |
| `searchLabel` | Rechercher dans la documentation |
| `searchShortcutLabel` | {label}, raccourci {shortcut} |
| `searchClose` | Fermer la recherche |
| `searchIntroTitle` | Rechercher dans la documentation |
| `searchIntroText` | Saisissez le titre d'une page, le nom d'un composant ou des mots du texte. |
| `searchIntroShortcut` | Appuyez sur {keys} pour l'ouvrir à tout moment |
| `searchLoading` | Recherche… |
| `searchErrorTitle` | La recherche est indisponible |
| `searchRetry` | Réessayer |
| `searchEmptyTitle` | Aucun résultat |
| `searchEmptyText` | Essayez un mot-clé plus court, ou vérifiez la configuration du service de recherche. |
| `searchResultCountOne` | {count} résultat |
| `searchResultCount` | {count} résultats |
| `searchResultsLabel` | Résultats de la recherche |
| `searchResultPage` | Page |
| `searchHintSelect` | Choisir |
| `searchHintOpen` | Ouvrir |
| `searchHintClose` | Fermer |
| `searchFailed` | La recherche a échoué. Réessayez plus tard. |
| `searchIndexUnavailable` | Impossible de charger l'index de recherche local (HTTP {status}). |
| `searchIndexInvalid` | L'index de recherche local n'est pas valide. |
| `searchRequestFailed` | La requête de recherche a échoué (HTTP {status}). |
| `searchBackendMissing` | Aucun service de recherche n'est enregistré sous « {id} ». |

`searchResultCountOne` sert aux nombres dont la catégorie de pluriel est `one` (« 1 résultat » en français) ; les autres nombres utilisent `searchResultCount`. `Intl.PluralRules` détermine la catégorie selon la langue. `{keys}` est rendu sous forme de touches de clavier à l'affichage.

## useAkariI18n

```ts
import { useAkariI18n } from "@theme";

const { lang, messages, t } = useAkariI18n();
t("homeLink", { title: "Vitepress Theme Akari Docs" }); // "Accueil de Vitepress Theme Akari Docs"
```

| Renvoie | Description |
| --- | --- |
| `lang` | Code de la langue courante |
| `messages` | Tous les textes de l'interface de la langue courante, avec la configuration `messages` fusionnée |
| `t(key, params?)` | Récupère un texte et remplit ses espaces réservés |

## useAkariLocales

```ts
import { useAkariLocales } from "@theme";

const { locales, homeHref } = useAkariLocales();
```

| Renvoie | Description |
| --- | --- |
| `locales` | Liste des langues, chacune sous la forme `{ key, label, lang, href, current }` ; `href` est l'URL à ouvrir pour passer à cette langue. Tableau vide quand le site n'a qu'une seule langue |
| `homeHref` | URL de la page d'accueil de la langue courante, avec `base` ajouté |

N'appelez ces deux fonctions que dans des composants situés dans la mise en page.

## Langues dans la recherche

Un backend de recherche enregistré reçoit `lang` (comme `zh-CN`) et `locale` (la clé de locale VitePress, `root` pour la langue racine) dans son second argument ; voir [Recherche](/fr-FR/theme/search/api#registered-backends).
