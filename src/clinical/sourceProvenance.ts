export type ClinicalSourceId='reference_book'|'author_video'
export type Provenance={source:ClinicalSourceId;locator:string;status:'verified'|'pending_transcript'}

export const sourcePolicy={
 reference_book:{
  role:'structured patterns, symptom tables, treatment-reference content',
  status:'verified'
 },
 author_video:{
  role:'anamnesis flow, cross-element questioning, author reasoning nuances',
  status:'pending_transcript'
 }
} as const

export const authorVideoQueue=[
 'jUfeOlBMOK8','AValg6TVZBk','s3OxYegU0aQ','5AjuWLs3_9w','9rznnyjIMmc','udTzxEyWdgw'
].map(id=>({source:'author_video' as const,locator:id,status:'pending_transcript' as const}))
