Object.defineProperty(Object.prototype, "getAdd", {
  value: function getAdd(any) {
    if (!(any in this)) this[any] = {};
    console.log("PROPERTY", any);
    return this[any];
  }
});

Object.defineProperty(Object.prototype, "setAtPath", {
  value: function setAtPath(path, value) {
    const pathParts = path.split(".");

    var latestValue = this;
    for (let i = 0; i < pathParts.length; i++) {
      const pathItem = pathParts[i];

      if (i === pathParts.length - 1) {
        latestValue[pathItem] = value;
        latestValue[pathItem] = value;
      } else if (pathItem in latestValue) {
        latestValue = latestValue[pathItem];
      } else {
        latestValue[pathItem] = {};
        latestValue = latestValue[pathItem];
      }
    }
  }
});

Object.defineProperty(Object.prototype, "deleteAtPath", {
  value: function deleteAtPath(path) {
    const pathParts = path.split(".");

    var latestValue = this;
    for (let i = 0; i < pathParts.length; i++) {
      const pathItem = pathParts[i];

      if (i === pathParts.length - 1) {
        delete latestValue[pathItem];
      } else if (pathItem in latestValue) {
        latestValue = latestValue[pathItem];
      } else {
        return;
      }
    }
  }
});

Object.defineProperty(Object.prototype, "getAtPath", {
  value: function getAtPath(path, defaultResult = null) {
    const pathParts = path.split(".");

    var latestValue = this;
    for (let i = 0; i < pathParts.length; i++) {
      const pathItem = pathParts[i];
      if (pathItem in latestValue) latestValue = latestValue[pathItem];
      else return defaultResult;
    }

    return latestValue;
  }
});

String.prototype.hashCode = function() {
  var hash = 0;
  if (this.length === 0) {
    return hash;
  }
  for (var i = 0; i < this.length; i++) {
    var char = this.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};
