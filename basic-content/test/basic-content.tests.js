suite('basic-content', function() {

  var container = document.getElementById('container');

  teardown(function() {
    container.innerHTML = '';
  });

  test("on its own, returns its children");
  test("in collective, returns children of bottommost aspect");
  test("when its children change, it invokes the contentChanged handler");
  test("when the children of the bottommost aspect change, it invokes the contentChanged handler");

});
