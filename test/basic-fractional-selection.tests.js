suite('basic-fractional-selection', function() {

  this.timeout(2000);

  var container = document.getElementById('container');

  teardown(function() {
    container.innerHTML = '';
  });

  test('selectedIndex is initially zero', function(done) {
    var fixture = document.createElement('basic-fractional-selection');
    assert.equal(fixture.selectedIndex, 0);
    done();
  });

});
