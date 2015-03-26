(function() {

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
