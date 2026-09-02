export const themePresets={
 darkGallery:{label:'Escuro',background:'#090b0d',surface:'#11151a',text:'#eef0ed'},
 mineral:{label:'Mineral',background:'#F2EFE8',surface:'#F8F6F1',text:'#242321'},
 charcoal:{label:'Carvão',background:'#151719',surface:'#1d2024',text:'#f1f1ee'}
} as const
export type ThemePreset=keyof typeof themePresets
export const defaultTheme:ThemePreset='darkGallery'
