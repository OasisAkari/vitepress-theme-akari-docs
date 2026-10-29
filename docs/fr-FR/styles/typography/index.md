---
icon: text_fields
order: 3
tab: Vue d'ensemble
parallel:
  - api
---

# Typographie

Le texte latin utilise Roboto et le texte chinois Noto Sans SC (Source Han Sans) ; les pages en japonais, en coréen et en arabe utilisent Noto Sans JP, Noto Sans KR et Noto Sans Arabic. Ce sont toutes des polices à graisse variable, et la configuration permet de les changer ou de désactiver Google Fonts. Le texte courant a une taille de base de 16px et un interligne de 1,65. Les titres, le texte courant, le code et les tableaux sont tous dimensionnés en `rem` : quand vous changez la taille du texte dans les paramètres, toute la zone de lecture s'adapte proportionnellement.

## Niveaux de titre

Chaque page a exactement un titre de premier niveau, qui est le titre de la page. Les sections utilisent des titres de deuxième niveau, les sous-sections des titres de troisième niveau, et les remarques plus fines des titres de quatrième niveau.

| Niveau | Usage | Style |
| --- | --- | --- |
| Premier | Titre de la page | display-large, 57px, graisse 400 |
| Deuxième | Sections ; listés dans la table des matières | headline-medium, 28px, graisse 500 |
| Troisième | Sous-sections ; listés dans la table des matières | headline-small, 24px, graisse 500 |
| Quatrième | Remarques détaillées | 20px, graisse 500 |

Gardez des niveaux de titre consécutifs. Ne sautez pas de niveau, et n'utilisez pas un paragraphe en gras à la place d'un titre.

### Exemple de titre de troisième niveau

Un titre de troisième niveau divise une section en parties faciles à parcourir. Chaque partie traite d'un seul sujet.

#### Exemple de titre de quatrième niveau

Les titres de quatrième niveau conviennent aux remarques complémentaires sur les cas limites, les différences entre versions ou le détail des paramètres.

## Texte courant

- Limitez les paragraphes à trois à cinq lignes. Découpez les longs paragraphes en listes ou en sous-titres.
- Utilisez le code inline pour les commandes, les noms de champs et les noms de balises, comme `npm run build`, `appBar.title` et `m3e-card`.
- Le texte d'un lien doit dire où il mène, comme [installation et prérequis](/fr-FR/getting-started/installation). N'écrivez pas « cliquez ici ».
- Utilisez le gras avec parcimonie pour mettre en valeur. Ne mettez pas des paragraphes entiers en gras.

> Utilisez les citations pour les conclusions tirées de spécifications ou de sources officielles. Les citations et les encadrés du texte portent le même motif discret que les blocs de code.

<small>Le texte d'appoint utilise une taille plus petite et la couleur `on-surface-variant`.</small>

## Titres dans les composants

`m3e-heading` a quatre apparences : display, headline, title et label. Vous pouvez les combiner avec les titres du document. Les titres ci-dessous portent tous `m3e-toc-ignore` et restent donc hors de la table des matières :

<div class="demo-stack">
  <m3e-heading m3e-toc-ignore variant="display" size="large" level="2">Display Large</m3e-heading>
  <m3e-heading m3e-toc-ignore variant="headline" size="medium" level="3">Headline Medium</m3e-heading>
  <m3e-heading m3e-toc-ignore variant="title" size="large" level="4">Title Large</m3e-heading>
  <m3e-heading m3e-toc-ignore variant="label" size="large" level="5">Label Large</m3e-heading>
</div>

`level` définit le niveau de titre que lisent les technologies d'assistance. `variant` et `size` ne changent que l'apparence.

## Taille du texte

Le paramètre « Taille du texte » a trois paliers, qui définissent la taille de police de l'élément racine :

| Option | Taille racine | Convient pour |
| --- | --- | --- |
| 100% | `16px` | La taille de lecture par défaut |
| 150% | `24px` | Une vision réduite ou la lecture à distance |
| 200% | `32px` | Les démos et les vérifications d'accessibilité |

Pour les polices, les styles des éléments du texte et les tokens typographiques, voir [API](/fr-FR/styles/typography/api).
