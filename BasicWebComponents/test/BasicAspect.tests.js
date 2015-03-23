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

  test("combined aspects share a concatenated stack", function() {
    var outer = BasicComposition.compose({
      aspect: {
        method: function() {
          results.push('outer');
        }
      }
    }, BasicWebComponents.Aspect);
    var inner = BasicComposition.compose({
      aspect: {
        method: function() {
          results.push('inner');
        }
      }
    }, BasicWebComponents.Aspect);
    outer.created();
    inner.created();
    BasicWebComponents.AspectStack.combine(outer, inner);
    assert.equal(outer.stack, inner.stack);
    assert.equal(outer.stack.aspects[0], outer.aspect);
    assert.equal(outer.stack.aspects[1], inner.aspect);
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
    component.stack.invokeMethod('method');
    assert(methodCalled);
  });

  test("invoke stack method works toward top of stack", function() {
    var results = [];
    var outer = BasicComposition.compose({
      aspect: {
        method: function() {
          results.push('outer');
        }
      }
    }, BasicWebComponents.Aspect);
    var inner = BasicComposition.compose({
      aspect: {
        method: function() {
          results.push('inner');
        }
      }
    }, BasicWebComponents.Aspect);
    outer.created();
    inner.created();
    // HACK
    var stack = outer.stack;
    stack.addAspect(inner.aspect);
    stack.invokeMethod('method');
    assert.equal(results.length, 2);
    assert.equal(results[0], 'inner');
    assert.equal(results[1], 'outer');
  });

});
