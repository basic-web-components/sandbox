(function() {


  function FunctionList() {}

  FunctionList.prototype = new Array();

  FunctionList.prototype.executeInOrder = function() {

  };


  function AspectStack() {
    this.aspects = [];
    this.methods = {};
  }

  // Combine the stacks of two components.
  AspectStack.combine = function(stack1, stack2) {
    var combined = new AspectStack();
    combined.aspects = stack1.aspects.concat(stack2.aspects);

    // Combine methods of both.
    combined.methods = AspectStack._combineMembers(stack1.methods, stack2.methods);

    return combined;
  };

  // Combines two dictionaries whose values are arrays
  AspectStack._combineMembers = function(object1, object2) {
    var result = {};
    for (var key in object1) {
      result[key] = object1[key];
    }
    for (var key in object2) {
      var array = result[key] || [];
      result[key] = array.concat(object2[key]);
    }
    return result;
  };

  AspectStack.prototype = {

    addAspect: function(aspect) {

      this.aspects.push(aspect);

      // Extract the getters, setters, and methods contributed by the aspect.
      var contributedMembers = this._getContributedMembers(aspect);
      this.methods = AspectStack._combineMembers(this.methods, contributedMembers.methods);
    },

  //   contentChildren: function() {
  //     // return this.innermost.contentChildren; // flattenChildren
  //     return BasicWebComponents.Content.contentChildren(this.innermost);
  //   },

    apply: function() {
      // Point all implicated components at this stack, and decorate them with
      // the stack's methods.
      this.aspects.forEach(function(aspect) {
        aspect.stack = this;
        this._addStackMethodWrappersToAspect(aspect);
      }.bind(this));
    },

    get children() {
      return this.innermost.children;
    },

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

      var aspectsImplementingMethod = this.methods[methodName] || [];

      var result;
      var args = [].slice.call(arguments, 1); // Skip first arg (method name);

      // Work from innermost out
      aspectsImplementingMethod.slice().reverse().forEach(function(aspect) {
        result = aspect.contribute[methodName].apply(aspect, args);
      });
      return result;
    },

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

    _addStackMethodWrappersToAspect: function(aspect) {
      for (var methodName in this.methods) {
        aspect[methodName] = this._wrapperForStackMethod(aspect, methodName);
      }
    },

    _getContributedMembers: function(aspect) {
      var contribution = aspect.contribute || {};
      var methods = {};
      Object.getOwnPropertyNames(contribution).forEach(function(key) {
        var descriptor = Object.getOwnPropertyDescriptor(contribution, key);
        if (typeof descriptor.value === 'function') {
          // Method
          methods[key] = methods[key] || [];
          methods[key].push(aspect);
        }
      }.bind(this));
      return {
        methods: methods
      };
    },

    _wrapperForStackMethod: function(aspect, methodName) {
      return function() {
        return this.stack.invokeMethod(methodName, arguments);
      };
    }

  };


  // Decorator for aspects.
  var Aspect = {

    // // TODO: Figure out in what order contentChanged will be invoked.
    // // Should try to be idempotent with respect to order of invocation.
    // contentChanged: function() {
    //   // Find/set inner -- look in children but *not* projected content.

    //   // Invoke aspect.contentChildrenChanged.
    // },

    created: function() {
      this.stack = new AspectStack();
      this.stack.addAspect(this);
      // this.contribute.component = this;
    },

    get innerAspect() {
      return this.stack.innerAspect(this);
    },
    set innerAspect(target) {
      var combined = AspectStack.combine(this.stack, target.stack);
      combined.apply();
    },

    get outerAspect() {
      return this.stack.outerAspect(this);
    },

    stack: null

  };

  window.BasicWebComponents = window.BasicWebComponents || {};
  window.BasicWebComponents.Aspect = Aspect;
  window.BasicWebComponents.AspectStack = AspectStack;

})();
