/** Resolves once the client-side m3e components are registered. */
export function whenAkariReady(): Promise<void> {
  if (document.documentElement.hasAttribute("data-akari-ready")) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    window.addEventListener("akari-ready", () => resolve(), { once: true });
  });
}

/** Resolves after the browser has laid out and painted the current state. */
export function nextLayoutFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}
