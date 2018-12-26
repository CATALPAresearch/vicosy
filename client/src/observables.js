// app wide observables

import Observable from "./utils/observable";

window.socketEvents = new Observable();
window.p2pEvents = new Observable();
window.streamEvents = new Observable();
window.genericAppEvents = new Observable();
window.logEvents = new Observable();
window.annotationEvents = new Observable();
window.dialogRequestEvents = new Observable();
