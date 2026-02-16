/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

/** Paleta base del diseño (milibroapp) */
export const Palette = {
  black: "#000000",
  white: "#FFFFFF",
  primary: "#30046D",
} as const;

const tintColorLight = Palette.primary;
const tintColorDark = "#8B5CF6";

export const Colors = {
  light: {
    // Texto - Jerarquía visual (WCAG AA compliant)
    text: "#0F172A", // Texto principal - máximo contraste
    textSecondary: "#475569", // Texto secundario
    textTertiary: "#64748B", // Texto terciario/muted
    textInverse: Palette.white, // Texto sobre fondos oscuros

    // Fondos - Jerarquía de superficies
    background: "#F8FAFC", // Fondo principal
    surface: Palette.white, // Superficie elevada (cards, modals)
    surfaceSecondary: "#F1F5F9", // Superficie secundaria
    overlay: "rgba(15, 4, 109, 0.5)", // Overlay para modals/dialogs

    // Bordes y divisores
    border: "#E2E8F0", // Borde estándar
    borderFocus: Palette.primary, // Borde en focus
    divider: "#E2E8F0", // Divisor entre elementos

    // Primary - Color principal (paleta milibroapp)
    primary: Palette.primary, // Primary base
    primaryLight: "#4C1A8A", // Primary hover
    primaryDark: "#1F0338", // Primary active/pressed
    primaryMuted: "#E8E0F5", // Primary background suave
    onPrimary: Palette.white, // Texto sobre primary

    // Estados interactivos
    hover: "rgba(48, 4, 109, 0.08)", // Hover state
    active: "rgba(48, 4, 109, 0.12)", // Active/pressed state
    disabled: "#CBD5E1", // Elemento deshabilitado
    disabledText: "#94A3B8", // Texto deshabilitado

    // Colores semánticos
    success: "#16A34A",
    successLight: "#DCFCE7",
    onSuccess: Palette.white,
    warning: "#D97706",
    warningLight: "#FEF3C7",
    onWarning: Palette.white,
    danger: "#DC2626",
    dangerLight: "#FEE2E2",
    onDanger: Palette.white,
    info: "#2563EB",
    infoLight: "#DBEAFE",
    onInfo: Palette.white,

    // ALPHA Bookstore - coral
    coral: "#E07C5C",
    coralDark: "#C96A4A",

    // Compat template
    tint: tintColorLight,
    icon: "#64748B",
    tabIconDefault: "#94A3B8",
    tabIconSelected: tintColorLight,
  },
  dark: {
    // Texto - Jerarquía visual (WCAG AA compliant)
    text: "#F1F5F9", // Texto principal
    textSecondary: "#CBD5E1", // Texto secundario
    textTertiary: "#94A3B8", // Texto terciario/muted
    textInverse: "#0F172A", // Texto sobre fondos claros

    // Fondos - Jerarquía de superficies
    background: "#0F0B1A", // Fondo principal
    surface: "#1A0F2E", // Superficie elevada (cards, modals)
    surfaceSecondary: "#24193D", // Superficie secundaria
    overlay: "rgba(0, 0, 0, 0.7)", // Overlay para modals/dialogs

    // Bordes y divisores
    border: "#2D1B3D", // Borde estándar
    borderFocus: "#8B5CF6", // Borde en focus
    divider: "#2D1B3D", // Divisor entre elementos

    // Primary - Color principal basado en #30046D
    primary: "#8B5CF6", // Primary base (más claro para contraste)
    primaryLight: "#A78BFA", // Primary hover
    primaryDark: "#7C3AED", // Primary active/pressed
    primaryMuted: "rgba(139, 92, 246, 0.15)", // Primary background suave
    onPrimary: Palette.white, // Texto sobre primary

    // Estados interactivos
    hover: "rgba(139, 92, 246, 0.12)", // Hover state
    active: "rgba(139, 92, 246, 0.20)", // Active/pressed state
    disabled: "#374151", // Elemento deshabilitado
    disabledText: "#6B7280", // Texto deshabilitado

    // Colores semánticos
    success: "#22C55E",
    successLight: "rgba(34, 197, 94, 0.15)",
    onSuccess: Palette.white,
    warning: "#F59E0B",
    warningLight: "rgba(245, 158, 11, 0.15)",
    onWarning: Palette.white,
    danger: "#F87171",
    dangerLight: "rgba(248, 113, 113, 0.15)",
    onDanger: Palette.white,
    info: "#60A5FA",
    infoLight: "rgba(96, 165, 250, 0.15)",
    onInfo: Palette.white,

    // ALPHA Bookstore - coral
    coral: "#E07C5C",
    coralDark: "#C96A4A",

    // Compat template
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
