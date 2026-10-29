---
tab: Détails
---

# Internationalisation : détails

## À quelle langue appartient une page

Le chemin détermine la langue : une page dont le chemin commence par `/<dossier de langue>/` appartient à cette langue, et toutes les autres pages appartiennent à la langue racine. Dans les sources, les pages de la langue racine se trouvent dans leur propre dossier (`docs/zh-CN/`), mais elles sont servies sans le nom du dossier ; voir [Rédiger des pages : détails](/fr-FR/getting-started/writing/details#path-rules).

La configuration qu'obtient une page est le `config.ts` de son dossier de langue, appliqué par-dessus la configuration partagée et la configuration de locale de VitePress ; voir [Configuration : détails](/fr-FR/getting-started/configuration/details#how-the-two-levels-layer).

## Choix des textes de l'interface

1. Prendre le `lang` de la langue courante, le mettre en minuscules et comparer le code complet avec les langues intégrées (`zh`, `en`, `ja`, `ko`, `fr`, `ar`).
2. À défaut de correspondance, comparer la langue principale : `zh-CN` et `zh-TW` utilisent tous deux le chinois, `en-GB` utilise l'anglais et `fr-CA` utilise le français.
3. S'il n'y a toujours pas de correspondance, utiliser l'anglais.
4. Les entrées écrites dans les `messages` de la configuration de langue remplacent les textes intégrés.

Lorsque `settings.title`, `settings.labels`, `toc.overline`, `footer.message` et `search.placeholder` ne sont pas définis, ils proviennent aussi de cette table : une seule configuration partagée a ainsi des valeurs par défaut adaptées dans chaque langue. Les textes écrits dans la configuration partagée sont hérités par toutes les langues ; les textes qui varient selon la langue vont dans la configuration de langue.

## Où mène le changement de langue

1. Transposer le chemin courant dans la langue cible : `/getting-started/installation` → `/fr-FR/getting-started/installation`, et retirer le préfixe dans l'autre sens.
2. Si la navigation de la langue cible contient ce chemin, l'ouvrir. La navigation comprend chaque page d'un groupe de pages parallèles.
3. Sinon, ouvrir la page d'accueil de la langue cible : `/` pour la langue racine, `/<dossier de langue>/` pour les autres.

Seule la navigation de la langue cible compte : une page absente de la navigation (par exemple, une page hors de la structure) n'est donc jamais une cible de changement de langue.

## Boîte de dialogue des langues

- Le bouton de langue est un bouton icône rond à contour (`m3e-icon-button variant="outlined"`). Il n'est pas rendu quand il n'y a qu'une seule langue.
- La boîte de dialogue utilise la même transformation de conteneur que le panneau de recherche : le bouton se déploie en un panneau centré, l'icône placée avant le titre du panneau est le bouton lui-même, et à la fermeture le panneau repart par le même chemin.
- Chaque langue occupe deux lignes dans la liste : son `label` sur la première et, en dessous, son nom dans la langue actuelle de l'interface, fourni par `Intl.DisplayNames` (dans une interface en français, `zh-CN` s'affiche « chinois (Chine) »). La langue courante est mise en évidence par une icône de coche.
- Un clic sur une langue passe à cette langue et ferme la boîte de dialogue, avec une navigation SPA. Un clic avec `⌘`, `Ctrl` ou une autre touche de modification enfoncée l'ouvre dans un nouvel onglet.
- À l'ouverture, le focus est sur la langue courante, et `Tab` passe d'une langue à l'autre. `Esc`, un clic sur le voile ou sur le bouton de fermeture ferment la boîte de dialogue, et le focus revient au bouton de langue.
- Sur écran étroit, le bouton se trouve en bas du tiroir de navigation, et la boîte de dialogue recouvre le tiroir.

## Portée de la recherche

Il n'existe qu'un seul index local, qui contient les pages de toutes les langues. Lors d'une recherche, seules les entrées de la même langue que la page courante sont conservées : les résultats de la langue racine n'incluent pas les pages sous `/<dossier de langue>/`. Les textes et les messages d'erreur du panneau de recherche suivent la langue.
