suite('BasicSelection', function() {

  this.timeout(2000);

  var container = document.getElementById('container');

  teardown(function() {
    container.innerHTML = '';
  });

  test("first test", function() {
    assert(false);
  });

});
