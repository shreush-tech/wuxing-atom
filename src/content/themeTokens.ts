export const themeTokens={
  background:'#F2EFE8',
  surface:'#F8F6F1',
  surfaceStrong:'#ECE8DF',
  text:'#242321',
  textMuted:'#6E6962',
  line:'#CFC8BD',
  lineSoft:'#DDD7CD',
  shadow:'rgba(50,45,38,.12)',
  glass:'rgba(248,246,241,.84)',
  focusRing:'rgba(36,35,33,.16)'
} as const

export type ThemeTokens=typeof themeTokens
