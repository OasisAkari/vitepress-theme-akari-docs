import {
  computed,
  readonly,
  ref,
  shallowRef,
  watch,
  type Ref,
} from "vue";
import { useRoute } from "vitepress";

/** Open state of a dialog that grows out of the button that opened it. */
export interface AkariMorphDialogApi {
  isOpen: Readonly<Ref<boolean>>;
  /** The button the dialog grows out of and returns to. */
  trigger: Readonly<Ref<HTMLElement | null>>;
  open(trigger: HTMLElement): void;
  close(): void;
  /** Called by the dialog once its closing animation has ended. */
  finalizeClose(): void;
}

/**
 * Creates the state of one such dialog. Closing returns focus to whatever
 * had it before, and leaving the page another way (history, a link)
 * dismisses the dialog.
 */
export function createMorphDialog(): AkariMorphDialogApi {
  const route = useRoute();
  const isOpen = ref(false);
  const trigger = shallowRef<HTMLElement | null>(null);
  let previousFocus: HTMLElement | null = null;

  function open(element: HTMLElement): void {
    if (isOpen.value) return;

    const active = document.activeElement;
    previousFocus = active instanceof HTMLElement ? active : null;
    trigger.value = element;
    isOpen.value = true;
  }

  function close(): void {
    isOpen.value = false;
  }

  function finalizeClose(): void {
    const focusTarget = previousFocus?.isConnected
      ? previousFocus
      : trigger.value;
    focusTarget?.focus({ preventScroll: true });
    previousFocus = null;
  }

  watch(() => route.path, close);

  return {
    isOpen: readonly(isOpen),
    trigger: computed(() => trigger.value),
    open,
    close,
    finalizeClose,
  };
}
