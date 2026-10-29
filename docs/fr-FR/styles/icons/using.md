# Utiliser les icônes

Les icônes doivent être enregistrées avant d'être utilisées. Une icône s'enregistre une seule fois ; vous pouvez ensuite y faire référence par son nom dans le Markdown, la configuration et les composants.

## Enregistrement

Importez les modules d'icônes dans `docs/.vitepress/theme/icons.ts`. Importer un module enregistre l'icône :

```ts
import "@m3e/icons/outlined/home";
import "@m3e/icons/outlined/search";
import "@m3e/icons/outlined/rocket_launch";
```

- Le nom du module est le nom de l'icône Material Symbols. Vous pouvez le chercher sur [fonts.google.com/icons](https://fonts.google.com/icons).
- N'importez pas tout le paquet d'icônes. N'importez que les icônes que vous utilisez ; les icônes non importées restent hors du résultat du build.
- Un `<m3e-icon>` qui utilise une icône non enregistrée s'affiche vide. Si une icône ne s'affiche pas, vérifiez d'abord qu'elle est enregistrée.

## Utiliser des icônes dans une page

Écrivez `<m3e-icon>` directement dans le Markdown :

```html
<m3e-icon name="rocket_launch"></m3e-icon>
```

Dans des composants comme les boutons, utilisez `slot="icon"` pour placer l'icône :

<div class="demo-row">
  <m3e-button variant="filled">
    <m3e-icon slot="icon" name="rocket_launch"></m3e-icon>
    Commencer
  </m3e-button>
  <m3e-button variant="tonal">
    <m3e-icon slot="icon" name="tune"></m3e-icon>
    Ajuster
  </m3e-button>
</div>

```html
<m3e-button variant="filled">
  <m3e-icon slot="icon" name="rocket_launch"></m3e-icon>
  Commencer
</m3e-button>
```

## Utiliser des icônes dans la navigation

Les icônes du rail et du menu de premier niveau du tiroir de navigation mobile sont des icônes de catégorie, définies dans `sidebar.categories` de la configuration partagée. L'icône d'un article se met dans son frontmatter :

```ts
// docs/config.ts
sidebar: {
  categories: {
    "getting-started": { icon: "rocket_launch" },
    styles: { icon: "style" },
  },
},
```

```yaml
# docs/fr-FR/styles/color/index.md
---
icon: colorize
---
```

Ces icônes doivent aussi être enregistrées dans `icons.ts`. Une catégorie sans icône affiche `category`.

## Accessibilité

- Une icône placée à côté d'un texte est décorative et ne demande rien de plus : `<m3e-icon>` est masqué par défaut aux technologies d'assistance.
- Un bouton qui n'a qu'une icône et pas de texte doit avoir un nom, par exemple `<m3e-icon-button aria-label="Rechercher">`, accompagné d'un `m3e-tooltip` qui affiche le même texte.
- Les icônes directionnelles (flèches, avancer et reculer) doivent être échangées par paires dans les mises en page de droite à gauche, par exemple en intervertissant `arrow_forward` et `arrow_back`. Ne comptez pas sur une icône seule pour transmettre un sens autre que la direction.
- En mode contraste élevé, les icônes suivent la couleur du texte. Ne donnez pas de couleur fixe aux icônes.
