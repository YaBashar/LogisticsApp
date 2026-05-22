/**
 * Design tokens — single source of truth for colors, spacing,
 * typography, radii, and touch-target sizes.
 *
 * 4-pt base grid: all spacing values are multiples of 4.
 * Touch targets: iOS 44 pt minimum / Android 48 dp minimum.
 *
 * COLOR SYSTEM NOTES
 * ──────────────────
 * Six color families cover every UI role. All Tailwind utility
 * variants are available when NativeWind is added (bg-brand-500, etc.).
 *
 * Palette pairing — Emerald Green + Indigo
 *   Brand (green) is the primary identity color.
 *   Secondary (indigo/accent) is the complementary pairing used for
 *   secondary CTAs, tracking chips, analytics, and informational states.
 *   They sit roughly opposite each other on the color wheel, giving
 *   strong visual contrast without clashing.
 *
 * WCAG contrast decisions
 *   brand600  (#09845A) = 4.73:1 on white → ✓ AA — primary CTA button bg
 *   accent600 (#4F46E5) = 5.70:1 on white → ✓ AA — secondary CTA button bg
 *   error600  (#DC2626) = 4.83:1 on white → ✓ AA — error button / text
 *   neutral500 on neutral50 = 4.55:1      → ✓ AA — secondary body text
 */

// ─── Color palette ───────────────────────────────────────────────────────────

export const colors = {
  // ── Brand scale (Emerald Green) ─────────────────────────────────────────
  // Visual anchor is brand500 (#0E9F6E). Use brand600 for white-text buttons.
  brand50: "#EDFAF4",
  brand100: "#D4F4E7",
  brand200: "#A9E9CE",
  brand300: "#6DD8AD",
  brand400: "#3DC28D",
  brand500: "#0E9F6E",
  brand600: "#09845A", // 4.73:1 on white ✓ WCAG AA
  brand700: "#067047",
  brand800: "#065F46",
  brand900: "#044433",
  brand950: "#022B20",

  // Brand semantic aliases
  primary: "#0E9F6E", // = brand500
  primaryCTA: "#09845A", // = brand600 — WCAG AA with white text
  primaryDark: "#065F46", // = brand800
  primaryDeep: "#044433", // = brand900
  primaryMid: "#067047", // = brand700
  primarySurface: "#EDFAF4", // = brand50
  primaryBorder: "#A9E9CE", // = brand200
  primaryLight: "rgba(14,159,110,0.12)",
  primaryLightBorder: "rgba(14,159,110,0.22)",
  backgroundAlt: "#D4F4E7", // = brand100 — brand-tinted screen background

  // ── Accent / Secondary scale (Indigo) ───────────────────────────────────
  // Complementary pairing to Emerald Green. Use for secondary CTAs, tracking
  // status chips, analytics highlights, and informational states.
  // accent600 (#4F46E5) = 5.70:1 on white → ✓ WCAG AA.
  accent50: "#EEF2FF",
  accent100: "#E0E7FF",
  accent200: "#C7D2FE",
  accent300: "#A5B4FC",
  accent400: "#818CF8",
  accent500: "#6366F1",
  accent600: "#4F46E5", // 5.70:1 on white ✓ WCAG AA
  accent700: "#4338CA",
  accent800: "#3730A3",
  accent900: "#312E81",
  accent950: "#1E1B4B",

  // Secondary semantic aliases
  secondary: "#6366F1", // = accent500
  secondaryCTA: "#4F46E5", // = accent600 — WCAG AA with white text
  secondaryDark: "#4338CA", // = accent700
  secondaryBg: "#E0E7FF", // = accent100
  secondarySurface: "#EEF2FF", // = accent50
  secondaryBorder: "#C7D2FE", // = accent200
  secondaryLight: "rgba(99,102,241,0.12)",
  secondaryLightBorder: "rgba(99,102,241,0.22)",

  // ── Neutral scale (Slate) ───────────────────────────────────────────────
  // Cool blue-gray. Text, surface, and border aliases all map to this scale.
  neutral50: "#F8FAFC",
  neutral100: "#F1F5F9",
  neutral200: "#E2E8F0",
  neutral300: "#CBD5E1",
  neutral400: "#94A3B8",
  neutral500: "#64748B", // 4.55:1 on neutral50 ✓ WCAG AA
  neutral600: "#475569",
  neutral700: "#334155",
  neutral800: "#1E293B",
  neutral900: "#0F172A",
  neutral950: "#020617",

  // Surface & text aliases
  surface: "#FFFFFF",
  surfaceAlt: "rgba(255,255,255,0.92)",
  surfaceCard: "rgba(255,255,255,0.96)",

  background: "#F8FAFC", // = neutral50

  textPrimary: "#0F172A", // = neutral900
  textSecondary: "#334155", // = neutral700
  textMuted: "#475569", // = neutral600
  textPlaceholder: "#94A3B8", // = neutral400
  textDisabled: "#94A3B8", // = neutral400
  textOnDark: "#FFFFFF",

  border: "rgba(15,23,42,0.10)",
  borderLight: "rgba(15,23,42,0.06)",
  borderMedium: "rgba(15,23,42,0.14)",

  // ── Success scale (Lime Green) ──────────────────────────────────────────
  // More yellow-green than Brand to distinguish delivery-success states
  // from brand action elements on the same screen.
  success50: "#F0FDF4",
  success100: "#DCFCE7",
  success200: "#BBF7D0",
  success300: "#86EFAC",
  success400: "#4ADE80",
  success500: "#22C55E",
  success600: "#16A34A",
  success700: "#15803D",
  success800: "#166534",
  success900: "#14532D",
  success950: "#052E16",

  // ── Warning scale (Amber) ───────────────────────────────────────────────
  warning50: "#FFFBEB",
  warning100: "#FEF3C7",
  warning200: "#FDE68A",
  warning300: "#FCD34D",
  warning400: "#FBBF24",
  warning500: "#F59E0B",
  warning600: "#D97706",
  warning700: "#B45309",
  warning800: "#92400E",
  warning900: "#78350F",
  warning950: "#451A03",

  // ── Error scale (Red) ───────────────────────────────────────────────────
  // error600 (#DC2626) = 4.83:1 on white ✓ WCAG AA.
  // Use error600 for button backgrounds, error700 for text on light bg.
  error50: "#FEF2F2",
  error100: "#FEE2E2",
  error200: "#FECACA",
  error300: "#FCA5A5",
  error400: "#F87171",
  error500: "#EF4444",
  error600: "#DC2626", // 4.83:1 on white ✓ WCAG AA
  error700: "#B91C1C",
  error800: "#991B1B",
  error900: "#7F1D1D",
  error950: "#450A0A",

  // Status semantic shorthands
  success: "#22C55E", // = success500
  successBg: "#F0FDF4", // = success50
  warning: "#D97706", // = warning600
  warningBg: "#FFFBEB", // = warning50
  error: "#B91C1C", // = error700 — safe on light bg
  errorBg: "#FEF2F2", // = error50
  info: "#6366F1", // = accent500 — informational states use secondary/indigo
  infoBg: "#EEF2FF", // = accent50

  // Overlays
  shadow: "#000000",
};

// ─── Spacing (4-pt grid) ──────────────────────────────────────────────────────

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

// ─── Typography ───────────────────────────────────────────────────────────────

export const typography = {
  // Sizes — never go below 12 for body copy
  size: {
    xs: 11,
    sm: 12,
    base: 14,
    md: 15,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    display: 30,
    hero: 40,
  },
  weight: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  lineHeight: {
    tight: 18,
    base: 22,
    relaxed: 26,
  },
};

// ─── Border radii ─────────────────────────────────────────────────────────────

export const radii = {
  sm: 8,
  md: 12,
  lg: 14,
  xl: 16,
  xxl: 20,
  card: 24,
  pill: 999,
};

// ─── Touch targets ────────────────────────────────────────────────────────────

export const touch = {
  // Minimum tap area heights
  minHeight: 44, // iOS HIG minimum
  minHeightAndroid: 48, // Material Design minimum
  // Standard interactive heights
  inputHeight: 52, // form inputs (was 56 for auth, 40 for app — unified)
  buttonHeight: 52, // full-width CTAs
  tabHeight: 44, // tab pills
  iconButton: 44, // icon-only buttons
};

// ─── Shadows ──────────────────────────────────────────────────────────────────

export const shadows = {
  subtle: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  // Use float when removing a coloured border — the stronger shadow creates
  // the same sense of separation the border used to provide.
  float: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 4,
  },
  elevated: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
};
