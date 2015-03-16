var BasicSelection = {

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

  get selectedIndex() {
    if (this.target) {
      return this.target.selectedIndex();
    } else {
      // TODO: Find index of selected item in flattened children.
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
      this.target.selectNext();
    } else {
      this.selectedIndex++;
    }
  },

  _decoratorInterface: [
    'selectFirst',
    'selectLast',
    'selectNext',
    'selectPrevious'
  ],

  _selected: null

};
