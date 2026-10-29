---
tab: API
---

# Paramètres et apparence : API

## settings

| Champ | Type | Par défaut | Description |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Présence ou non de la boîte de dialogue des paramètres ; avec `false`, le bouton en forme d'engrenage est aussi masqué |
| `showSchemeToggle` | `boolean` | `true` | Afficher ou non le bouton d'apparence ; indépendant de `enabled` |
| `title` | `string` | Selon la langue : « Paramètres » | Titre de la boîte de dialogue des paramètres |
| `sections` | `SettingsSectionKey[]` | Les six | Les options à afficher, et dans quel ordre |
| `labels` | `Partial<Record<SettingsSectionKey, string>>` | Selon la langue | Remplace le titre de certaines options |
| `defaults` | `Partial<AkariThemeSettings>` | Voir le tableau ci-dessous | L'apparence que voit chaque lecteur lors de sa première visite |
| `persist` | `boolean` | `true` | Écrire ou non les choix du lecteur dans `localStorage` |
| `storageKey` | `string` | `"akari-docs-settings"` | Nom de la clé dans `localStorage` |

`appBar.showSettingsToggle: false` masque seulement le bouton en forme d'engrenage. La fonction de paramètres elle-même reste disponible (un composant personnalisé peut par exemple l'ouvrir).

```ts
settings: {
  sections: ["color", "textSize"],
  labels: { textSize: "Taille du corps de texte" },
  defaults: { color: "#0b57d0", scheme: "time" },
},
```

Les entrées invalides de `sections` sont filtrées, et seule la première occurrence d'un doublon est conservée. Si le résultat est vide, les six options sont affichées.

## AkariThemeSettings

| Champ | Clé d'option | Valeurs | Par défaut |
| --- | --- | --- | --- |
| `color` | `color` | Couleur hexadécimale à six chiffres | `"#6750A4"` |
| `variant` | `variant` | `tonal-spot`, `vibrant`, `fidelity`, `expressive`, `monochrome`, `neutral`, `rainbow`, `fruit-salad` | `"tonal-spot"` |
| `scheme` | Bouton d'apparence | `auto`, `light`, `dark`, `time` | `"auto"` |
| `contrast` | `contrast` | `standard`, `medium`, `high` | `"standard"` |
| `motion` | `motion` | `standard`, `expressive` | `"expressive"` |
| `direction` | `direction` | `auto`, `ltr`, `rtl` | `"auto"` |
| `textSize` | `textSize` | `16px`, `24px`, `32px` (affichées 100%, 150%, 200%) | `"16px"` |

## akariHead et le mode clair ou sombre

`head: akariHead()` dans `.vitepress/config.mts` inclut un script qui applique le mode clair ou sombre avant que la première image ne soit peinte. Si vous modifiez `storageKey` ou `defaults.scheme`, passez-lui les mêmes valeurs :

```ts
head: akariHead({ storageKey: "my-docs", defaultScheme: "time" }),
```

Gardez aussi `appearance: false`, pour que le thème soit seul à gérer `html.dark`.

## Format de stockage

`localStorage[storageKey]` contient un objet JSON avec les mêmes champs que `AkariThemeSettings` :

```json
{
  "color": "#6750A4",
  "variant": "tonal-spot",
  "scheme": "dark",
  "contrast": "standard",
  "motion": "expressive",
  "direction": "auto",
  "textSize": "16px"
}
```

Chaque champ manquant ou invalide revient à sa valeur par défaut, indépendamment des autres.

## useAkariSettings

```ts
import { useAkariSettings } from "@theme";

const { settings, setSetting, reset, isDefault } = useAkariSettings();
setSetting("textSize", "24px");
```

| Valeur renvoyée | Description |
| --- | --- |
| `settings` | Les paramètres courants, sous forme d'objet réactif |
| `setSetting(key, value)` | Modifie un paramètre ; quand `persist` vaut true, l'écrit aussi dans `localStorage` |
| `reset()` | Rétablit les valeurs par défaut |
| `isDefault()` | Indique si chaque paramètre courant est égal à sa valeur par défaut |
| `defaults` | Les valeurs par défaut fusionnées |
| `sections`, `labels` | La liste résolue des options et leurs titres |

## useAkariColorScheme

```ts
import { useAkariColorScheme } from "@theme";

const { mode, resolved, cycle } = useAkariColorScheme();
```

| Valeur renvoyée | Type | Description |
| --- | --- | --- |
| `mode` | `ComputedRef<"auto" \| "light" \| "dark" \| "time">` | Le mode choisi par le lecteur |
| `resolved` | `Ref<"light" \| "dark" \| null>` | Indique si la page s'affiche réellement en clair ou en sombre ; `null` tant qu'elle n'est pas montée dans le navigateur |
| `cycle()` | `() => void` | Passe au mode suivant : Système → Clair → Sombre → Selon l'heure → Système |

N'appelez ces deux fonctions que depuis des composants situés dans la mise en page.

## Remplacer le panneau des paramètres

Vous pouvez remplacer le panneau de la boîte de dialogue des paramètres par votre propre composant (emplacement `Settings`). Le titre, le bouton de fermeture et l'animation restent fournis par la boîte de dialogue. Voir [Étendre le thème](/fr-FR/theme/extending/api#provideakaricomponents).
