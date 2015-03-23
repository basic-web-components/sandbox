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
      contribute: {}
    }, BasicWebComponents.Aspect));
    assert.isNull(component.stack);
  });

  test("after created lifecycle method, stack contains just that aspect", function() {
    var component = createComponent(BasicComposition.compose({
      contribute: {
        method: function() {}
      }
    }, BasicWebComponents.Aspect));
    component.created();
    assert.equal(component.stack.aspects.length, 1);
    assert.equal(component.stack.aspects[0], component);
    assert.equal(component.stack.methods.method.length, 1);
    assert.equal(component.stack.methods.method[0], component.contribute.method);
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
      contribute: {
        method: function() {
          results.push('outer');
        }
      }
    }, BasicWebComponents.Aspect);
    var innerComponent = BasicComposition.compose({
      contribute: {
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

    // Combined stack contains aspects of both.
    var combined = outerComponent.stack; // Can get stack from either one.
    assert.equal(combined, innerComponent.stack);
    assert.equal(combined.aspects[0], outerComponent);
    assert.equal(combined.aspects[1], innerComponent);
    assert.equal(combined.innermost, innerComponent);
    assert.equal(combined.outermost, outerComponent);

    // Combined stack has methods of both.
    assert.equal(combined.methods.method.length, 2);
    assert.equal(combined.methods.method[0], outerComponent.contribute.method);
    assert.equal(combined.methods.method[1], innerComponent.contribute.method);
  });

  test("stack method names are union of names of aspect methods", function() {
    var outerComponent = BasicComposition.compose({
      contribute: {
        foo: function() {},
        // Doesn't implement bar.
        bletch: function() {}
      }
    }, BasicWebComponents.Aspect);
    var innerComponent = BasicComposition.compose({
      contribute: {
        // Doesn't implement foo.
        bar: function() {},
        bletch: function() {}
      }
    }, BasicWebComponents.Aspect);
    outerComponent.created();
    innerComponent.created();
    outerComponent.innerAspect = innerComponent;
    var methodNames = outerComponent.stack.methodNames;
    assert.equal(methodNames.length, 3);
    assert.include(methodNames, 'foo');
    assert.include(methodNames, 'bar');
    assert.include(methodNames, 'bletch');
  });

  test("invoke stack method on single-aspect stack", function() {
    var methodCalled = false;
    var component = BasicComposition.compose({
      contribute: {
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
      contribute: {
        method: function() {
          results.push('outermost');
        }
      }
    }, BasicWebComponents.Aspect);
    var component2 = BasicComposition.compose({
      contribute: {
        // Does not implement method in question.
      }
    }, BasicWebComponents.Aspect);
    var component3 = BasicComposition.compose({
      contribute: {
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

  test("stack decorates all its components with the stack's methods", function() {
    var component1 = BasicComposition.compose({
      contribute: {
        getName: function() {
          return this.name;
        }
      },
      name: 'component1'
    }, BasicWebComponents.Aspect);
    var component2 = BasicComposition.compose({
      contribute: {
        // Does not implement getName.
      },
      name: 'component2'
    }, BasicWebComponents.Aspect);
    component1.created();
    component2.created();
    component1.innerAspect = component2;
    assert.equal(component1.getName(), 'component1');
    // The return value comes from the outermost component, so it's the same
    // regardless of which component we use to invoke the method.
    assert.equal(component2.getName(), 'component1');
  });

});
