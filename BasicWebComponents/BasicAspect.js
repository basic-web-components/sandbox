(function() {


  function AspectStack() {
    this.aspects = [];
  }

  AspectStack.prototype = {

  //   contentChildren: function() {
  //     // return this.innermost.contentChildren; // flattenChildren
  //     return BasicWebComponents.Content.contentChildren(this.innermost);
  //   },

  //   get innermost() {

  //   },

  //   get methods() {

  //   },

  //   get outermost() {

  //   },

  //   get properties() {

  //   },

  //   removeAspect: function(aspect) {

  //   },

  //   _applyMembersToAspect: function(aspect) {

  //   },

  //   _applyMembersToAspects: function() {

  //   },

  //   _createProperty: function() {

  //   },

  //   _createPropertyGetter: function() {

  //   },

  //   _createPropertySetter: function() {

  //   },

  //   _createMethod: function(methodName) {
  //     return function() {
  //       var result;
  //       // Work from innermost out
  //       for (var i = this.aspects.length - 1; i >= 0; i--) {
  //         var element = this.aspects[i];
  //         if (typeof element.aspect[methodName] === 'function') {
  //           result = element.aspect[methodName].apply(element, args);
  //         }
  //       }
  //       return result;
  //     };
  //   }

  };


  // Decorator for aspects.
  var Aspect = {

    // // TODO: Figure out in what order contentChanged will be invoked.
    // // Should try to be idempotent with respect to order of invocation.
    // contentChanged: function() {
    //   // Find/set inner -- look in children but *not* projected content.

    //   // Invoke aspect.contentChildrenChanged.
    // },

    // get inner() {
    //   return this._inner;
    // },
    // set inner(aspect) {
    //   this._inner = aspect;
    //   aspect.outer = this; // Tell inner stack to let itself be subsumed
    //   // Subsume inner stack
    // },

    // get outer() {
    //   return this._outer;
    // },
    // set outer(aspect) {
    //   this._outer = aspect;
    //   // Be subsumed into outer stack
    // },

    // _inner: null,

    // _outer: null,

    created: function() {
      this.stack = new AspectStack();
      this.stack.aspects.push(this.aspect);
    },

    invokeStackMethod: function(methodName) {
      var result;
      // Work from innermost out
      var aspects = this.stack.aspects;
      var args = [].slice.call(arguments, 1); // Already have method name.
      for (var i = aspects.length - 1; i >= 0; i--) {
        var aspect = aspects[i];
        if (typeof aspect[methodName] === 'function') {
          result = aspect[methodName].apply(this, args);
        }
      }
      return result;
    },

    stack: null

  };

  window.BasicWebComponents = window.BasicWebComponents || {};
  window.BasicWebComponents.Aspect = Aspect;


})();
