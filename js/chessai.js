var ChessAI = {

  Modules: {},

  Lib: {
  },

  initialize: function() {
    var modules = [
      'Board'
    ];

    for (var m in modules) {
      new ChessAI.Modules[modules[m]]();
    }
  }
};

(function($) {
  $(document).ready(ChessAI.initialize);
})(jQuery);
