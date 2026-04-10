/**
 * ASOF Motion Config
 * Consolidates the official motion tokens from brand guidelines
 */

export const DURATIONS = {
  fast: 0.15,    // 150ms
  normal: 0.4,   // 400ms
  elegant: 0.8,  // 800ms
}

export const EASINGS = {
  elegant: [0.22, 1, 0.36, 1], // cubic-bezier
}

export const TRANSITIONS = {
  elegant: {
    duration: DURATIONS.normal,
    ease: EASINGS.elegant,
  },
  fast: {
    duration: DURATIONS.fast,
    ease: "easeOut",
  },
}

export const ANIMATIONS = {
  lift: {
    whileHover: { y: -4 },
    transition: TRANSITIONS.elegant,
  },
  scale: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: TRANSITIONS.fast,
  },
}
