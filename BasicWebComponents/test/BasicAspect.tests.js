suite('BasicAspect', function() {

  this.timeout(2000);

  var container = document.getElementById('container');

  teardown(function() {
    container.innerHTML = '';
  });

  test("aspect stack is initially null", function() {
    var fooAspect = BasicComposition.compose(BasicWebComponents.Aspect);
    assert.isNull(fooAspect.stack);
  });

});
