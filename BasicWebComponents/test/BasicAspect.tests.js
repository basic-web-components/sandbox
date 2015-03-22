suite('BasicAspect', function() {

  this.timeout(2000);

  var container = document.getElementById('container');

  // HACK until we can call Polymer constructor.
  function createComponent(options) {
    var componentClass = function() {};
    componentClass.prototype = options;
    var component = new componentClass();
    return component;
  }

  teardown(function() {
    container.innerHTML = '';
  });

  test("aspect stack is initially null", function() {
    var component = createComponent(BasicComposition.compose({
      aspect: {}
    }, BasicWebComponents.Aspect));
    assert.isNull(component.stack);
  });

  test("after created lifecycle method, stack contains just that aspect", function() {
    var component = createComponent(BasicComposition.compose({
      aspect: {}
    }, BasicWebComponents.Aspect));
    component.created();
    assert.equal(component.stack.aspects.length, 1);
    assert.equal(component.stack.aspects[0], component.aspect);
  });

  test("invoke stack method on single-aspect stack", function() {
    var methodCalled = false;
    var component = BasicComposition.compose({
      aspect: {
        method: function() {
          methodCalled = true;
        }        
      }
    }, BasicWebComponents.Aspect);
    component.created();
    component.invokeStackMethod('method');
    assert(methodCalled);
  });

});
