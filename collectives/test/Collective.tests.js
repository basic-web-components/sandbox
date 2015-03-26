suite('Collective', function() {

  test("new collective has no aspects or member functions", function() {
    var collective = new Collective();
    assert.equal(collective.aspects.length, 0);
  });

  test("assimilate aspect that doesn't yet belong to a collective", function() {
    var collective = new Collective();
    var aspect = {
      contribute: {
        method: function() {}
      }
    };
    collective.assimilate(aspect);

    // Collective should contain just this aspect.
    assert.equal(collective.aspects.length, 1);
    assert.equal(collective.aspects[0], aspect);

    // Aspect should now declare itself to be part of this collective.
    assert.equal(aspect.collective, collective);

    // Stack's methods should reference this aspect's implementation.
    // assert.equal(component.stack.methods.method.length, 1);
    // assert.equal(component.stack.methods.method[0], component);
  });

  test("Collective constructor accepts a set of entities to assimilate", function() {
    var aspect1 = {};
    var aspect2 = {};
    var collective = new Collective(aspect1, aspect2);
    assert.equal(collective.aspects.length, 2);
    assert.equal(collective.aspects[0], aspect1);
    assert.equal(collective.aspects[1], aspect2);
    assert.equal(aspect1.collective, collective);
    assert.equal(aspect2.collective, collective);
  });

  test("assimilate collective", function() {
    var aspect1 = {};
    var collective1 = new Collective(aspect1);
    var aspect2 = {};
    var collective2 = new Collective(aspect2);
    collective1.assimilate(collective2);
    assert.equal(collective1.aspects.length, 2);
    assert.equal(collective1.aspects[0], aspect1);
    assert.equal(collective1.aspects[1], aspect2);
    assert.equal(aspect1.collective, collective1);
    assert.equal(aspect2.collective, collective1);
    assert.equal(collective2.aspects.length, 0);
  });

  test("assimilate aspect that already belongs to a collective", function() {
    var aspect1 = {};
    var collective1 = new Collective(aspect1);
    var aspect2 = {};
    var collective2 = new Collective(aspect2);
    collective1.assimilate(aspect2);
    assert.equal(collective1.aspects.length, 2);
    assert.equal(collective1.aspects[0], aspect1);
    assert.equal(collective1.aspects[1], aspect2);
    assert.equal(aspect1.collective, collective1);
    assert.equal(aspect2.collective, collective1);
    assert.equal(collective2.aspects.length, 0);
  });

  test("collective methods are union of assimilated aspect methods", function() {
    var aspect1 = {
      contribute: {
        foo: function() {},
        // Doesn't implement bar.
        bletch: function() {}
      }
    };
    var aspect2 = {
      contribute: {
        // Doesn't implement foo.
        bar: function() {},
        bletch: function() {}
      }
    };
    var collective = new Collective(aspect1, aspect2);
    var methods = collective.methods;
    assert.equal(methods.foo.length, 1);
    assert.equal(methods.bar.length, 1);
    assert.equal(methods.bletch.length, 2);
  });

  test("collective method executes that method on all aspects that have it", function() {
    var results = [];
    var aspect1 = {
      contribute: {
        method: function(arg) {
          results.push('outermost ' + arg);
        }
      }
    };
    var aspect2 = {
      contribute: {
        // Does not implement method in question.
      }
    };
    var aspect3 = {
      contribute: {
        method: function(arg) {
          results.push('innermost ' + arg);
        }
      }
    };
    var collective = new Collective(aspect1, aspect2, aspect3);
    collective.invokeMethod('method', ['foo']);
    assert.equal(results.length, 2);
    assert.equal(results[0], 'innermost foo');
    assert.equal(results[1], 'outermost foo');
  });

  test("aspect's collectiveChanged handler invoked when collective changes", function() {
    var count = 0;
    var aspect = {
      contribute: {
        collectiveChanged: function() {
          count++;
        }
      }
    };
    var collective1 = new Collective(aspect);
    assert.equal(count, 1);
    var collective2 = new Collective(collective1);
    assert.equal(count, 2);
  });

  test("collective decorates its aspects with all the collective's methods", function() {
    var aspect1 = {
      contribute: {
        getName: function() {
          return this.name;
        }
      },
      name: 'aspect1'
    };
    var aspect2 = {
      contribute: {
        // Does not implement getName.
      },
      name: 'aspect2'
    };
    var collective = new Collective(aspect1, aspect2);
    assert.equal(aspect1.getName(), 'aspect1');
    // The return value comes from the outermost component, so it's the same
    // regardless of which component we use to invoke the method.
    assert.equal(aspect2.getName(), 'aspect1');
  });

});
