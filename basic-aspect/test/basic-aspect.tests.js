suite('basic-aspect', function() {

  var container = document.getElementById('container');

  teardown(function() {
    container.innerHTML = '';
  });

  test("basic-aspect on its own creates its own collective", function() {
    var aspect = document.createElement('aspect-one');
    var collective = aspect.collective;
    assert.isDefined(collective);
    assert.equal(collective.aspects.length, 1);
    assert.equal(collective.aspects[0], aspect);
  });

  test("one basic-aspect can assimilate another", function() {
    var aspect1 = document.createElement('aspect-one');
    var aspect2 = document.createElement('aspect-two');
    aspect1.assimilate(aspect2);
    var collective = aspect1.collective;
    assert.equal(collective, aspect2.collective);
    assert.equal(collective.aspects.length, 2);
    assert.equal(collective.aspects[0], aspect1);
    assert.equal(collective.aspects[1], aspect2);
  });

  test("can invoke collective method on a basic-aspect in a collective", function() {
    var aspect1 = document.createElement('aspect-one');
    var aspect2 = document.createElement('aspect-two');
    aspect1.assimilate(aspect2);

    results = [];
    aspect1.method('foo');
    assert.deepEqual(results, ['foo two', 'foo one']);

    // Results should be same calling method on either aspect.
    results = [];
    aspect2.method('foo');
    assert.deepEqual(results, ['foo two', 'foo one']);
  });

  test("aspects can be applied to class prototype");
  test("aspect can be applied to multiple classes without interference");

});
