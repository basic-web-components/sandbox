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

  test("combining stacks concatenates their aspects", function() {
    var stack1 = new BasicWebComponents.AspectStack();
    var aspect1 = {}
    stack1.addAspect(aspect1);
    var stack2 = new BasicWebComponents.AspectStack();
    var aspect2 = {}
    stack2.addAspect(aspect2);
    var combined = BasicWebComponents.AspectStack.combine(stack1, stack2);
    assert.equal(combined.aspects[0], aspect1);
    assert.equal(combined.aspects[1], aspect2);
  });

  test("setting innerAspect combines stacks", function() {
    var outerComponent = BasicComposition.compose({
      aspect: {
        method: function() {
          results.push('outer');
        }
      }
    }, BasicWebComponents.Aspect);
    var innerComponent = BasicComposition.compose({
      aspect: {
        method: function() {
          results.push('inner');
        }
      }
    }, BasicWebComponents.Aspect);
    outerComponent.created();
    innerComponent.created();
    outerComponent.innerAspect = innerComponent;
    assert.equal(outerComponent.innerAspect, innerComponent);
    assert.equal(innerComponent.outerAspect, outerComponent);
    assert.equal(outerComponent.stack, innerComponent.stack);
    assert.equal(outerComponent.stack.aspects[0], outerComponent.aspect);
    assert.equal(outerComponent.stack.aspects[1], innerComponent.aspect);
    assert.equal(outerComponent.stack.innermost, innerComponent.aspect);
    assert.equal(outerComponent.stack.outermost, outerComponent.aspect);
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

  test("stack method executes that method on all aspects that have it", function() {
    var results = [];
    var component1 = BasicComposition.compose({
      aspect: {
        method: function() {
          results.push('outermost');
        }
      }
    }, BasicWebComponents.Aspect);
    var component2 = BasicComposition.compose({
      aspect: {
        // Does not implement method in question.
      }
    }, BasicWebComponents.Aspect);
    var component3 = BasicComposition.compose({
      aspect: {
        method: function() {
          results.push('innermost');
        }
      }
    }, BasicWebComponents.Aspect);
    component1.created();
    component2.created();
    component3.created();
    component1.innerAspect = component2;
    component2.innerAspect = component3;
    component1.stack.invokeMethod('method');
    assert.equal(results.length, 2);
    assert.equal(results[0], 'innermost');
    assert.equal(results[1], 'outermost');
  });

});
