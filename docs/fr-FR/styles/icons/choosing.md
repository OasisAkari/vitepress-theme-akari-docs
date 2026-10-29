# Choisir les icônes

Chaque icône Material Symbols existe en trois styles et deux formes. Le thème utilise par défaut le style Outlined, et la forme pleine pour des états comme sélectionné ou activé.

## Styles

| Style | Caractère | Chemin d'import |
| --- | --- | --- |
| Outlined | Traits réguliers et espacement net ; s'accorde le mieux avec les composants M3 | `@m3e/icons/outlined/<name>` |
| Rounded | Extrémités et angles des traits arrondis ; plus doux | `@m3e/icons/rounded/<name>` |
| Sharp | Angles droits ; plus anguleux | `@m3e/icons/sharp/<name>` |

Tenez-vous à un seul style au sein d'une interface. La navigation, la barre d'application et les boutons du thème utilisent tous Outlined. Pour passer tout le site en Rounded, remplacez chaque import dans `icons.ts` et définissez `variant="rounded"` sur `<m3e-icon>`.

## Contour et plein

L'attribut `filled` affiche la forme pleine d'une icône :

<div class="demo-row">
  <m3e-icon name="home"></m3e-icon>
  <m3e-icon name="home" filled></m3e-icon>
  <m3e-icon name="settings"></m3e-icon>
  <m3e-icon name="settings" filled></m3e-icon>
  <m3e-icon name="palette"></m3e-icon>
  <m3e-icon name="palette" filled></m3e-icon>
</div>

```html
<m3e-icon name="home"></m3e-icon>
<m3e-icon name="home" filled></m3e-icon>
```

M3 utilise le remplissage pour signifier « actuel » ou « activé » : dans le rail, l'icône de la catégorie actuelle est pleine et les autres sont en contour. Ne comptez pas sur le seul remplissage pour indiquer un état ; l'élément sélectionné change aussi sa couleur de fond et son texte.

## Taille

Les icônes mesurent 24px par défaut et suivent `font-size`. Tailles courantes :

| Taille | Usage |
| --- | --- |
| 20px | Listes compactes, remarques dans le texte |
| 24px | Par défaut : boutons, navigation, éléments de liste |
| 40px et plus | Illustrations d'état vide, pages de prise en main |

```html
<m3e-icon name="search" style="font-size: 20px"></m3e-icon>
<m3e-icon name="search_off" style="font-size: 48px"></m3e-icon>
```

Ne changez pas la taille des icônes à l'intérieur de composants comme les boutons et les éléments de navigation. Ces composants définissent déjà la taille et l'espacement des icônes selon la spécification M3.

## Choisir la bonne icône

- Préférez les icônes au sens établi : `search` pour la recherche, `settings` pour les paramètres, `translate` pour la langue.
- Utilisez une icône par sens, et n'utilisez pas la même icône pour des actions différentes à différents endroits.
- Quand un concept abstrait (comme « thème » ou « composant ») n'a pas d'icône courante, choisissez-en une de forme simple qui reste lisible à 24px, et accompagnez-la toujours de texte.
