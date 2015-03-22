suite('basic-fractional-selection', function() {

  this.timeout(2000);

  test('selectedIndex is initially zero', function() {
    var fixture = document.createElement('basic-fractional-selection');
    assert.equal(fixture.selectedIndex, 0);
  });

  test('next increments selectedIndex', function() {
    var fixture = document.createElement('basic-fractional-selection');
    fixture.next();
    assert.equal(fixture.selectedIndex, 1);
  });

  test('next respects maximum', function() {
    var fixture = document.createElement('basic-fractional-selection');
    fixture.selectedIndex = 9;
    fixture.maximum = 9;
    fixture.next();
    assert.equal(fixture.selectedIndex, 9);
  });

  test('previous decrements selectedIndex', function() {
    var fixture = document.createElement('basic-fractional-selection');
    fixture.selectedIndex = 1;
    fixture.previous();
    assert.equal(fixture.selectedIndex, 0);
  });

  test('previous respects minimum', function() {
    var fixture = document.createElement('basic-fractional-selection');
    fixture.previous();
    assert.equal(fixture.selectedIndex, 0);
  });

  test('setting maximum below selectedIndex updates selectedIndex', function(done) {
    var fixture = document.createElement('basic-fractional-selection');
    fixture.selectedIndex = 5;
    fixture.maximum = 3;
    flush(function() {
      assert.equal(fixture.selectedIndex, 3);
      done();
    });
  });

  test('setting minimum above selectedIndex updates selectedIndex', function(done) {
    var fixture = document.createElement('basic-fractional-selection');
    fixture.minimum = 1;
    flush(function() {
      assert.equal(fixture.selectedIndex, 1);
      done();
    });
  });

  test('snap rounds to nearest index', function(done) {
    var fixture = document.createElement('basic-fractional-selection');
    fixture.selectedIndex = 0.5;
    flush(function() {
      fixture.snap();
      assert.equal(fixture.selectedIndex, 1);
      done();
    });
  });

  test('next snaps to index');
  test('previous snaps to index');

});
