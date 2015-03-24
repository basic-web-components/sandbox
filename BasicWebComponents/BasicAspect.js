(function() {


  function FunctionList() {}

  FunctionList.prototype = new Array();

  FunctionList.prototype.executeInOrder = function() {

  };


  function AspectStack() {
    this.aspects = [];
    this.methods = {};
    this.getters = {};
  }

  // Combine the stacks of two components.
  AspectStack.combine = function(stack1, stack2) {
    var combined = new AspectStack();
    combined.aspects = stack1.aspects.concat(stack2.aspects);

    // Combine methods, getters, and setters of both stacks.
    combined.methods = AspectStack._combineMembers(stack1.methods, stack2.methods);
    combined.getters = AspectStack._combineMembers(stack1.getters, stack2.getters);
    combined.setters = AspectStack._combineMembers(stack1.setters, stack2.setters);

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

      // Extract the methods, getters, and setters contributed by the aspect.
      var contributedMembers = this._getContributedMembers(aspect);
      this.methods = AspectStack._combineMembers(this.methods, contributedMembers.methods);
      this.getters = AspectStack._combineMembers(this.getters, contributedMembers.getters);
      this.setters = AspectStack._combineMembers(this.setters, contributedMembers.setters);
    },

  //   contentChildren: function() {
  //     // return this.innermost.contentChildren; // flattenChildren
  //     return BasicWebComponents.Content.contentChildren(this.innermost);
  //   },

    apply: function() {
      // Point all implicated components at this stack, and decorate them with
      // the stack's methods.
      this.aspects.forEach(function(aspect) {
        this.applyToAspect(aspect);
      }.bind(this));
      this.invokeMethod('stackChanged');
    },

    applyToAspect: function(aspect) {
      aspect.stack = this;

      // Add stack methods
      for (var methodName in this.methods) {
        this._addStackMethodWrapperToAspect(aspect, methodName);
      }

      // Add stack getters
      for (var getterName in this.getters) {
        this._addStackGetterWrapperToAspect(aspect, getterName);
      }

      // Add stack setters
      for (var setterName in this.setters) {
        this._addStackSetterWrapperToAspect(aspect, setterName);
      }
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

    invokeGetter: function(getterName) {
      var aspectsImplementingGetter = this.getters[getterName];
      if (aspectsImplementingGetter == null || aspectsImplementingGetter.length < 1) {
        // None of the aspects implement the requested getter.
        return undefined;
      }
      var outermostAspectImplementingMethod = aspectsImplementingGetter[0];
      var getter = Object.getOwnPropertyDescriptor(outermostAspectImplementingMethod.contribute, getterName).get;
      var result = getter.call(outermostAspectImplementingMethod);
      return result;
    },

    invokeMethod: function(methodName, args) {
      var aspectsImplementingMethod = this.methods[methodName] || [];
      var result;
      // Work from innermost out
      aspectsImplementingMethod.slice().reverse().forEach(function(aspect) {
        result = aspect.contribute[methodName].apply(aspect, args);
      });
      return result;
    },

    invokeSetter: function(setterName, value) {
      var aspectsImplementingSetter = this.setters[setterName] || [];
      // Work from innermost out
      aspectsImplementingSetter.slice().reverse().forEach(function(aspect) {
        var setter = Object.getOwnPropertyDescriptor(aspect.contribute, setterName).set;
        setter.call(aspect, value);
      });
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

    _addStackGetterWrapperToAspect: function(aspect, getterName) {
      Object.defineProperty(aspect, getterName, {
        configurable: true,
        get: function() {
          return this.stack.invokeGetter(getterName);
        }
      });
    },

    _addStackMethodWrapperToAspect: function(aspect, methodName) {
      aspect[methodName] = function() {
        return this.stack.invokeMethod(methodName, arguments);
      };
    },

    _addStackSetterWrapperToAspect: function(aspect, setterName) {
      Object.defineProperty(aspect, setterName, {
        configurable: true,
        set: function(value) {
          return this.stack.invokeSetter(setterName, value);
        }
      });
    },

    _getContributedMembers: function(aspect) {
      var contribution = aspect.contribute || {};
      var methods = {};
      var getters = {};
      var setters = {};
      Object.getOwnPropertyNames(contribution).forEach(function(key) {
        var descriptor = Object.getOwnPropertyDescriptor(contribution, key);
        if (typeof descriptor.value === 'function') {
          // Method
          methods[key] = methods[key] || [];
          methods[key].push(aspect);
        }
        if (typeof descriptor.get === 'function') {
          // Getter
          getters[key] = getters[key] || [];
          getters[key].push(aspect);
        }
        if (typeof descriptor.set === 'function') {
          // setters
          setters[key] = setters[key] || [];
          setters[key].push(aspect);
        }
      }.bind(this));
      return {
        methods: methods,
        getters: getters,
        setters: setters
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
      this.stack.apply();
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
