suite('basic-aspect', function() {

  var container = document.getElementById('container');

  teardown(function() {
    container.innerHTML = '';
  });

  test("default innerAspect is the first child that is itself an aspect");

});
