---
icon: settings
order: 4
tab: Vue d'ensemble
parallel:
  - api
  - details
---

# Paramètres et apparence

Les lecteurs peuvent ajuster l'apparence des pages. Le bouton d'apparence rond en bas du rail (en bas du tiroir de navigation sur écran étroit) fait passer du mode clair au mode sombre, et le bouton en forme d'engrenage de la barre d'application ouvre les paramètres. Ces options ne s'appliquent qu'au navigateur du lecteur. Elles sont enregistrées dans `localStorage` et n'affectent pas les autres visiteurs.

## Mode clair et mode sombre

Chaque appui sur le bouton passe au mode suivant, et une snackbar apparaît en bas de l'écran, par exemple « Thème changé : Sombre ».

| Mode | Icône | Effet |
| --- | --- | --- |
| Système | `brightness_auto` | Suit le réglage clair ou sombre du système (par défaut) |
| Clair | `light_mode` | Toujours clair |
| Sombre | `dark_mode` | Toujours sombre |
| Selon l'heure | `schedule` | Sombre de 19 h à 7 h le lendemain, clair le reste du temps |

Dans les modes « Système » et « Selon l'heure », la snackbar indique aussi si la page est actuellement claire ou sombre, par exemple « Thème changé : Système (Sombre) ».

## Paramètres

La boîte de dialogue des paramètres qu'ouvre le bouton en forme d'engrenage propose six groupes d'options. Les changements s'appliquent immédiatement :

| Option | Contenu |
| --- | --- |
| Couleur | La couleur source du thème |
| Variante | La façon dont la palette est générée à partir de la couleur source, par exemple Tonal Spot ou Vibrant |
| Contraste | Par défaut, Moyen, Élevé |
| Animations | Standard, Expressif |
| Sens du texte | Selon la langue, De gauche à droite, De droite à gauche |
| Taille du texte | 100%, 150%, 200% |

<div class="demo-surface">
  <div class="demo-stack">
    <div class="demo-row">
      <strong>Variante</strong>
      <m3e-filter-chip-set aria-label="Exemple de variante">
        <m3e-filter-chip selected value="tonal-spot">Tonal Spot</m3e-filter-chip>
        <m3e-filter-chip value="vibrant">Vibrant</m3e-filter-chip>
        <m3e-filter-chip value="expressive">Expressive</m3e-filter-chip>
        <m3e-filter-chip value="monochrome">Monochrome</m3e-filter-chip>
      </m3e-filter-chip-set>
    </div>
    <div class="demo-row">
      <strong>Persistance</strong>
      <m3e-switch id="settings-demo-persist" checked aria-label="Exemple de persistance"></m3e-switch>
      <span>Enregistrer dans ce navigateur</span>
    </div>
  </div>
</div>

Ces contrôles ne sont qu'une démo visuelle. Les modifier ne change pas le thème.

Les pages avec un hero utilisent plutôt une couleur tirée de l'image. Quand vous quittez la page, la couleur des paramètres revient.

## Apparence par défaut du site

Les choix d'un lecteur ne sont enregistrés que dans son propre navigateur. Pour changer ce que chacun voit lors de sa première visite, définissez des valeurs par défaut dans la configuration partagée :

```ts
// docs/config.ts
settings: {
  defaults: {
    color: "#6750A4",
    scheme: "auto",
    motion: "expressive",
  },
},
```

Vous pouvez aussi n'afficher qu'une partie des options, ou masquer le bouton d'apparence. Voir l'[API](/fr-FR/theme/settings/api). Pour la façon dont le mode clair ou sombre s'applique avant la première image, et pour l'endroit où chaque option s'applique, voir les [Détails](/fr-FR/theme/settings/details).
