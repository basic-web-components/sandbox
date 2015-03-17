/*
 * Helpers to compose mixins into elements, e.g., Polymer elements.
 *
 * Element mixins often have methods that must be invoked during element
 * lifecyle events: created, ready, attached, detached. A standard mixin
 * approach requires that the base element being constructed manually invoke
 * these mixin methods during their lifecycle handlers. This is somewhat
 * brittle, as the element author may forget to invoke the mixin's methods at
 * the appropriate time. This also constrains mixin developement. If a mixin
 * in wide use later decides it should release resources in detached handler,
 * existing consumers of that mixin won't know that they should now let the
 * mixin know when the element is being detached.
 *
 * Mixin composition avoids this problem by automatically combining handlers
 * with the same name (e.g., "ready") in the base element and any mixins.
 * If the element and mutliple mixins define a ready() function, the composition
 * process returns a new object to be registered as the element prototype. This
 * object will have a combined ready() function that invokes the ready()
 * functions on the base element *and* all its mixins.
 *
 */

var BasicComposition = {

  /*
   * Return an object suitable for registration as an element prototype that
   * mixes in the members of all objects passed as function arguments.
   *
   * Mixins can be composed into an element's prototype like this:
   *
   * MyMixin = {
   *   ready: function() { ... },
   *   value: 2
   * };
   *
   * Polymer(BasicComposition.compose({
   *   // Base element members go here
   *   ready: function() { ... },
   *   value: 1
   * }, MyMixin);
   *
   * When this element is instantiated, both its base ready() method and the
   * MyMixin.ready() method will be invoked. With scalar members (here,
   * "value"), the last writer wins. Since MyMixin is mixed in last here,
   * instances of this element will end up with a default this.value of 2.
   *
   */
  compose: function() {

    var length = arguments.length;
    
    if (length === 0) {
      return {};
    } else if (length === 1) {
      return arguments[0];
    }

    // Multiple arguments
    var result = {};
    var functionsToCombine = {};
    var settersToCombine = {};
    [].forEach.call(arguments, function(argument) {
      Object.getOwnPropertyNames(argument).forEach(function(propertyName) {
        var descriptor = Object.getOwnPropertyDescriptor(argument, propertyName);

        if (typeof descriptor.value === 'function') {
          // Function member; combine.
          if (!functionsToCombine[propertyName]) {
            functionsToCombine[propertyName] = [];
          }
          functionsToCombine[propertyName].push(descriptor.value);
        } else {
          // Scalar or object member; last writer wins.
          result[propertyName] = descriptor.value;
        }

        if (typeof descriptor.get === 'function') {
          // Getter; last writer wins.
          Object.defineProperty(result, propertyName, {
            get: descriptor.get
          });
        }

        if (typeof descriptor.set === 'function') {
          // Setter; combine.
          if (!settersToCombine[propertyName]) {
            settersToCombine[propertyName] = [];
          }
          settersToCombine[propertyName].push(descriptor.set);
        }

      });
    });

    for (var key in functionsToCombine) {
      var functions = functionsToCombine[key];
      if (functions.length === 1) {
        // Only one function, just use as is.
        result[key] = functions[0];
      } else {
        // Multiple functions; combine.
        result[key] = this.combineFunctions.apply(this, functionsToCombine[key]);      
      }
    }

    for (var key in settersToCombine) {
      var setters = settersToCombine[key];
      var setter;
      if (setters.length === 1) {
        // Only one function, just use as is.
        setter = setters[0];
      } else {
        // Multiple functions; combine.
        setter = this.combineFunctions.apply(this, settersToCombine[key]);      
      }
      Object.defineProperty(result, key, {
        set: setter
      });
    }

    return result;
  },

  /*
   * Given a list of functions, return a combined function that executes all of
   * them in order. This isn't true function composition, where the result of
   * one function is passed as an argument to the next. Here, all supplied
   * functions are passed the same arguments.
   */
  combineFunctions: function() {
    var functions = [].slice.call(arguments);
    var combined = function functionWithMixins() {
      for (var i in functions) {
        functions[i].apply(this, arguments);
      }
    }
    return combined;
  },

  combineSetters: function() {
    var setters = [].slice.call(arguments);

  }

};
