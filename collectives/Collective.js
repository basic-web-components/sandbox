/*
 * Collective: a collection of objects called aspects can each contribute
 * properties and methods to the group.
 */


function Collective() {
  this.aspects = [];
  this.methods = {};
  this.getters = {};
  this.setters = {};

  // Assimilate any entities specified as arguments, from first to last.
  for (var i in arguments) {
    this.assimilate(arguments[i]);
  }
}


Collective.prototype = {

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

  /*
   * Incorporate another collective into this one.
   *
   * "Your technological distinctiveness will be added to our own.
   *  Resistance is futile."
   */
  assimilate: function(entity) {
    if (entity instanceof Collective) {
      this._assimilateCollective(entity);
    } else if (entity.collective) {
      // Entity is already part of another collective; assimilate that.
      this._assimilateCollective(entity.collective);
      return;
    } else {
      this._assimilateAspect(entity);
    }
    this.invokeMethod('collectiveChanged');
  },

  get children() {
    var children = this.innermost.children;
    return [].slice.call(children); // Convert result to array.
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
    // Work from last to first.
    for (var length = aspectsImplementingMethod.length, i = length - 1; i >= 0; i--) {
      var aspect = aspectsImplementingMethod[i];
      result = aspect.contribute[methodName].apply(aspect, args);
    }
    return result;
  },

  invokeSetter: function(setterName, value) {
    var aspectsImplementingSetter = this.setters[setterName] || [];
    // Work from last to first.
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

  _addCollectiveGetterWrapperToAspect: function(aspect, getterName) {
    Object.defineProperty(aspect, getterName, {
      configurable: true,
      get: function() {
        return this.collective.invokeGetter(getterName);
      }
    });
  },

  _addCollectiveMethodWrapperToAspect: function(aspect, methodName) {
    aspect[methodName] = function() {
      return this.collective.invokeMethod(methodName, arguments);
    };
  },

  _addCollectiveSetterWrapperToAspect: function(aspect, setterName) {
    Object.defineProperty(aspect, setterName, {
      configurable: true,
      set: function(value) {
        return this.collective.invokeSetter(setterName, value);
      }
    });
  },

  _applyMembersToAspect: function(members, aspect) {

    // TODO: Optimize for case in which the set of methods/getters/setters
    // contains only one function. That function can directly be applied to
    // the aspect, instead of having to be wrapped.

    // Add stack methods
    for (var methodName in members.methods) {
      this._addCollectiveMethodWrapperToAspect(aspect, methodName);
    }

    // Add stack getters
    for (var getterName in members.getters) {
      this._addCollectiveGetterWrapperToAspect(aspect, getterName);
    }

    // Add stack setters
    for (var setterName in members.setters) {
      this._addCollectiveSetterWrapperToAspect(aspect, setterName);
    }
  },

  // Assimilate the indicated aspect.
  _assimilateAspect: function(target) {

    this.aspects.push(target);

    // Extract the methods, getters, and setters contributed by the target.
    var contributedMembers = this._getContributedMembers(target);

    // TODO: Destructively modify the collective's members, rather than creating
    // a new object.
    this.methods = this._combineMembers(this.methods, contributedMembers.methods);
    this.getters = this._combineMembers(this.getters, contributedMembers.getters);
    this.setters = this._combineMembers(this.setters, contributedMembers.setters);

    var collectiveMembers = {
      methods: this.methods,
      getters: this.getters,
      setters: this.setters
    };

    // TODO: More efficient: apply existing collective members to new aspect,
    // apply new member's members to existing collective.
    for (var i = 0, length = this.aspects.length; i < length; i++) {
      this._applyMembersToAspect(collectiveMembers, this.aspects[i]);
    }

    // Aspect is now part of this collective.
    target.collective = this;
  },

  // Assimilate the indicate collective.
  _assimilateCollective: function(target) {
    target.aspects.forEach(function(aspect) {
      this._assimilateAspect(aspect);
    }.bind(this));

    // Remove all aspects from the target collective; it should no longer be
    // used.
    // REVIEW: An alternative would be for the assimilated collective to forward
    // all method calls to the assimlating collective.
    target.aspects = [];
  },

  // Combines two dictionaries whose values are arrays
  _combineMembers: function(object1, object2) {
    var result = {};
    for (var key in object1) {
      result[key] = object1[key];
    }
    for (var key in object2) {
      var array = result[key] || [];
      result[key] = array.concat(object2[key]);
    }
    return result;
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
