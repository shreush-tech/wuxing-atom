import { motion, AnimatePresence } from 'framer-motion'
import { useClinical } from '../clinical/store'

export function ResultReveal(){
  const {clinical}=useClinical()
  const top=clinical.patterns[0]
  const visible=clinical.interview.canShowResult && (!!clinical.relationship || !!(top && top.raw>0))
  const relation=clinical.relationship

  return <AnimatePresence>
    {visible && <motion.div
      className="result-reveal"
      initial={{opacity:0,y:10}}
      animate={{opacity:1,y:0}}
      exit={{opacity:0,y:8}}
      transition={{duration:.9,ease:[.22,.8,.25,1],delay:.65}}
    >
      <motion.div
        className="result-kicker"
        initial={{opacity:0}}
        animate={{opacity:1}}
        transition={{duration:.6,delay:1.0}}
      >
        Seu mapa
      </motion.div>

      <motion.div
        className="result-glyph"
        initial={{opacity:0,scale:.94}}
        animate={{opacity:1,scale:1}}
        transition={{duration:1.0,delay:1.2}}
      >
        {relation?.label || '•'}
      </motion.div>

      <motion.div
        className="result-headline"
        initial={{opacity:0,y:8}}
        animate={{opacity:1,y:0}}
        transition={{duration:.8,delay:1.65}}
      >
        {relation?.title || 'Um padrão ganhou consistência'}
      </motion.div>

      <motion.div
        className="result-caption"
        initial={{opacity:0}}
        animate={{opacity:1}}
        transition={{duration:.8,delay:2.15}}
      >
        {relation?.explanation || 'Uma combinação tradicional começou a se destacar nas suas respostas.'}
      </motion.div>
    </motion.div>}
  </AnimatePresence>
}
