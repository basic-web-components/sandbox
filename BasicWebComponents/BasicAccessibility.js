var BasicAccessibility = {

  addFocusIndicatorStyles: function(element) {
    var target = element || this;
    target.addEventListener('focus', function() {
      this.style.outline = this._focusOutlineStyle;
      this.style.outline = this._focusOutlineStyleWebkit;
    }.bind(this));
    target.addEventListener('blur', function() {
      this.style.outline = '';
    }.bind(this));
  },

  makeFocusable: function(element) {
    var target = element || this;
    if (target.getAttribute('tabIndex') == null) {
      // Apply default tabIndex of zero, which puts element in document order.
      target.setAttribute('tabIndex', 0);
    }
  },

  _focusOutlineStyle: '1px dotted', /* Safari/IE */
  _focusOutlineStyleWebkit: 'auto 5px -webkit-focus-ring-color' /* Chrome/Webkit */

};
