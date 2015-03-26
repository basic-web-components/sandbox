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

  // Add the values of the second object to the first.
  _addMembers: function(object1, object2) {
    for (var key in object2) {
      var array = object1[key] || [];
      object1[key] = array.concat(object2[key]);
    }
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
  _assimilateAspect: function(newAspect) {

    // Extract the methods, getters, and setters contributed by the new aspect.
    var newMembers = this._getContributedMembers(newAspect);

    // Add the newAspect's members to the collective.
    this._addMembers(this.methods, newMembers.methods);
    this._addMembers(this.getters, newMembers.getters);
    this._addMembers(this.setters, newMembers.setters);

    // Apply the new members to the existing aspects in the collective.
    for (var i = 0, length = this.aspects.length; i < length; i++) {
      this._applyMembersToAspect(newMembers, this.aspects[i]);
    }

    // Add the new aspect to this collective.
    this.aspects.push(newAspect);
    newAspect.collective = this;

    // Add all the collective's members to the new aspect.
    var collectiveMembers = {
      methods: this.methods,
      getters: this.getters,
      setters: this.setters
    };
    this._applyMembersToAspect(collectiveMembers, newAspect);

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
