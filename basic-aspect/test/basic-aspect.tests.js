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

  test("aspects can be applied to class prototype");
  test("aspect can be applied to multiple classes without interference");

});
