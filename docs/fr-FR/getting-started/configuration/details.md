---
tab: Détails
---

# Configuration : détails

## Superposition des deux niveaux {#how-the-two-levels-layer}

`docs/config.ts` et le `config.ts` de chaque dossier de langue sont des configurations de dossier de VitePress 2.

- VitePress cherche dans `docs` les fichiers nommés `config.ts` (ou `.mts`, `.js`, `.mjs`), en ignorant les dossiers qui commencent par `.`. Chaque fichier ne s'applique qu'aux pages de son dossier. Cela dépend de l'emplacement du fichier source, pas du chemin réécrit de la page.
- La configuration d'une page est superposée à partir de plusieurs niveaux, du plus prioritaire au moins prioritaire : le `config.ts` de son dossier et des dossiers parents (le plus profond l'emporte), `docs/config.ts`, la configuration de locale de VitePress, et `.vitepress/config.mts`.
- La superposition se fait champ par champ. Pour un objet, chaque champ prend sa valeur au niveau le plus prioritaire qui en a une ; les chaînes, les tableaux et les autres valeurs sont remplacés en entier. Ainsi, `appBar: { title }` dans une configuration de langue n'efface pas `appBar.socialLinks` de la configuration partagée, alors que `socialLinks` lui-même, qui est un tableau, ne peut être remplacé qu'en entier.
- La superposition a lieu au rendu de la page, avec le même résultat côté serveur et dans le navigateur.
- Modifier, ajouter ou supprimer un `config.ts`, quel qu'il soit, redémarre automatiquement le serveur de développement.
- Un dossier de catégorie ou un dossier d'article peut aussi contenir un `config.ts`. Il ne s'applique qu'aux pages de ce dossier, par exemple pour donner à une catégorie son propre message de pied de page.

## Les langues à partir des dossiers

`akariContent` s'exécute au chargement de `.vitepress/config.mts` :

1. Il lit `docs/config.ts` et trouve les dossiers de langue : les dossiers de premier niveau de `docs` qui contiennent un `config.ts`, sauf `public`, `node_modules` et les dossiers qui commencent par `.`. Les fichiers de configuration sont empaquetés et exécutés par le chargeur de configuration de Vite, de la même façon que VitePress les charge.
2. Il choisit la langue racine : le dossier nommé par `rootLanguage`. Si ce champ n'est pas défini ou si le dossier n'existe pas (ce qui produit un avertissement), il prend le premier dossier par ordre alphabétique. Les autres langues suivent par ordre alphabétique.
3. Il génère une entrée `locales` de VitePress par langue. La clé de la langue racine est `root` ; les autres utilisent le nom du dossier. Chaque entrée reprend le contenu de la configuration de langue (sauf `head`, que la configuration de dossier ajoute déjà ; l'ajouter à nouveau le dupliquerait. Le `head` de la locale contient les balises de polices de la langue ; voir [Typographie](/fr-FR/styles/typography/api#fonts)). `lang` vaut par défaut le nom du dossier, et l'entrée porte la navigation générée (`themeConfig.akari.sidebar.items`). Les `label`, `dir` et `markdown` que la configuration de langue omet viennent du pack de langue correspondant à `lang` ; voir [Internationalisation : détails](/fr-FR/theme/i18n/details#where-language-packs-are-used).
4. Les `lang`, `title` et `description` du site viennent de la langue racine.

Une configuration de langue joue à la fois le rôle de configuration de dossier pour ses propres pages et celui de locale, et chaque rôle a son utilité. La locale fait figurer la langue dans le menu des langues, affiche dans cette langue les textes du Markdown comme le bouton de copie des blocs de code, et donne aux pages situées hors des dossiers de langue, comme la page 404, les réglages de la langue racine. Les deux contiennent les mêmes valeurs, donc le résultat de la superposition n'en est pas affecté.

Sans aucun dossier de langue, `akariContent` ne génère ni locales ni réécritures. Le site fonctionne avec la configuration de `.vitepress/config.mts`, et la navigation vient d'un `sidebar.items` écrit à la main ou du `themeConfig.sidebar` de VitePress.

## Chemins et navigation

`akariContent` renvoie aussi la fonction `rewrites` de VitePress, et lit le frontmatter Markdown de chaque langue pour générer sa navigation. Pour les règles exactes, voir [Rédiger des pages · Détails](/fr-FR/getting-started/writing/details). Quand la configuration de langue ou la configuration partagée définit `sidebar.items`, cette langue utilise la navigation écrite à la main et aucune navigation n'est générée.

## Mises à jour pendant le développement

| Modification | Résultat |
| --- | --- |
| Ajouter, supprimer ou modifier un `config.ts` | VitePress redémarre le serveur de développement et `akariContent` s'exécute à nouveau |
| Ajouter ou supprimer du Markdown, ou modifier le frontmatter | `content.plugin` régénère la navigation après environ 120ms. Si la navigation a changé, il met à jour les données du site et recharge la page |
| Modifier seulement le corps du texte | La navigation ne change pas. VitePress s'en charge avec sa propre mise à jour à chaud, sans recharger la page |

`content.plugin` ne surveille que les fichiers `.md` des dossiers de langue. Si un dossier de langue entier est déplacé pendant que le serveur tourne, le plugin ignore ce dossier jusqu'au prochain redémarrage.

## Ce que peut contenir un fichier de configuration

Les fichiers de configuration s'exécutent dans Node.js, et le résultat est sérialisé puis envoyé au navigateur avec les données du site : ils ne conviennent donc qu'à des données. Les objets qui dépendent d'imports, comme les composants Vue, ne peuvent pas passer. Pour remplacer des composants, appelez `provideAkariComponents` dans l'entrée du thème ; voir [Étendre le thème](/fr-FR/theme/extending/api#provideakaricomponents).

## Importer defineAkariConfig

`defineAkariConfig` se trouve dans `theme/define.ts`. Ce fichier n'importe que des types et écrit l'extension en toutes lettres (`./types.ts`), et les fichiers de configuration l'importent eux aussi par son nom de fichier complet (`define.ts`). Quand Vite charge un fichier de configuration, il affiche un avertissement pour les écritures qu'un futur chargeur natif ne saura pas gérer, comme les imports sans extension. Les fichiers de configuration écrits ainsi ne le déclenchent pas. `tsconfig.json` active `allowImportingTsExtensions` pour cela.

Le build affiche encore un avertissement de ce type. Il vient des imports de `.vitepress/config.mts` lui-même et n'affecte pas le résultat du build.
