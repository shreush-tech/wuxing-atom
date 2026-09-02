export const elementVisualIdentity={
  wood:{
    breath:.82,rotation:.065,roughness:.78,distortion:.14,
    scaleCeiling:1.12,materialMood:'fibrous-organic',highlight:'soft'
  },
  fire:{
    breath:1.24,rotation:.092,roughness:.18,distortion:.28,
    scaleCeiling:1.13,materialMood:'translucent-hot-glass',highlight:'internal'
  },
  earth:{
    breath:.56,rotation:.032,roughness:.92,distortion:.07,
    scaleCeiling:1.10,materialMood:'mineral-clay',highlight:'matte'
  },
  metal:{
    breath:.66,rotation:.050,roughness:.24,distortion:.04,
    scaleCeiling:1.10,materialMood:'aged-silver',highlight:'controlled'
  },
  water:{
    breath:1.02,rotation:.040,roughness:.10,distortion:.22,
    scaleCeiling:1.11,materialMood:'refractive-liquid',highlight:'surface'
  }
} as const
