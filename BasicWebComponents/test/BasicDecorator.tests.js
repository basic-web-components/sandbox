suite('BasicDecorator', function() {

  this.timeout(2000);

  var container = document.getElementById('container');

  teardown(function() {
    container.innerHTML = '';
  });

  test("throw an error if no interface is specified", function() {
    var decorator = document.createElement('decorator-null');
    // Add content and attach to force check for target, which will throw an
    // exception because no interface is defined.
    var div = document.createElement('div');
    decorator.appendChild(div);
    assert.throws(function() {
      decorator.attached(); // Force attached handler to do its check.
    });
  });

  test("if no children exist, default target is null", function() {
    var decorator = document.createElement('decorator-test');
    assert.isNull(decorator.target);
  });

  test("if interface is defined, target is null if no child has that interface", function() {
    var outer = document.createElement('decorator-test');
    var inner = document.createElement('div');
    outer.appendChild(inner);
    assert.isNull(outer.target);
  });

  test("if interface is defined, target is first child that has that interface", function(done) {
    var outer = document.createElement('decorator-test');
    var inner = document.createElement('decorator-test');
    outer.appendChild(inner);
    container.appendChild(outer);
    flush(function() {
      assert.equal(outer.target, inner);
      done();
    });
  });

  test("calling decorator method with no target invokes decorator's implementation", function() {
    var outer = document.createElement('decorator-test');
    outer.foo();
    assert(outer._fooCalled);
  });

  test("calling decorator method with target invokes target's implementation", function(done) {
    var outer = document.createElement('decorator-test');
    var inner = document.createElement('decorator-test');
    outer.appendChild(inner);
    container.appendChild(outer);
    flush(function() {
      outer.foo();
      assert.isFalse(outer._fooCalled);
      assert.isTrue(inner._fooCalled);
      done();
    });
  });

});
