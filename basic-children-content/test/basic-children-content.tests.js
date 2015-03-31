suite('basic-children-content', function() {

  var container = document.getElementById('container');

  teardown(function() {
    container.innerHTML = '';
  });

  test("on its own, returns its children", function() {
    var basicContent = document.createElement('basic-children-content');
    var div = document.createElement('div');
    basicContent.appendChild(div);
    var content = basicContent.content;
    assert.equal(content.length, 1);
    assert.equal(content[0], div);
  });

  test("in collective, returns children of bottommost aspect", function() {
    var outer = document.createElement('basic-children-content');
    var inner = document.createElement('basic-children-content');
    var div = document.createElement('div');
    inner.appendChild(div);
    outer.appendChild(inner);
    outer.assimilate(inner);
    var content = outer.content;
    assert.equal(content.length, 1);
    assert.equal(content[0], div);
  });

  test("when its children change, it invokes the contentChanged handler", function(done) {
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
    var basicContent = document.createElement('basic-children-content');
    container.appendChild(basicContent);
    flush(function() {
      assert.equal(basicContent.content.length, 0);
      var collective = new Collective(aspect);
      collective.assimilate(basicContent);
      basicContent.appendChild(div);
    });
  });

  test("when the children of the bottommost aspect change, it invokes the contentChanged handler", function(done) {
    var div = document.createElement('div');
    var changeDetectorAspect = {
      contribute: {
        contentChanged: function() {
          assert.equal(this.content.length, 1);
          assert.equal(this.content[0], div);
          done();
        }
      }
    };
    var outer = document.createElement('basic-children-content');
    var inner = document.createElement('basic-aspect');
    outer.appendChild(inner);
    flush(function() {
      var collective = new Collective(changeDetectorAspect, outer, inner);
      assert.equal(outer.content.length, 0);
      inner.appendChild(div);
    });
  });

  test("content returns flattened list of distributed content", function() {
    var fixture = document.createElement('content-distribution-test');
    var div = document.createElement('div');
    fixture.appendChild(div);
    var basicContent = fixture.shadowRoot.querySelector('basic-children-content');
    var content = basicContent.content;
    assert.equal(content.length, 1);
    assert.equal(content[0], div);
  });

});
