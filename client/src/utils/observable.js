export default class Observable {
  constructor(dispatchSibling = null) {
    this.listeners = {};
    this.onceListeners = {};
    this.silenced = false;

    // dispatch sibling will dispatch same events
    // TODO: get rid of this hack
    this.dispatchSibling = dispatchSibling;
  }

  silence(val) {
    this.silenced = val;
  }

  has(event, listener) {
    if (event in this.listeners) {
      const listenerArray = this.listeners[event];

      for (let i = 0; i < listenerArray.length; i++) {
        if (listenerArray[i] === listener) {
          return true;
        }
      }
    }

    return false;
  }

  add(event, listener) {
    this.addInternal(event, listener, this.listeners);
  }

  addOnce(event, listener) {
    this.addInternal(event, listener, this.onceListeners);
  }

  addInternal(event, listener, listenersWrapper) {
    const listenerArray = listenersWrapper[event];
    if (!listenerArray) listenersWrapper[event] = [listener];
    else listenerArray.push(listener);
  }

  remove(event, listener) {
    if (event in this.listeners) {
      const listenerArray = this.listeners[event];
      if (!listenerArray) return;

      var index = listenerArray.indexOf(listener);
      if (index > -1) {
        listenerArray.splice(index, 1);
      }
    }
  }

  dispatch(event, ...data) {
    if (this.silenced) return;
    // console.log("DISPATCH", event, data);
    this.dispatchInternal(event, this.listeners, ...data);
    this.dispatchInternal(event, this.onceListeners, ...data);
    delete this.onceListeners[event];

    if (this.dispatchSibling) this.dispatchSibling.dispatch(event, ...data);
  }

  dispatchInternal(event, listeners, ...data) {
    if (event in listeners) {
      const listenerArray = listeners[event];

      for (let i = 0; i < listenerArray.length; i++) {
        listenerArray[i](...data);
      }
    }
  }
}
