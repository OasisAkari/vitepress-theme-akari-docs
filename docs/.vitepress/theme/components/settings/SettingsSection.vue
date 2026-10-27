<script setup lang="ts">
defineProps<{ id: string; label: string }>();
</script>

<template>
  <section class="m3e-settings__section">
    <m3e-heading :id="id" variant="label" size="large">{{ label }}</m3e-heading>
    <slot />
  </section>
</template>
