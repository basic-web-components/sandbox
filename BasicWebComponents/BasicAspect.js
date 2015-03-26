(function() {

  // Return the first child with a "contribute" property.
  function firstChildAspect(element) {
    var children = element.children;
    for (var i = 0, length = children.length; i < length; i++) {
      var child = children[i];
      if (child.contribute) {
        return child;
      }
    }
    return null;
  }

  // Decorator for collective aspects.
  var Aspect = {

    created: function() {
      new Collective(this);
    },

    assimilate: function(target) {
      this.collective.assimilate(target);
    },

    ready: function() {
      if (!this.collective) {
        // Is listening to polymer-ready the best way to know when our children
        // have been updated? What if someone wants to add a component at
        // run-time -- will the event fire then?

        // TODO: Share this handler across all aspects. It's only fired once,
        // right?
        var listener = document.addEventListener('polymer-ready', function() {
          if (!this.collective) {
            // Still not part of a collective.
            var defaultAspect = firstChildAspect();
            if (defaultAspect) {
              this.assimilate(defaultAspect);
            }
          }
          document.removeEventListener(listener);
        }.bind(this));
      }
    }

  };

  window.BasicWebComponents = window.BasicWebComponents || {};
  window.BasicWebComponents.Aspect = Aspect;

})();
