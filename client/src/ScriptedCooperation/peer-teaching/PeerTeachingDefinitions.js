import PhaseProcessorPTGetTogether from "./PhaseProcessorPTGetTogether";
import PhaseProcessorPTWarmUp from "./PhaseProcessorPTWarmUp";
import PhaseProcessorPTSeparateSections from "./PhaseProcessorPTSeparateSections";
import PhaseProcessorPTPrepareSectionPair from "./PhaseProcessorPTPrepareSectionPair";
import PhaseProcessorPTPresentSection from "./PhaseProcessorPTPresentSection";
import PhaseProcessorPTDeepenUnderstanding from "./PhaseProcessorPTDeepenUnderstanding";

/**
 * Mapping phase id to processor class (react component)
 * and other static data
 */

export const PeerTeachingDefinitions = {
  roleData: {
    ROLE_TUTOR: { faIcon: "chalkboard-teacher" },
    ROLE_TUTEE: { faIcon: "user-graduate" }
  },

  globalSettings: {
    syncSharedEditorInSyncSpace: true
  },

  processorMapping: {
    PHASE_GET_TOGETHER: PhaseProcessorPTGetTogether,
    PHASE_WARM_UP: PhaseProcessorPTWarmUp,
    PHASE_SEPARATE_SECTIONS: PhaseProcessorPTSeparateSections,
    PHASE_PREPARE_SECTION_PAIR: PhaseProcessorPTPrepareSectionPair,
    PHASE_PRESENT_SECTION: PhaseProcessorPTPresentSection,
    PHASE_DEEPEN_UNDERSTANDING: PhaseProcessorPTDeepenUnderstanding
  }
};
