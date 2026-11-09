/**
 * Android System Haptic Feedback Utility
 * Mimics Android 14/15 Material You tactile vibration effects via navigator.vibrate
 */

export type AndroidHapticType =
  | 'addToCart'
  | 'purchaseSuccess'
  | 'biometricScan'
  | 'lightTick'
  | 'mediumTick'
  | 'heavyClick'
  | 'selection'
  | 'error';

/**
 * Millisecond vibration timings tuned to match Android system vibration effects
 */
export const ANDROID_HAPTIC_PATTERNS: Record<AndroidHapticType, number | number[]> = {
  // Crisp double-tap pulse on item addition
  addToCart: [22, 45, 18],

  // Distinct rich success melody when completing checkout or order confirmation
  purchaseSuccess: [45, 60, 30, 45, 65],

  // Subtle rhythmic pulse mimicking Android Keystore fingerprint / face verify
  biometricScan: [30, 50, 30],

  // Light click for bottom navigation tabs and story taps
  lightTick: 12,

  // Medium tap for quantity steppers, sliders and checkboxes
  mediumTick: 20,

  // Firm tap for primary CTAs and long-presses
  heavyClick: [35, 40, 35],

  // Barely perceptible micro-tick for category selectors and switches
  selection: 8,

  // Triple warning buzz on invalid input or payment failure
  error: [60, 40, 60, 40, 80],
};

/**
 * Triggers a vibration pattern on the device mimicking Android system haptics.
 * Safely guards against missing navigator.vibrate or restricted iframe permissions.
 *
 * @param type Named Android haptic effect, a raw duration in ms, or custom timing pattern array
 * @returns boolean indicating whether vibration was accepted by the browser
 */
export function triggerAndroidHaptic(
  type: AndroidHapticType | number | number[] = 'lightTick'
): boolean {
  if (typeof window === 'undefined') return false;

  const pattern =
    typeof type === 'string'
      ? ANDROID_HAPTIC_PATTERNS[type] ?? ANDROID_HAPTIC_PATTERNS.lightTick
      : type;

  if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
    try {
      return navigator.vibrate(pattern);
    } catch (err) {
      // Silently fall back if iframe sandboxing or browser policy blocks hardware vibration
      return false;
    }
  }

  return false;
}

/**
 * Convenience helper specifically for adding items to cart
 */
export function hapticAddToCart() {
  return triggerAndroidHaptic('addToCart');
}

/**
 * Convenience helper specifically for completing purchase
 */
export function hapticPurchaseSuccess() {
  return triggerAndroidHaptic('purchaseSuccess');
}
