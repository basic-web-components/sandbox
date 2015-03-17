suite('BasicSelection', function() {

  this.timeout(2000);

  var container = document.getElementById('container');
  var selector;
  var item0;
  var item1;
  var item2;

  setup(function() {
    var fixture = document.createElement('basic-selector-test');
    container.appendChild(fixture);
    selector = fixture.$.selector;
    item0 = fixture.$.item0;
    item1 = fixture.$.item1;
    item2 = fixture.$.item2;
  });

  teardown(function() {
    container.innerHTML = '';
  });

  test("selected is initially null", function() {
    assert.isNull(selector.selected);
  });

  test('selectFirst selects first item', function() {
    selector.selectFirst();
    assert.equal(selector.selected, item0);
  });

  test('selectLast selects last item', function() {
    selector.selectLast();
    assert.equal(selector.selected, item2);
  });

  test('setting selectedIndex updates selected property', function() {
    selector.selectedIndex = 0;
    assert.equal(selector.selected, item0);
  });

  test('getting selectedIndex gets index of selected item', function() {
    selector.selectLast();
    assert.equal(selector.selectedIndex, 2);
  });

  test('selectedIndex is -1 for no selection', function() {
    assert.equal(selector.selectedIndex, -1);
  });

  test('selectNext selects next item', function() {
    selector.selectedIndex = 0;
    selector.selectNext();
    assert.equal(selector.selectedIndex, 1);
  });

  test('selectPrevious selects previous item', function() {
    selector.selectedIndex = 2;
    selector.selectPrevious();
    assert.equal(selector.selectedIndex, 1);
  });

});
