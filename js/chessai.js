var ChessAI = {

  Modules: {},

  Lib: {
  },

  initialize: function() {
    var modules = [
      'Board', 'Options'
    ];

    for (var m in modules) {
      ChessAI.Modules[modules[m]] = new ChessAI.Modules[modules[m]]();
    }
  }
};

(function($) {
  $(document).ready(ChessAI.initialize);
})(jQuery);
