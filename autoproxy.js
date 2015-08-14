'use strict';

function autoproxy(decorator) {
  return function(target) {
    var decoratedTarget = decorator(target);
    if (decoratedTarget !== target) {
      proxyProperties(decoratedTarget, target);
      proxyProperties(decoratedTarget.prototype, target.prototype);
    }
    return decoratedTarget;
  };
}

function proxyProperties(target, source) {
  var propertyNames = Object.getOwnPropertyNames(source);
  propertyNames.forEach(function(name) {
    if (name in target) {
      return;
    }

    var descriptor = Object.getOwnPropertyDescriptor(source, name);
    Object.defineProperty(target, name, {
      configurable: descriptor.configurable,
      enumerable: descriptor.enumerable,
      get: function() {
        return source[name];
      },
      set: function(value) {
        source[name] = value;
      },
    });
  });
}

module.exports = autoproxy;
