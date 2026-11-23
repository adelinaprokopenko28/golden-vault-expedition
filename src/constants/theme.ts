/**
 * CASINO_GOLD preset copy with two deliberate accent overrides (ember, steel).
 * The preset name is kept verbatim.
 */
export const theme = {
  name: 'casino-gold',

  colors: {
    bg: '#0B0B0F',
    surface: '#141418',
    surfaceRaised: '#1C1C24',
    surfaceWarm: '#1E1A14',

    gold: '#D4AF37',
    goldLight: '#F5D77A',
    goldDeep: '#8A6E2F',
    rivet: '#6B5724',
    rivetRing: '#3A2F14',

    ember: '#E07A2F',
    steel: '#8A8F98',
    cold: '#3A3A44',
    danger: '#B5452F',

    textPrimary: '#F6EEDC',
    textSecondary: '#A49880',
    textMuted: '#6B6256',
    textFaint: '#5A5248',

    hairline: 'rgba(245,215,122,0.18)',
    hairlineSoft: 'rgba(245,215,122,0.10)',
    divider: 'rgba(255,255,255,0.06)',
    glassFill: 'rgba(255,255,255,0.05)',
    topHighlight: 'rgba(255,255,255,0.10)',
    bottomShade: 'rgba(0,0,0,0.55)',
    lockedPlate: '#15151A',
    lockedBorder: '#2E2E38',
    lockedIcon: '#4A4A56',
    rust: '#4A3A24',
  },

  gradients: {
    cta: ['#F5D77A', '#D4AF37', '#A8842A'],
    ctaDisabled: ['#3A3A42', '#2A2A31', '#22222A'],
    panel: ['#1C1C24', '#141418'],
    panelWarm: ['#2A2419', '#1E1A14', '#12100B'],
    plate: ['#2C2C34', '#1A1A20', '#101014'],
    brass: ['#D4AF37', '#A8842A'],
    bar: ['#8A6E2F', '#D4AF37', '#F5D77A'],
    ember: ['#E07A2F', '#B5452F'],
    hairline: ['transparent', '#8A6E2F', 'transparent'],
  },

  overlays: {
    loader: ['rgba(5,5,8,0.94)', 'rgba(11,11,15,0.90)', 'rgba(30,26,20,0.88)'],
    menu: ['rgba(11,11,15,0.22)', 'rgba(11,11,15,0.66)', '#0B0B0F'],
    map: ['rgba(11,11,15,0.74)', 'rgba(20,20,24,0.86)', 'rgba(11,11,15,0.92)'],
    game: ['rgba(11,11,15,0.58)', 'rgba(30,26,20,0.74)', 'rgba(11,11,15,0.90)'],
    resultWin: ['rgba(30,26,20,0.80)', 'rgba(44,34,12,0.86)', 'rgba(11,11,15,0.94)'],
    resultLose: ['rgba(26,14,12,0.86)', 'rgba(18,12,12,0.90)', 'rgba(11,11,15,0.96)'],
    plain: ['rgba(11,11,15,0.84)', 'rgba(20,20,24,0.90)', 'rgba(11,11,15,0.94)'],
  },

  type: {
    hero: { fontSize: 38, fontWeight: '800' as const, letterSpacing: 4, lineHeight: 44 },
    title: { fontSize: 26, fontWeight: '800' as const, letterSpacing: 2, lineHeight: 32 },
    headline: { fontSize: 30, fontWeight: '800' as const, letterSpacing: 2.4, lineHeight: 36 },
    section: { fontSize: 15, fontWeight: '700' as const, letterSpacing: 2 },
    body: { fontSize: 15, fontWeight: '500' as const, lineHeight: 21 },
    caption: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 1.4 },
    micro: { fontSize: 9, fontWeight: '600' as const, letterSpacing: 1.6 },
    statValue: { fontSize: 22, fontWeight: '800' as const, letterSpacing: 0.5 },
    dial: { fontSize: 34, fontWeight: '800' as const },
  },

  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28 },

  radius: { sm: 8, md: 12, lg: 18, xl: 24, pill: 100 },

  shadow: {
    gold: {
      shadowColor: '#D4AF37',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.45,
      shadowRadius: 18,
      elevation: 12,
    },
    panel: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.6,
      shadowRadius: 20,
      elevation: 16,
    },
    card: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 6,
    },
  },

  anim: {
    press: { tension: 300, friction: 12 },
    enter: { tension: 170, friction: 14 },
    pop: { tension: 220, friction: 11 },
    fade: 280,
  },
};

export type Theme = typeof theme;
export default theme;
