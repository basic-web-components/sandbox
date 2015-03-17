suite('BasicComposition', function() {

  test('combined functions are all executed', function() {
    var f1executed = false;
    var f2executed = false;
    var f3executed = false;
    var f1 = function() {
      f1executed = true;
    };
    var f2 = function() {
      f2executed = true;
    };
    var f3 = function() {
      f3executed = true;
    };
    var combined = BasicComposition.combineFunctions(f1, f2, f3);
    combined();
    assert(f1executed);
    assert(f2executed);
    assert(f3executed);
  });

  // test('combined setters are all executed', function() {
  //   var setter1value = false;
  //   var setter2value = false;
  //   var object1 = {
  //     set value(x) {
  //       setter1value = x;
  //     }
  //   };
  //   var object2 = {
  //     set value(value) {
  //       setter2value = x;
  //     }
  //   };
  //   var setter1 = Object.getOwnProperty ...
  //   var combined = BasicComposition.combineSetters(setter1, setter2);
  //   combined.value = 1;
  //   assert.equal(setter1value, 1);
  //   assert.equal(setter2value, 1);
  // });

  test('no arguments returns empty object', function() {
    var result = BasicComposition.compose();
    assert.deepEqual(result, {});
  });

  test('single argument returns that same object', function() {
    var obj = {
      x: 1
    };
    var result = BasicComposition.compose(obj);
    assert.deepEqual(result, obj);
  });

  test('two arguments combines non-overlapping members', function() {
    var result = BasicComposition.compose({
      x: 1
    }, {
      y: 2
    });
    assert.deepEqual(result, {
      x: 1,
      y: 2
    });
  });

  test('object with overlapping scalar member has last member win', function() {
    var result = BasicComposition.compose({
      x: 1
    }, {
      x: 2
    });
    assert.deepEqual(result, {
      x: 2
    });
  });

  test('overlapping function members are combined', function() {
    var f1executed = false;
    var f2executed = false;
    var result = BasicComposition.compose({
      f: function(arg) {
        assert.equal(arg, 1);
        f1executed = true;
      }
    }, {
      f: function(arg) {
        assert.equal(arg, 1);
        f2executed = true;
      }
    });
    result.f(1);
    assert(f1executed);
    assert(f2executed);
  });

  test('overlapping getters has last writer win', function() {
    var getter1executed = false;
    var getter2executed = false;
    var composed = BasicComposition.compose({
      get value() {
        getter1executed = true;
        return 1;
      }
    }, {
      get value() {
        getter2executed = true;
        return 2;
      }
    });
    var result = composed.value;
    assert.isFalse(getter1executed);
    assert.isTrue(getter2executed);
    assert.equal(result, 2);
  });

  test('Polymer element with composed mixin fires both ready handlers', function() {
    var element = document.createElement('composed-mixin-test');
    assert(element.normalReadyCalled);
    assert(element.mixinReadyCalled);
  });

});
