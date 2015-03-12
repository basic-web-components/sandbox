var BasicAccessibilityHelpers = {

  addFocusIndicatorStyles: function(element) {
    var target = element || this;
    target.addEventListener('focus', function() {
      console.log('focus');       
      this.style.outline = this._focusOutlineStyle;
      this.style.outline = this._focusOutlineStyleWebkit;
    }.bind(this));
    target.addEventListener('blur', function() {
      this.style.outline = null;
    }.bind(this));
  },

  _focusOutlineStyle: '1px dotted', /* Safari/IE */
  _focusOutlineStyleWebkit: 'auto 5px -webkit-focus-ring-color' /* Chrome/Webkit */

};
