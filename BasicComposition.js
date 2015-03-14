var BasicComposition = {

  compose: function() {

    var length = arguments.length;
    
    if (length === 0) {
      return {};
    } else if (length === 1) {
      return arguments[0];
    }

    // Multiple arguments
    var result = {};
    var functionsToCombine = {};
    [].forEach.call(arguments, function(argument) {
      for (var key in argument) {
        var value = argument[key];
        if (typeof value === 'function') {
          // Function member; combine.
          if (!functionsToCombine[key]) {
            functionsToCombine[key] = [];
          }
          functionsToCombine[key].push(value);
        } else {
          // Scalar or object member; last writer wins.
          result[key] = argument[key];
        }
      }
    });

    for (var key in functionsToCombine) {
      result[key] = this.combineFunctions.apply(this, functionsToCombine[key]);
    }

    return result;
  },

  // Given a list of functions, return a combined function that executes all of
  // them in order. This isn't true function composition, where the result of
  // one function is passed as an argument to the next. Here, all supplied
  // functions are passed the same arguments.
  combineFunctions: function() {
    var functions = [].slice.call(arguments);
    var combined = function functionWithMixins() {
      for (var i in functions) {
        functions[i].apply(this, arguments);
      }
    }
    return combined;
  }

};
