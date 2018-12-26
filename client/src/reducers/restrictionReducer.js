import { ENABLE_FEATURES, DISABLE_FEATURES } from "../actions/types";
import { FEATURES } from "./featureTypes";

// stores information which feature is disabled in the current session
// missing features = enabled
const initialState = {
  disabledFeatures: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ENABLE_FEATURES:
      const featuresToEnable = action.payload;

      if (!featuresToEnable || featuresToEnable.length === 0) {
        // enable all features
        return {
          ...state,
          disabledFeatures: {}
        };
      }

      var stateCpy = { ...state };
      for (let i = 0; i < featuresToEnable.length; i++) {
        const feature = featuresToEnable[i];
        delete stateCpy.disabledFeatures[feature];
      }

      return stateCpy;
    case DISABLE_FEATURES:
      const featuresToDisable = action.payload;

      if (!featuresToDisable || featuresToDisable.length === 0) {
        // disable all features
        return {
          ...state,
          disabledFeatures: { ...FEATURES }
        };
      }

      var stateCpy = { ...state };
      for (let i = 0; i < featuresToDisable.length; i++) {
        const feature = featuresToDisable[i];
        stateCpy.disabledFeatures[feature] = true;
      }

      return stateCpy;

    default:
      return state;
  }
}
