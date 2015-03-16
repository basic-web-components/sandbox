suite('BasicDecorator', function() {

  test("if no children exist, default target is null", function() {
    var decorator = document.createElement('decorator-test');
    assert.isNull(decorator.target);
  });

  test("if no interface is specified, default target is the first child", function() {
    var outer = document.createElement('decorator-null');
    var inner = document.createElement('div');
    outer.appendChild(inner);
    outer.contentChanged(); // TODO: Remove need to force this
    assert.equal(outer.target, inner);
  });

  test("if interface is defined, target is null if no child has that interface", function() {
    var outer = document.createElement('decorator-test');
    var inner = document.createElement('div');
    outer.appendChild(inner);
    outer.contentChanged(); // TODO: Remove need to force this
    assert.isNull(outer.target);
  });

  test("if interface is defined, target is first child that has that interface", function() {
    var outer = document.createElement('decorator-test');
    var inner = document.createElement('decorator-test');
    outer.appendChild(inner);
    outer.contentChanged(); // TODO: Remove need to force this
    assert.equal(outer.target, inner);
  });

  test("calling decorator method with no target invokes decorator's implementation");
  test("calling decorator method with target invokes target's implementation");
  test('if content changes, implicit target changes');
  test('if content changes, explicit target does not change');

});
