import { SET_ANNOTATION_CURRENT_PLAYTIME } from "../logic-controls/annotationEvents";

const ANNOTATION_PREFIX = "@@";

export const checkAndExecuteChatInputAction = input => {
  if (input.startsWith(ANNOTATION_PREFIX)) {
    const annotationText = input.substring(ANNOTATION_PREFIX.length);
    if (annotationText.length > 0)
      window.annotationEvents.dispatch(SET_ANNOTATION_CURRENT_PLAYTIME, {
        title: "Quickannotation",
        text: annotationText
      });

    return true;
  }

  return false;
};
