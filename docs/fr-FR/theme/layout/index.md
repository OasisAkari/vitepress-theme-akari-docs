---
icon: view_quilt
order: 1
tab: Vue d'ensemble
parallel:
  - api
  - details
---

# Mise en page et barre d'application

La mise en page reprend celle de [m3.material.io](https://m3.material.io) : la barre d'application et la navigation latérale restent fixes dans la fenêtre, tandis que le contenu, la table des matières à droite et les cartes de pagination se trouvent sur une même surface de document arrondie. Le pied de page est une seconde surface placée en dessous. La fenêtre du navigateur fait défiler toute la page : la recherche dans la page, les boutons précédent et suivant du navigateur, et les sauts vers les ancres fonctionnent donc comme d'habitude.

## Barre d'application

- **À gauche** : le logo, le nom et le numéro de version du site. Une fois que le titre de l'article est passé sous la barre d'application, le nom est remplacé par le titre de la page courante. Sur écran étroit, un bouton de menu qui ouvre le tiroir de navigation apparaît tout à gauche.
- **À droite** : le champ de recherche, les liens sociaux et le bouton des paramètres. Quand la place manque, le champ de recherche se réduit à un bouton rond, et les liens sociaux et les paramètres passent dans le menu « Plus » à trois points.

<div class="demo-surface">
  <m3e-app-bar>
    <span slot="title">Vitepress Theme Akari Docs</span>
    <m3e-chip slot="trailing">v1.0.0</m3e-chip>
    <m3e-icon-button id="layout-demo-settings" slot="trailing" aria-label="Paramètres">
      <m3e-icon name="settings"></m3e-icon>
    </m3e-icon-button>
    <m3e-tooltip for="layout-demo-settings">Ouvrir les paramètres</m3e-tooltip>
  </m3e-app-bar>
</div>

Vous définissez le contenu de la barre d'application dans la configuration `appBar` :

```ts
appBar: {
  title: "Vitepress Theme Akari Docs",
  version: "v1.0.0",
  socialLinks: [
    { icon: "github", link: "https://github.com/OasisAkari/vitepress-theme-akari-docs", label: "GitHub" },
  ],
},
```

## Surface du document et table des matières

- Les paragraphes et les listes font au plus 760px de large environ. Les titres, les tableaux et les blocs de code occupent toute la largeur de la surface.
- La table des matières à droite liste les titres de niveaux 2 et 3. Elle met en évidence la section courante pendant la lecture et, quand vous cliquez sur un titre, fait défiler la page en douceur jusqu'à lui.
- Quand la fenêtre fait moins de 960px de large, la table des matières est masquée, et un bouton de table des matières en bas à droite l'ouvre à la place.
- Écrivez `toc: false` dans le frontmatter d'une page, et cette page n'a pas de table des matières.

Une page qui appartient à un groupe de pages parallèles a une barre d'onglets en haut de la surface ; voir [Navigation latérale](/fr-FR/theme/sidebar#parallel-pages). Sur une page avec un hero, le titre et l'image s'affichent en haut de la surface ; voir [Hero](/fr-FR/theme/hero).

## Boutons d'action flottants

- **Haut de page** : apparaît en bas à droite dès que la page défile. Cliquez dessus pour revenir en douceur en haut de la page ; pendant le trajet, il se déploie pour afficher « Haut de page ». Cliquez de nouveau, ou faites défiler vous-même, pour l'arrêter.
- **Table des matières** : apparaît au-dessus quand la fenêtre fait moins de 960px de large. Cliquez dessus pour le déployer en un panneau qui contient la table des matières de la page courante ; cliquez en dehors du panneau pour le fermer.

## Pied de page

Après les cartes de pagination viennent un séparateur ondulé et le pied de page : le logo, le nom du site et `footer.message` à gauche, les colonnes de liens à droite, et `footer.copyright` en bas. Par défaut, les colonnes de liens reprennent les quatre premières catégories de la navigation.

## Barre de chargement

Pendant le chargement d'une page, une fine barre de la couleur primaire court en haut de la fenêtre : à l'ouverture du site, elle attend les scripts, les images et les polices ; en naviguant dans le site, elle attend le script de la page suivante, ses images et ses polices. Un chargement rapide n'affiche rien. La configuration permet de la désactiver ; voir [API](/fr-FR/theme/layout/api#loadingbar).

## Tailles de fenêtre

| Largeur de la fenêtre | Navigation | Table des matières |
| --- | --- | --- |
| 1600px et plus | Rail et tiroir de navigation toujours affichés | À droite |
| 960–1599px | Rail ; le tiroir de navigation se déploie quand le pointeur s'arrête sur une catégorie | À droite |
| Moins de 960px | Le bouton de menu de la barre d'application ouvre le tiroir de navigation | Bouton en bas à droite |
| Moins de 600px | Comme ci-dessus ; la surface du document s'étend jusqu'aux bords de la fenêtre | Bouton en bas à droite |

Pour toutes les options, les variables CSS et l'état de la page, voir l'[API](/fr-FR/theme/layout/api). Pour le fonctionnement du défilement, du changement de titre, du regroupement des boutons et des autres comportements, voir les [Détails](/fr-FR/theme/layout/details).
