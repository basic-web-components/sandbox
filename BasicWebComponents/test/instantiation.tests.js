/*
 * These don't test Basic Web Components features, but confirm that the
 * underlying platform is behaving as expected.
 */

suite('instantation', function() {

  this.timeout(2000);

  var container = document.getElementById('container');

  var attachedElements;
  window.attachedHook = function(element) {
    attachedElements.push(element);
  };

  var readyElements;
  window.readyHook = function(element) {
    readyElements.push(element);
  };

  setup(function() {
    attachedElements = [];
    readyElements = [];
  });

  test("ready method is called", function() {
    var element = document.createElement('instantiation-test');
    assert.equal(readyElements.length, 1);
    assert.equal(readyElements[0], element);
  });

  test("attached method is called", function(done) {
    var element = document.createElement('instantiation-test');
    Polymer.dom(container).appendChild(element);
    flush(function() {
      assert.equal(attachedElements.length, 1);
      assert.equal(attachedElements[0], element);
      done();
    });
  });

  test("parent ready called before child", function(done) {
    var div = document.createElement('div');
    div.innerHTML = "<instantiation-test><instantiation-test></instantiation-test></instantiation-test>";
    Polymer.dom(container).appendChild(div);
    flush(function() {
      assert.equal(readyElements.length, 2);
      var parent = Polymer.dom(div).querySelector('instantiation-test');
      var child = Polymer.dom(parent).querySelector('instantiation-test');
      assert.equal(readyElements[0], parent);
      assert.equal(readyElements[1], child);
      done();
    });
  });

  test("parent attached called before child", function(done) {
    var div = document.createElement('div');
    div.innerHTML = "<instantiation-test><instantiation-test></instantiation-test></instantiation-test>";
    Polymer.dom(container).appendChild(div);
    flush(function() {
      assert.equal(attachedElements.length, 2);
      var parent = Polymer.dom(div).querySelector('instantiation-test');
      var child = Polymer.dom(parent).querySelector('instantiation-test');
      assert.equal(attachedElements[0], parent);
      assert.equal(attachedElements[1], child);
      done();
    });
  });

  test("shadow ready called before host", function(done) {
    var div = document.createElement('div');
    div.innerHTML = "<instantiation-test-wrapper></instantiation-test-wrapper>";
    Polymer.dom(container).appendChild(div);
    flush(function() {
      assert.equal(readyElements.length, 2);
      var host = Polymer.dom(div).querySelector('instantiation-test-wrapper');
      var shadow = Polymer.dom(host.root).querySelector('instantiation-test');
      assert.equal(readyElements[0], shadow);
      assert.equal(readyElements[1], host);
      done();
    });
  });

});
