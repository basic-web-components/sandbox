(function() {


  function AspectStack() {
    this.aspects = [];
  }

  // Combine the stacks of two components.
  AspectStack.combine = function(stack1, stack2) {
    var combined = new AspectStack();
    combined.aspects = stack1.aspects.concat(stack2.aspects);
    return combined;
  };

  AspectStack.prototype = {

    addAspect: function(aspect) {
      this.aspects.push(aspect);
    },

  //   contentChildren: function() {
  //     // return this.innermost.contentChildren; // flattenChildren
  //     return BasicWebComponents.Content.contentChildren(this.innermost);
  //   },

  //   get innermost() {

  //   },

    innerAspect: function(aspect) {
      var index = this.aspects.indexOf(aspect);
      var innerIndex = index + 1;
      return innerIndex < this.aspects.length ?
        this.aspects[innerIndex] :
        null;
    },

    get innermost() {
      return this.aspects[this.aspects.length - 1];
    },

    invokeMethod: function(methodName) {
      var result;
      // Work from innermost out
      var aspects = this.aspects;
      var args = [].slice.call(arguments, 1); // Already have method name.
      for (var i = aspects.length - 1; i >= 0; i--) {
        var aspect = aspects[i];
        if (typeof aspect[methodName] === 'function') {
          result = aspect[methodName].apply(aspect.component, args);
        }
      }
      return result;
    },

  //   get methods() {

  //   },

    outerAspect: function(aspect) {
      var index = this.aspects.indexOf(aspect);
      var outerIndex = index - 1;
      return outerIndex >= 0 ?
        this.aspects[outerIndex] :
        null;
    },

    get outermost() {
      return this.aspects[0];
    },

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
      this.stack.addAspect(this.aspect);
      this.aspect.component = this;
    },

    get innerAspect() {
      var inner = this.stack.innerAspect(this.aspect);
      return inner && inner.component;
    },
    set innerAspect(target) {
      var combined = AspectStack.combine(this.stack, target.stack);
      // Point all implicated components at the new, combined stack.
      combined.aspects.forEach(function(aspect) {
        aspect.component.stack = combined;
      });
    },

    get outerAspect() {
      var outer = this.stack.outerAspect(this.aspect);
      return outer && outer.component;
    },

    stack: null

  };

  window.BasicWebComponents = window.BasicWebComponents || {};
  window.BasicWebComponents.Aspect = Aspect;
  window.BasicWebComponents.AspectStack = AspectStack;

})();
