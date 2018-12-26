import { ENABLE_FEATURES, DISABLE_FEATURES } from "./types";

export const enableFeatures = (features = null) => {
  return {
    type: ENABLE_FEATURES,
    payload: features
  };
};

export const disableFeatures = (features = null) => {
  return {
    type: DISABLE_FEATURES,
    payload: features
  };
};
