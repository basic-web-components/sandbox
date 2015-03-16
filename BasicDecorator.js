// Use with BasicContentHelpers.
//
// To use, need to define _decoratorInterface.

(function() {

/*
 * Return true if the given element implements the required target interface.
 */
function implementsInterface(element, interfaceMembers) {
  return interfaceMembers.every(function(member) {
    typeof element[member] === 'function';
  });    
},

// Find the first child that satisfies the target criteria.
function findTargetWithInterface(element, interfaceMembers) {
  var children = element.children;
  for (var i = 0, length = children.length; i < length; i++) {
    var child = children[i];
    if (implementsInterface(child, interfaceMembers) {
      return child;
    }
  }
  return null;
}

var BasicDecorator = {

  contentChanged: function() {
    this.target = findTargetWithInterface(this, this._decoratorInterface);
  },

  target: null

};

return BasicDecorator;

})();
