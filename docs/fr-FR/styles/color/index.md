---
icon: colorize
order: 1
tab: Vue d'ensemble
parallel:
  - api
---

# Couleur

Toutes les couleurs du thème viennent de la couleur dynamique de m3e. Une seule couleur source suffit : `m3e-theme` en génère l'ensemble complet des tokens `--md-sys-color-*`. Quand vous changez le mode clair ou sombre, le contraste ou la variante, toute la palette se met à jour en même temps.

## Couleur dynamique

La couleur source fixe la relation entre la teinte et le ton, et le mappage des tons de Material 3 calcule la luminosité réelle. Une même couleur source donne donc des couleurs lisibles en mode clair comme en mode sombre. La démo ci-dessous génère une palette locale à partir d'une couleur source bleu sarcelle :

<m3e-theme color="#006A6A">
  <div class="swatch-grid">
    <div class="swatch">
      <div class="swatch__color" style="background: var(--md-sys-color-primary)"></div>
      <code>--md-sys-color-primary</code>
    </div>
    <div class="swatch">
      <div class="swatch__color" style="background: var(--md-sys-color-primary-container)"></div>
      <code>--md-sys-color-primary-container</code>
    </div>
    <div class="swatch">
      <div class="swatch__color" style="background: var(--md-sys-color-secondary-container)"></div>
      <code>--md-sys-color-secondary-container</code>
    </div>
    <div class="swatch">
      <div class="swatch__color" style="background: var(--md-sys-color-tertiary)"></div>
      <code>--md-sys-color-tertiary</code>
    </div>
  </div>
</m3e-theme>

La couleur source par défaut du site se définit dans `settings.defaults.color` de la configuration partagée. Les lecteurs peuvent la remplacer par la couleur de leur choix dans les paramètres. Les pages avec un hero utilisent une couleur tirée de l'image ; voir [Hero](/fr-FR/theme/hero).

## Variantes {#variants}

Une même couleur source peut générer une palette de différentes façons. La valeur par défaut est `tonal-spot` :

<div class="demo-row">
  <m3e-chip variant="elevated">Tonal Spot</m3e-chip>
  <m3e-chip>Vibrant</m3e-chip>
  <m3e-chip>Fidelity</m3e-chip>
  <m3e-chip>Expressive</m3e-chip>
  <m3e-chip>Monochrome</m3e-chip>
  <m3e-chip>Neutral</m3e-chip>
  <m3e-chip>Rainbow</m3e-chip>
  <m3e-chip>Fruit Salad</m3e-chip>
</div>

| Variante | Caractère |
| --- | --- |
| `tonal-spot` | Équilibrée et peu saturée ; convient à la plupart des sites de documentation |
| `vibrant` | Une couleur principale plus saturée, pour une identité de marque plus affirmée |
| `fidelity` | Reste plus proche de la couleur source elle-même |
| `expressive` | Des variations de teinte plus vives |
| `monochrome` | Supprime toute dominante colorée et ne garde que des niveaux de luminosité |
| `neutral` | Des couleurs de surface presque neutres |
| `rainbow` | Des écarts de teinte plus grands entre les rôles |
| `fruit-salad` | La séparation des teintes la plus forte ; convient aux démos et aux usages créatifs |

## Clair, sombre et contraste

La même palette, appliquée au mode clair et au mode sombre :

<div class="demo-grid">
  <m3e-theme scheme="light">
    <div class="demo-surface" style="background: var(--md-sys-color-surface-container-low); color: var(--md-sys-color-on-surface);">
      <strong>Mode clair</strong>
      <p>Surfaces claires et texte foncé. Convient à un usage en journée et à la projection.</p>
    </div>
  </m3e-theme>
  <m3e-theme scheme="dark">
    <div class="demo-surface" style="background: var(--md-sys-color-surface-container-low); color: var(--md-sys-color-on-surface);">
      <strong>Mode sombre</strong>
      <p>Surfaces sombres et texte clair. Convient à une faible luminosité et aux longues sessions de lecture.</p>
    </div>
  </m3e-theme>
</div>

Le contraste a trois niveaux : « Par défaut », « Moyen » et « Élevé ». Il agit sur l'écart de luminosité entre le premier plan et l'arrière-plan, et sur l'intensité des contours. Le mode clair et sombre propose quatre options ; voir [Paramètres et apparence](/fr-FR/theme/settings).

## Conseils d'utilisation

- Ne codez pas les couleurs en dur. Utilisez toujours les tokens `--md-sys-color-*` ou les variables des composants m3e.
- Utilisez les couleurs de conteneur et de contenu par paires : `primary` avec `on-primary`, `surface-container` avec `on-surface`.
- Utilisez `surface-container-lowest` à `surface-container-highest` pour séparer les niveaux. Ne comptez pas sur des ombres superposées.
- Utilisez `outline-variant` pour les bordures et les séparateurs, et `outline` quand ils doivent ressortir. Utilisez `error` et `error-container` pour les états d'erreur.
- Quand vous avez besoin d'une couleur de marque fixe, faites-en la couleur source au lieu de la redéfinir composant par composant.
- Vérifiez séparément en mode sombre et en contraste élevé les fonds, les ombres et les voiles translucides personnalisés.

Pour tous les tokens de couleur, voir [API](/fr-FR/styles/color/api).
