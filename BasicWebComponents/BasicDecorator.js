// Isomorphic decorator pattern.
// Decorates a child element with additional behavior.
// Element can be used as is, or it can wrap a target child element exposing the
// same interface, in which case calls to this element will get delegated to the
// target child.
//
// Use with BasicContent.
//
// To use, need to define decoratorInterface.

(function() {



window.BasicDecorator = {

  // TODO: Describe how BasicContent is required to get default target behavior.
  contentChanged: function() {
    this.target = this.findChildWithInterface(this.decoratorInterface);
  },

  /*
   * Return true if the given element implements the required target interface.
   */
  implementsInterface: function(element, interfaceMembers) {
    return interfaceMembers.every(function(member) {
      return (typeof element[member] === 'function');
    });
  },

  // Find the first child that satisfies the target criteria.
  findChildWithInterface: function(interfaceMembers) {
    if (interfaceMembers == null || interfaceMembers.length === 0) {
      throw new Error("A BasicDecorator class must have an interfaceMembers member containing an array of function names as strings.");
    }
    var children = this.children;
    if (children) {
      for (var i = 0, length = children.length; i < length; i++) {
        var child = children[i];
        // HACK: So we can call findChildWithInterface from other classes.
        if (BasicDecorator.implementsInterface.call(this, child, interfaceMembers)) {
          return child;
        }
      }
    }
    return null;
  },

  // TODO: Document how target will be reset to default if content changes.
  target: null

};

})();
