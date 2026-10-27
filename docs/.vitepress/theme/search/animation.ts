import type { M3eMotionScheme } from "../types";

export interface MorphRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface MorphTransform {
  transform: string;
  scaleX: number;
  scaleY: number;
  translateX: number;
  translateY: number;
}

export interface SearchMotionPreset {
  duration: number;
  easing: string;
  contentDuration: number;
  scrimDuration: number;
}

const MIN_SCALE = 0.02;

export function computeMorphTransform(
  origin: MorphRect,
  target: MorphRect,
): MorphTransform {
  const targetWidth = Math.max(target.width, 1);
  const targetHeight = Math.max(target.height, 1);
  const scaleX = Math.max(origin.width / targetWidth, MIN_SCALE);
  const scaleY = Math.max(origin.height / targetHeight, MIN_SCALE);
  const translateX = origin.left - target.left;
  const translateY = origin.top - target.top;

  return {
    transform: `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`,
    scaleX,
    scaleY,
    translateX,
    translateY,
  };
}

export function getSearchMotionPreset(
  motion: M3eMotionScheme,
): SearchMotionPreset {
  if (motion === "expressive") {
    return {
      duration: 500,
      easing: "cubic-bezier(0.38, 1.21, 0.22, 1)",
      contentDuration: 180,
      scrimDuration: 320,
    };
  }

  return {
    duration: 300,
    easing: "cubic-bezier(0.2, 0, 0, 1)",
    contentDuration: 140,
    scrimDuration: 240,
  };
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
