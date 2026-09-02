import {ClinicalProvider} from './clinical/store'
import {Scene} from './three/Scene'
import {SymptomExplorer} from './components/SymptomExplorer'
import {ClinicalDiagnosesSection} from './components/ClinicalDiagnosesSection'
import {JourneyGuide} from './components/JourneyGuide'
import {EducationSection} from './components/EducationSection'
import {AcupointConstellation} from './components/AcupointConstellation'
import {ContactFooter} from './components/ContactFooter'
import {AtomHint} from './components/AtomHint'
import {ExperienceShell} from './components/ExperienceShell'
import {FocusProvider,useFocus} from './components/FocusContext'
import {ElementFocusCard} from './components/ElementFocusCard'
import {YinYangInfoPanel} from './components/YinYangInfoPanel'
import {ResultRevealGate} from './components/ResultRevealGate'
import {FinalResultExperience} from './components/FinalResultExperience'
import {AtomErrorBoundary} from './components/AtomErrorBoundary'
import {WorkspaceProvider} from './workspace/WorkspaceProvider'
import {PatientRail} from './workspace/PatientRail'
import {RoleSwitcher} from './workspace/RoleSwitcher'
import {KnowledgePortal} from './components/KnowledgePortal'
import {WorkspaceClinicalBridge} from './workspace/WorkspaceClinicalBridge'
import {SessionNotebook} from './workspace/SessionNotebook'
import {PatientHistory} from './workspace/PatientHistory'
import {MapChangeSummary} from './workspace/MapChangeSummary'
import {HistoricalViewBanner} from './workspace/HistoricalViewBanner'
import './styles/app.css'

function FocusOverlay(){
  const {focus,setFocus}=useFocus()
  return <>
    <ElementFocusCard element={focus} onClose={()=>setFocus(null)}/>
    <YinYangInfoPanel/>
  </>
}

export default function App(){
  return <WorkspaceProvider><ClinicalProvider>
    <FocusProvider>
      <ExperienceShell>
        <div className="page">
          <main className="app">
            <aside className="desktop-rail">
              <div className="brand"><span className="brand-mark">五</span><span>Wu Xing · Reushtech</span></div>
              <div className="desktop-rail-copy">
                <span>Constelação clínica</span>
                <strong>The Five Gems · Cinco Movimentos, uma leitura.</strong>
                <p>As cinco gemas permanecem visíveis enquanto você constrói sua constelação de sintomas.</p>
              </div>
              <div className="workspace-toolbar"><RoleSwitcher/><KnowledgePortal/></div>
              <PatientRail/>
              <div className="desktop-rail-foot">Arraste para girar · clique nos elementos para explorar</div>
            </aside>
            <section className="scene-pane">
              <AtomErrorBoundary><Scene/></AtomErrorBoundary>
              <FocusOverlay/>
            </section>
            <aside className="panel">
              <AtomHint/>
              <WorkspaceClinicalBridge/>
              <HistoricalViewBanner/>
              <ResultRevealGate/>
              <JourneyGuide/>
              <SymptomExplorer/>
              <ClinicalDiagnosesSection/>
              <SessionNotebook/>
            </aside>
          </main>

          <FinalResultExperience/>
          <PatientHistory/>
          <MapChangeSummary/>
          <EducationSection/>
          <AcupointConstellation/>
          <ContactFooter/>
        </div>
      </ExperienceShell>
    </FocusProvider>
  </ClinicalProvider></WorkspaceProvider>
}
