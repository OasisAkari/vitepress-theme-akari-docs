---
tab: API
---

# Couleur : API

`m3e-theme` génère les tokens suivants selon la spécification de couleur dynamique de Material 3 (version 2025). Utilisez-les dans le CSS :

```css
.panel {
  background: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-on-surface);
  border: 1px solid var(--md-sys-color-outline-variant);
}
```

Les tokens n'ont de valeur qu'à l'intérieur de `m3e-theme`. Le thème les copie sur l'élément racine, vous pouvez donc les utiliser partout dans la page.

## Couleurs d'accent

| Token | Usage |
| --- | --- |
| `--md-sys-color-primary`, `--md-sys-color-on-primary` | Les actions les plus importantes et le texte qu'elles portent |
| `--md-sys-color-primary-container`, `--md-sys-color-on-primary-container` | Les conteneurs qui doivent ressortir, mais moins fortement |
| `--md-sys-color-primary-dim` | Une couleur principale plus foncée |
| `--md-sys-color-inverse-primary` | La couleur principale sur les surfaces inversées |
| `--md-sys-color-secondary`, `--md-sys-color-on-secondary` | Mise en valeur secondaire |
| `--md-sys-color-secondary-container`, `--md-sys-color-on-secondary-container` | Conteneurs secondaires, comme l'élément de navigation sélectionné et les boutons d'action flottants |
| `--md-sys-color-secondary-dim` | Une couleur secondaire plus foncée |
| `--md-sys-color-tertiary`, `--md-sys-color-on-tertiary` | Mise en valeur qui contraste avec la couleur principale |
| `--md-sys-color-tertiary-container`, `--md-sys-color-on-tertiary-container` | Conteneurs tertiaires |
| `--md-sys-color-tertiary-dim` | Une couleur tertiaire plus foncée |

Chaque couleur d'accent a aussi des couleurs fixes, qui ne changent pas entre le mode clair et le mode sombre : `*-fixed`, `*-fixed-dim`, `on-*-fixed` et `on-*-fixed-variant` (où `*` vaut `primary`, `secondary` ou `tertiary`).

## Surfaces

| Token | Usage |
| --- | --- |
| `--md-sys-color-surface`, `--md-sys-color-on-surface` | La surface et le texte par défaut ; la surface du document utilise `surface` |
| `--md-sys-color-surface-dim`, `--md-sys-color-surface-bright` | La surface la plus sombre et la surface la plus claire |
| `--md-sys-color-surface-container-lowest` | Le conteneur le plus bas |
| `--md-sys-color-surface-container-low` | Un conteneur bas, comme les zones de démo |
| `--md-sys-color-surface-container` | Le conteneur par défaut, comme la carte de texte du hero et les en-têtes de tableau |
| `--md-sys-color-surface-container-high` | Un conteneur haut |
| `--md-sys-color-surface-container-highest` | Le conteneur le plus haut |
| `--md-sys-color-on-surface-variant` | Texte secondaire, comme les légendes et le texte des en-têtes de tableau |
| `--md-sys-color-surface-variant` | Une surface secondaire |
| `--md-sys-color-inverse-surface`, `--md-sys-color-inverse-on-surface` | Surface et texte inversés, comme la snackbar |
| `--md-sys-color-background`, `--md-sys-color-on-background` | Fond et texte de la page |
| `--md-sys-color-surface-tint` | Teinte de surface |

## Contour, erreur et voile

| Token | Usage |
| --- | --- |
| `--md-sys-color-outline` | Les bordures qui doivent ressortir |
| `--md-sys-color-outline-variant` | Les séparateurs et les bordures ordinaires, comme les bordures de tableau |
| `--md-sys-color-error`, `--md-sys-color-on-error` | Les erreurs |
| `--md-sys-color-error-container`, `--md-sys-color-on-error-container` | Les conteneurs d'erreur |
| `--md-sys-color-error-dim` | Une couleur d'erreur plus foncée |
| `--md-sys-color-shadow` | Les ombres |
| `--md-sys-color-scrim` | Le voile (scrim) derrière les boîtes de dialogue |

## Palettes locales

Entourez un contenu de la page avec `m3e-theme` pour lui générer une palette distincte. Les démos de la vue d'ensemble [Couleur](/fr-FR/styles/color) font exactement cela :

```html
<m3e-theme color="#006A6A" scheme="dark" variant="vibrant" contrast="high">
  <!-- Contenu -->
</m3e-theme>
```

| Attribut | Valeurs |
| --- | --- |
| `color` | La couleur source, en valeur hexadécimale à six chiffres |
| `scheme` | `light`, `dark`, `auto` |
| `variant` | Voir [Variantes](/fr-FR/styles/color#variants) |
| `contrast` | `standard`, `medium`, `high` |
| `motion` | `standard`, `expressive` |

Les paramètres déterminent la couleur source, la variante et le contraste de tout le site ; voir [Paramètres et apparence](/fr-FR/theme/settings/api#akarithemesettings).
