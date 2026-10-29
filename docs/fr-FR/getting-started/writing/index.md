---
title: Rédiger des pages
icon: article
order: 3
tab: Vue d'ensemble
parallel:
  - api
  - details
---

# Rédiger des pages

Une page est un fichier Markdown placé dans un dossier de langue. Son emplacement détermine son chemin et sa place dans la navigation.

## Créer un article

1. Créez un dossier dans un dossier de catégorie. Le nom du dossier devient le chemin de l'article ; n'utilisez que des lettres minuscules, des chiffres et des tirets.
2. Écrivez-y un `index.md` qui commence par un titre de niveau 1.
3. Donnez-lui une icône et un ordre dans le frontmatter.

```text
docs/fr-FR/components/
└─ chip/
   └─ index.md          /fr-FR/components/chip
```

```md
---
icon: label
order: 4
---

# Chip

Texte de la page…
```

Dès que vous enregistrez, l'article apparaît dans la catégorie « Composants », sans redémarrer le serveur de développement. Son nom dans la navigation est le titre de la page, ici « Chip ».

Pour ajouter une catégorie, créez un dossier de catégorie, donnez-lui une icône dans `sidebar.categories` de la configuration partagée et un nom dans la configuration de langue ; voir [Configuration](/fr-FR/getting-started/configuration).

## Pages parallèles {#parallel-pages}

Un long article peut être divisé en plusieurs pages, que l'on parcourt avec la barre d'onglets en haut de la page, tandis que la barre latérale n'affiche toujours qu'un seul élément. Créez d'autres fichiers `.md` dans le dossier de l'article et listez-les, dans l'ordre, dans le frontmatter de `index.md` :

```text
docs/fr-FR/styles/icons/
├─ index.md           /fr-FR/styles/icons
├─ choosing.md        /fr-FR/styles/icons/choosing
└─ using.md           /fr-FR/styles/icons/using
```

```md
---
title: Icônes
tab: Vue d'ensemble
parallel:
  - choosing
  - using
---
```

Chaque page définit son titre dans la barre d'onglets avec son propre `tab` ; sans `tab`, c'est le titre de la page qui est utilisé. Les pages consacrées au thème sur ce site sont toutes divisées en trois pages : « Vue d'ensemble », « API » et « Détails ».

## Hero

Écrivez `hero` dans le frontmatter, et le haut de la page affiche côte à côte une carte de titre et une image ; voir [Hero](/fr-FR/theme/hero).

## Images et liens

- Une image utilisée par une seule page va dans le dossier de l'article et se référence avec `![Description](./image.png)`. Les images partagées par plusieurs pages vont dans `docs/public` et se référencent par un chemin absolu comme `/hero/image.svg`.
- La largeur et la hauteur des images sont écrites automatiquement au rendu, y compris pour les images distantes : la page ne saute donc pas pendant le chargement des images ; voir [API](/fr-FR/getting-started/writing/api#images).
- Les liens internes utilisent le chemin de la page et commencent par `/` : `[Navigation latérale](/theme/sidebar)`. N'écrivez ni le chemin du fichier (`/zh-CN/theme/sidebar/index.md`) ni un chemin relatif.
- Les liens entre pages françaises portent le préfixe `/fr-FR/`.

## Markdown

Toutes les extensions Markdown de VitePress fonctionnent, comme les groupes de code, les conteneurs personnalisés, la mise en évidence de lignes dans les blocs de code et les notes de bas de page. Le thème y ajoute quelques éléments :

- Les tableaux ont une bordure de contour M3, les liens du texte sont précédés d'une icône, et les éléments qui ont un fond, comme les blocs de code et les tableaux, portent un motif discret.
- Vous pouvez écrire des composants m3e directement dans le Markdown, comme `<m3e-button>` et `<m3e-card>`. Les démos de composants de ce site sont écrites ainsi.
- Quelques classes utilitaires servent à mettre en page le contenu des démos : `demo-surface`, `demo-row`, `demo-grid`, `demo-stack`.

Pour tous les champs du frontmatter, les composants disponibles et les classes utilitaires, voir [API](/fr-FR/getting-started/writing/api).

## Versions dans d'autres langues

Placez un dossier du même nom au même endroit dans un autre dossier de langue, par exemple `docs/zh-CN/components/chip/index.md`. Les deux pages se correspondent alors, et changer de langue reste sur cette page. Quand il n'y a pas de page correspondante, changer de langue mène à la page d'accueil de cette langue.
