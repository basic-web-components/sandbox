// Isomorphic decorator pattern.
// Decorates a child element with additional behavior.
// Element can be used as is, or it can wrap a target child element exposing the
// same interface, in which case calls to this element will get delegated to the
// target child.
//
// Use with BasicContentHelpers.
//
// To use, need to define decoratorInterface.

(function() {

/*
 * Return true if the given element implements the required target interface.
 */
function implementsInterface(element, interfaceMembers) {
  return interfaceMembers.every(function(member) {
    typeof element[member] === 'function';
  });
}

// Find the first child that satisfies the target criteria.
function findTargetWithInterface(element, interfaceMembers) {
  if (interfaceMembers == null || interfaceMembers.length === 0) {
    throw new Error("A BasicDecorator class must have an interfaceMembers member containing an array of function names as strings.");
  }
  var children = element.children;
  for (var i = 0, length = children.length; i < length; i++) {
    var child = children[i];
    if (implementsInterface(child, interfaceMembers)) {
      return child;
    }
  }
  return null;
}

window.BasicDecorator = {

  // TODO: Use contentChanged from BasicContent
  contentChanged: function() {
    this.target = findTargetWithInterface(this, this.decoratorInterface);    
  },

  target: null

};

})();
