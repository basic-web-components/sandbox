// Placeholder -- will eventually subsume/replace BasicContentHelpers.

var BasicContent = BasicComposition.compose(
  BasicContentHelpers,
  {

    attached: function() {
      this.observeContentChanges();
    },

    detached: function() {
      this.observeContentChanges(false);
    }

  }
);
