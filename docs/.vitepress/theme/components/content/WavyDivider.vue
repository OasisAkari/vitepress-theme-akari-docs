<template>
  <div class="akari-wavy-divider" role="separator"></div>
</template>

<style scoped>
/*
 * M3 Expressive wavy divider. The wave is a mask over the theme color, so it
 * follows the active palette; one 32px period tiles across any width.
 */
.akari-wavy-divider {
  flex: none;
  height: 8px;
  background-color: var(
    --akari-wavy-divider-color,
    var(--md-sys-color-outline-variant)
  );
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='8'%3E%3Cpath d='M0 4c5.333 4.667 10.667 4.667 16 0s10.667-4.667 16 0' fill='none' stroke='black' stroke-width='1.5'/%3E%3C/svg%3E")
    left center / 32px 8px repeat-x;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='8'%3E%3Cpath d='M0 4c5.333 4.667 10.667 4.667 16 0s10.667-4.667 16 0' fill='none' stroke='black' stroke-width='1.5'/%3E%3C/svg%3E")
    left center / 32px 8px repeat-x;
}

@media (forced-colors: active) {
  .akari-wavy-divider {
    background-color: CanvasText;
  }
}
</style>
