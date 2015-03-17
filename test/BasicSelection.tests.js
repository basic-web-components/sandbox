suite('BasicSelection', function() {

  this.timeout(2000);

  var container = document.getElementById('container');
  var selector;
  var item0;
  var item1;
  var item2;
  var outer;
  var inner;

  var createSimpleSelector = function() {
    var fixture = document.createElement('basic-selector-simple');
    container.appendChild(fixture);
    selector = fixture.$.selector;
    item0 = fixture.$.item0;
    item1 = fixture.$.item1;
    item2 = fixture.$.item2;
  };

  var createWrappedSelector = function() {
    var fixture = document.createElement('basic-selector-wrapped');
    container.appendChild(fixture);
    outer = fixture.$.outer;
    inner = fixture.$.inner;
    item0 = fixture.$.item0;
    item1 = fixture.$.item1;
    item2 = fixture.$.item2;
  };

  teardown(function() {
    container.innerHTML = '';
  });

  test("selectedItem is initially null", function() {
    createSimpleSelector();
    assert.isNull(selector.selectedItem);
  });

  test("selected item gets .selected class, removes class from previous selection", function() {
    createSimpleSelector();
    selector.selectedItem = item0;
    assert.isTrue(item0.classList.contains('selected'));
    assert.isFalse(item1.classList.contains('selected'));
    selector.selectedItem = item1;
    assert.isFalse(item0.classList.contains('selected'));
    assert.isTrue(item1.classList.contains('selected'));
  });

  test('selectFirst selects first item', function() {
    createSimpleSelector();
    selector.selectFirst();
    assert.equal(selector.selectedItem, item0);
  });

  test('selectLast selects last item', function() {
    createSimpleSelector();
    selector.selectLast();
    assert.equal(selector.selectedItem, item2);
  });

  test('setting selectedIndex updates selectedItem property', function() {
    createSimpleSelector();
    selector.selectedIndex = 0;
    assert.equal(selector.selectedItem, item0);
  });

  test('getting selectedIndex gets index of selectedItem item', function() {
    createSimpleSelector();
    selector.selectLast();
    assert.equal(selector.selectedItem, item2);
    assert.equal(selector.selectedIndex, 2);
  });

  test('selectedIndex is -1 for no selection', function() {
    createSimpleSelector();
    assert.equal(selector.selectedIndex, -1);
  });

  test('selectNext selects next item', function() {
    createSimpleSelector();
    selector.selectedIndex = 0;
    selector.selectNext();
    assert.equal(selector.selectedIndex, 1);
  });

  test('selectNext past last item has no effect', function() {
    createSimpleSelector();
    selector.selectedIndex = 2;
    selector.selectNext();
    assert.equal(selector.selectedIndex, 2);
  });

  test('selectPrevious selects previous item', function() {
    createSimpleSelector();
    selector.selectedIndex = 2;
    selector.selectPrevious();
    assert.equal(selector.selectedIndex, 1);
  });

  test('selectPrevious past first item has no effect', function() {
    createSimpleSelector();
    selector.selectedIndex = 0;
    selector.selectPrevious();
    assert.equal(selector.selectedIndex, 0);
  });

  test('when content changes, selectedItem item can be retained');
  test('when selectedItem item is removed, selectedItem becomes null');

  test('delegate selection to wrapped selector', function() {
    createWrappedSelector();
    assert.equal(outer.selectedIndex, -1);
    assert.equal(inner.selectedIndex, -1);
    inner.selectFirst();
    assert.equal(outer.selectedIndex, 0);
    assert.equal(inner.selectedIndex, 0);
    outer.selectLast();
    assert.equal(outer.selectedIndex, 2);
    assert.equal(inner.selectedIndex, 2);
  });

  test('track change when decorated selector raises selectedItem-change event');

});
