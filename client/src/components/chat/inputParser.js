import {
  SET_ANNOTATION_CURRENT_PLAYTIME,
  FETCH_ANNOTATIONS
} from "../logic-controls/annotationEvents";

const ANNOTATION_PREFIX = "@@";
const FETCH_ANNOTATIONS_PREFIX = "@FETCH";

export const checkAndExecuteChatInputAction = input => {
  if (input.startsWith(ANNOTATION_PREFIX)) {
    const annotationText = input.substring(ANNOTATION_PREFIX.length);
    if (annotationText.length > 0)
      window.annotationEvents.dispatch(SET_ANNOTATION_CURRENT_PLAYTIME, {
        title: annotationText,
        text: ""
      });

    return true;
  } else if (input.startsWith(FETCH_ANNOTATIONS_PREFIX)) {
    window.annotationEvents.dispatch(FETCH_ANNOTATIONS);
    return true;
  }

  return false;
};
