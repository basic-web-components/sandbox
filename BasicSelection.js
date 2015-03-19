var BasicSelection = {

  // TODO: Rename to targetInterface?
  decoratorInterface: [
    'selectFirst',
    'selectLast',
    'selectNext',
    'selectPrevious'
  ],

  /*
   * Return the index of the indicated item.
   */
  indexOfItem: function(item) {
    if (item == null) {
      return -1; // By definition
    }
    var children = this.flattenChildren;
    for (var i = 0, length = children.length; i < length; i++) {
      var child = children[i];
      if (child === item) {
        return i; // Found
      }
    }
    return -1; // Not found
  },

  // TODO: contentChanged nullifies selection if selected element is no longer
  // in the content.

  get selectedItem() {
    return this.target ?
      this.target.selectedItem :
      this._selectedItem;
  },

  set selectedItem(item) {
    if (this.target) {
      this.target.selectedItem = item;
    } else {
      var previousItem = this._selectedItem;
      if (previousItem) {
        // Remove previous selection.
        this._applySelection(previousItem, false);
      }
      this._selectedItem = item;
      if (item) {
        this._applySelection(item, true);      
      }
      // TODO: Raise selected-item-changed event
    }
  },

  /**
   * Return the index of the selected item, or -1 if there is no selection.
   */
  get selectedIndex() {
    if (this.target) {
      return this.target.selectedIndex;
    } else {
      // Find index of selected item in flattened children.
      var index = this.indexOfItem(this.selectedItem);

      // If index = -1, selection wasn't found. Most likely cause is that the
      // DOM was manipulated from underneath us.
      // TODO: Once we track content changes, turn this into an exception.
      return index;
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
      this.selectedItem = element;
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
      this.target.selectLast();
    } else {
      this.selectedIndex = this.flattenChildren.length - 1;
    }
  },

  selectNext: function() {
    if (this.target) {
      this.target.selectNext();
    } else {
      var children = this.flattenChildren;
      var length = children.length;
      var newIndex = this.selectedIndex + 1;
      if (newIndex < length) {
        this.selectedIndex = newIndex;
      }
    }
  },

  selectPrevious: function() {
    if (this.target) {
      this.target.selectPrevious();
    } else {
      var oldIndex = this.selectedIndex;
      if (oldIndex < 0) {
        // No selection.
        this.selectLast();
      } else {
        var newIndex = oldIndex - 1;
        if (newIndex >= 0) {
          this.selectedIndex = newIndex;
        }        
      }
    }
  },

  _applySelection: function(item, selected) {
    item.classList.toggle('selected', selected);
  },

  _selectedItem: null

};
