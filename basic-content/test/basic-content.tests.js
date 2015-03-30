suite('basic-content', function() {

  var container = document.getElementById('container');

  teardown(function() {
    // container.innerHTML = '';
  });

  test("on its own, returns its children", function() {
    var basicContent = document.createElement('basic-content');
    var div = document.createElement('div');
    basicContent.appendChild(div);
    var content = basicContent.content;
    assert.equal(content.length, 1);
    assert.equal(content[0], div);
  });

  test("in collective, returns children of bottommost aspect", function() {
    var outer = document.createElement('basic-content');
    var inner = document.createElement('basic-content');
    var div = document.createElement('div');
    inner.appendChild(div);
    outer.appendChild(inner);
    outer.assimilate(inner);
    var content = outer.content;
    assert.equal(content.length, 1);
    assert.equal(content[0], div);
  });

  test("when its children change, it invokes the contentChanged handler", function(done) {
    var basicContent = document.createElement('basic-content');
    container.appendChild(basicContent);
    flush(function() {
      assert.equal(basicContent.content.length, 0);
      var div = document.createElement('div');
      var aspect = {
        contribute: {
          contentChanged: function() {
            assert.equal(this.content.length, 1);
            assert.equal(this.content[0], div);
            done();
          }
        }
      };
      var collective = new Collective(aspect);
      collective.assimilate(basicContent);
      basicContent.appendChild(div);
    });
  });

  test("when the children of the bottommost aspect change, it invokes the contentChanged handler");

});