<script setup lang="ts">
import { computed, nextTick } from "vue";

import { useM3eConfig } from "../../composables/useM3eConfig";
import { useM3eSettings } from "../../composables/useSettings";
import {
  CONTRAST_OPTIONS,
  CONTRAST_VALUES,
  DIRECTION_OPTIONS,
  DIRECTION_VALUES,
  MOTION_OPTIONS,
  MOTION_VALUES,
  SCHEME_OPTIONS,
  SCHEME_VALUES,
  TEXT_SIZE_OPTIONS,
  TEXT_SIZE_VALUES,
  VARIANT_OPTIONS,
  VARIANT_VALUES,
} from "../../constants";
import type { SettingsSectionKey } from "../../types";
import SettingsSection from "./SettingsSection.vue";

defineOptions({ inheritAttrs: false });

const config = useM3eConfig();
const api = useM3eSettings();
const { settings, sections, labels } = api;

const drawerTitle = computed(() => config.value.settings.title || "设置");

const HEADING_IDS: Record<SettingsSectionKey, string> = {
  color: "m3e-settings-color",
  variant: "m3e-settings-variant",
  scheme: "m3e-settings-scheme",
  contrast: "m3e-settings-contrast",
  motion: "m3e-settings-motion",
  direction: "m3e-settings-direction",
  textSize: "m3e-settings-text-size",
};

interface ValueControl extends EventTarget {
  value?: string | readonly string[] | null;
}

interface SelectableChip extends HTMLElement {
  selected: boolean;
  value: string;
}

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

function stringValue(event: Event): string | undefined {
  const control = event.currentTarget as ValueControl | null;
  const value = control?.value;
  return typeof value === "string" ? value : undefined;
}

function oneOf<T extends string>(
  values: readonly T[],
  value: string | undefined,
): value is T {
  return (
    typeof value === "string" && (values as readonly string[]).includes(value)
  );
}

function onColorChange(event: Event): void {
  const value = (event.currentTarget as HTMLInputElement | null)?.value;

  if (value && HEX_COLOR.test(value)) {
    api.setSetting("color", value.toLowerCase());
  }
}

function syncVariantChips(chipSet: HTMLElement | null): void {
  if (!chipSet) return;

  chipSet.querySelectorAll<SelectableChip>("m3e-filter-chip").forEach((chip) => {
    chip.selected = chip.value === settings.variant;
  });
}

function onVariantChange(event: Event): void {
  const chipSet = event.currentTarget as HTMLElement | null;
  const value = stringValue(event);

  if (oneOf(VARIANT_VALUES, value)) {
    api.setSetting("variant", value);
    return;
  }

  // A single-select filter chip set can be left empty when the active chip is
  // clicked again. Restore the chip matching the current setting.
  void nextTick(() => syncVariantChips(chipSet));
}

function onSchemeChange(event: Event): void {
  const value = stringValue(event);

  if (oneOf(SCHEME_VALUES, value)) {
    api.setSetting("scheme", value);
  }
}

function onContrastChange(event: Event): void {
  const value = stringValue(event);

  if (oneOf(CONTRAST_VALUES, value)) {
    api.setSetting("contrast", value);
  }
}

function onMotionChange(event: Event): void {
  const value = stringValue(event);

  if (oneOf(MOTION_VALUES, value)) {
    api.setSetting("motion", value);
  }
}

function onDirectionChange(event: Event): void {
  const value = stringValue(event);

  if (oneOf(DIRECTION_VALUES, value)) {
    api.setSetting("direction", value);
  }
}

function onTextSizeChange(event: Event): void {
  const value = stringValue(event);

  if (oneOf(TEXT_SIZE_VALUES, value)) {
    api.setSetting("textSize", value);
  }
}
</script>

<template>
  <div
    v-bind="$attrs"
    class="m3e-settings"
    role="complementary"
    :aria-label="drawerTitle"
  >
    <template v-for="section in sections" :key="section">
      <SettingsSection
        v-if="section === 'color'"
        :id="HEADING_IDS.color"
        :label="labels.color"
      >
        <input
          class="m3e-settings__color"
          type="color"
          :value="settings.color"
          :aria-labelledby="HEADING_IDS.color"
          @change="onColorChange"
        />
      </SettingsSection>

      <SettingsSection
        v-else-if="section === 'variant'"
        :id="HEADING_IDS.variant"
        :label="labels.variant"
      >
        <m3e-filter-chip-set
          :aria-labelledby="HEADING_IDS.variant"
          @change="onVariantChange"
        >
          <m3e-filter-chip
            v-for="option in VARIANT_OPTIONS"
            :key="option.value"
            :selected="settings.variant === option.value"
            :value="option.value"
          >{{ option.label }}</m3e-filter-chip>
        </m3e-filter-chip-set>
      </SettingsSection>

      <SettingsSection
        v-else-if="section === 'scheme'"
        :id="HEADING_IDS.scheme"
        :label="labels.scheme"
      >
        <m3e-segmented-button
          :aria-labelledby="HEADING_IDS.scheme"
          @change="onSchemeChange"
        >
          <m3e-button-segment
            v-for="option in SCHEME_OPTIONS"
            :key="option.value"
            :checked="settings.scheme === option.value"
            :value="option.value"
          ><m3e-icon slot="icon" :name="option.icon"></m3e-icon>{{ option.label }}</m3e-button-segment>
        </m3e-segmented-button>
      </SettingsSection>

      <SettingsSection
        v-else-if="section === 'contrast'"
        :id="HEADING_IDS.contrast"
        :label="labels.contrast"
      >
        <m3e-segmented-button
          :aria-labelledby="HEADING_IDS.contrast"
          @change="onContrastChange"
        >
          <m3e-button-segment
            v-for="option in CONTRAST_OPTIONS"
            :key="option.value"
            :checked="settings.contrast === option.value"
            :value="option.value"
          >{{ option.label }}</m3e-button-segment>
        </m3e-segmented-button>
      </SettingsSection>

      <SettingsSection
        v-else-if="section === 'motion'"
        :id="HEADING_IDS.motion"
        :label="labels.motion"
      >
        <m3e-segmented-button
          :aria-labelledby="HEADING_IDS.motion"
          @change="onMotionChange"
        >
          <m3e-button-segment
            v-for="option in MOTION_OPTIONS"
            :key="option.value"
            :checked="settings.motion === option.value"
            :value="option.value"
          >{{ option.label }}</m3e-button-segment>
        </m3e-segmented-button>
      </SettingsSection>

      <SettingsSection
        v-else-if="section === 'direction'"
        :id="HEADING_IDS.direction"
        :label="labels.direction"
      >
        <m3e-segmented-button
          :aria-labelledby="HEADING_IDS.direction"
          @change="onDirectionChange"
        >
          <m3e-button-segment
            v-for="option in DIRECTION_OPTIONS"
            :key="option.value"
            :checked="settings.direction === option.value"
            :value="option.value"
          ><m3e-icon slot="icon" :name="option.icon"></m3e-icon>{{ option.label }}</m3e-button-segment>
        </m3e-segmented-button>
      </SettingsSection>

      <SettingsSection
        v-else-if="section === 'textSize'"
        :id="HEADING_IDS.textSize"
        :label="labels.textSize"
      >
        <m3e-segmented-button
          :aria-labelledby="HEADING_IDS.textSize"
          @change="onTextSizeChange"
        >
          <m3e-button-segment
            v-for="option in TEXT_SIZE_OPTIONS"
            :key="option.value"
            :checked="settings.textSize === option.value"
            :value="option.value"
          >{{ option.label }}</m3e-button-segment>
        </m3e-segmented-button>
      </SettingsSection>
    </template>
  </div>
</template>
