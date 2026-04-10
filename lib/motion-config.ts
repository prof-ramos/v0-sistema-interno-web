/**
 * ASOF Motion Config
 * Consolidates the official motion tokens from brand guidelines
 */

export type Duration = number
export type CubicBezier = [number, number, number, number]
export type Easing = CubicBezier | string

export interface Transition {
  duration: Duration
  ease: Easing
}

/**
 * Restricted properties for motion animations.
 * Allows common Framer Motion properties with strict types.
 */
export interface MotionTarget {
  x?: number | string
  y?: number | string
  scale?: number
  rotate?: number | string
  opacity?: number
}

export interface AnimationDefinition {
  whileHover?: MotionTarget
  whileTap?: MotionTarget
  transition: Transition
}

export const DURATIONS: Record<'fast' | 'normal' | 'elegant', Duration> = {
  fast: 0.15,    // 150ms
  normal: 0.4,   // 400ms
  elegant: 0.8,  // 800ms
}

export const EASINGS: Record<'elegant' | 'easeOut' | 'easeIn' | 'linear', Easing> = {
  elegant: [0.22, 1, 0.36, 1],
  easeOut: "easeOut",
  easeIn: "easeIn",
  linear: "linear",
}

export const TRANSITIONS: Record<'elegant' | 'fast', Transition> = {
  /**
   * Elegant transition (800ms).
   * Intentional longer duration to reflect the solemnity and institutional weight of ASOF.
   */
  elegant: {
    duration: DURATIONS.elegant,
    ease: EASINGS.elegant,
  },
  fast: {
    duration: DURATIONS.fast,
    ease: EASINGS.easeOut,
  },
}

export const ANIMATIONS: Record<'lift' | 'scale', AnimationDefinition> = {
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
