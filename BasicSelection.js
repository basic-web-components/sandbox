var BasicSelection = {

  decoratorInterface: [
    'selectFirst',
    'selectLast',
    'selectNext',
    'selectPrevious'
  ],

  // TODO: contentChanged nullifies selection if selected element is no longer
  // in the content.

  get selected() {
    return this.target ?
      this.target.selected :
      this._selected;
  },

  set selected(element) {
    if (this.target) {
      this.target.selected = element;
    } else {
      this._selected = element;
      // TODO: Raise selected-changed event?
    }
  },

  /**
   * Return the index of the selected item, or -1 if there is no selection.
   */
  get selectedIndex() {
    if (this.target) {
      return this.target.selectedIndex();
    } else {
      // Find index of selected item in flattened children.
      var selected = this.selected;
      if (selected == null) {
        return -1;
      }
      var children = this.flattenChildren;
      for (var i = 0, length = children.length; i < length; i++) {
        var child = children[i];
        if (child === selected) {
          return i;
        }
      }

      // Selection wasn't found. Most likely cause is that the DOM was
      // manipulated from underneath us.
      // TODO: Once we track content changes, turn this into an exception.
      return -1;
    }
  },

  set selectedIndex(index) {
    if (this.target) {
      this.target.selectedIndex = index;
    } else {
      var children = this.flattenChildren;
      var element;
      if (index < 0 || children.length === 0) {
        element = null;
      } else {
        index = Math.min(index, children.length);
        element = children[index];
      }
      this.selected = element;
    }
  },

  selectFirst: function() {
    if (this.target) {
      this.target.selectFirst();
    } else {
      this.selectedIndex = 0;
    }
  },

  selectLast: function() {
    if (this.target) {
      this.target.selectFirst();
    } else {
      this.selectedIndex = this.flattenChildren.length - 1;
    }
  },

  selectNext: function() {
    if (this.target) {
      this.target.selectNext();
    } else {
      this.selectedIndex++;
    }
  },

  selectPrevious: function() {
    if (this.target) {
      this.target.selectPrevious();
    } else {
      this.selectedIndex--;
    }
  },

  _selected: null

};
