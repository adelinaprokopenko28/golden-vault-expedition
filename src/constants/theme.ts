/**
 * CASINO_GOLD preset (design-system) + the two project accent overrides
 * (torch bronze, danger) required by the design document.
 */
export const theme = {
  name: 'CASINO_GOLD',
  colors: {
    bg: '#0B0B0F',
    bgDeep: '#07070A',
    surface: '#141418',
    surfaceElevated: '#1C1C24',
    surfaceWarm: '#1E1A14',
    panel: '#17171C',
    recess: '#101014',
    gold: '#D4AF37',
    goldLight: '#F5D77A',
    goldDark: '#B8912A',
    bronze: '#C9792B',
    bronzeLight: '#E8A85C',
    danger: '#E0523A',
    safe: '#7FB069',
    textPrimary: '#F5F0E2',
    textSecondary: '#A79C86',
    textMuted: '#6B6252',
    textFaint: '#4E4738',
    hairline: '#2A2A33',
    rail: '#22222B',
    onGold: '#1A1408',
  },
  border: {
    gold: 'rgba(212,175,55,0.22)',
    goldStrong: 'rgba(212,175,55,0.35)',
    goldSoft: 'rgba(212,175,55,0.14)',
    highlight: 'rgba(255,255,255,0.07)',
    danger: 'rgba(224,82,58,0.40)',
    bronze: 'rgba(201,121,43,0.45)',
  },
  fill: {
    goldSoft: 'rgba(212,175,55,0.10)',
    bronzeSoft: 'rgba(201,121,43,0.14)',
    dangerSoft: 'rgba(224,82,58,0.12)',
  },
  gradients: {
    metal: ['#23232C', '#15151A'] as string[],
    metalWarm: ['#262019', '#17130E'] as string[],
    recess: ['#15151A', '#0D0D11'] as string[],
    gold: ['#F5D77A', '#D4AF37', '#B8912A'] as string[],
    goldDim: ['#5A5340', '#3A3528', '#2A2620'] as string[],
    progress: ['#C9792B', '#D4AF37', '#F5D77A'] as string[],
  },
  radius: {sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, sheet: 28},
  space: {xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32},
  shadow: {
    plate: {
      shadowColor: '#000',
      shadowOpacity: 0.5,
      shadowRadius: 12,
      shadowOffset: {width: 0, height: 6},
      elevation: 8,
    },
    gold: {
      shadowColor: '#D4AF37',
      shadowOpacity: 0.35,
      shadowRadius: 16,
      shadowOffset: {width: 0, height: 6},
      elevation: 10,
    },
  },
  type: {
    hero: {fontSize: 30, fontWeight: '800' as const, letterSpacing: 3},
    title: {fontSize: 22, fontWeight: '800' as const, letterSpacing: 1.5},
    section: {fontSize: 16, fontWeight: '800' as const, letterSpacing: 2},
    body: {fontSize: 13, fontWeight: '600' as const},
    caption: {fontSize: 10, fontWeight: '600' as const, letterSpacing: 2},
  },
  /** Status bar reserve — the app is NOT fullscreen. */
  headerTop: 44,
};

export const DISCLAIMER = 'FICTIONAL OFFLINE GAME \u00B7 NO REAL MONEY \u00B7 18+';

export type Theme = typeof theme;
export default theme;
