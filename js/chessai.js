var ChessAI = {

  Modules: {},
  LoadedModules: {},

  State: {
    board : [],
    rating : 0,
  },

  Piece: {
    Empty : 0, BlackRook : 1, BlackKnight : 2, BlackBishop : 3, BlackKing : 4,
    BlackQueen : 5, BlackPawn : 6, WhiteRook : 7, WhiteKnight : 8,
    WhiteBishop : 9, WhiteKing : 10, WhiteQueen : 11, WhitePawn : 12
  },

  initialize: function() {
    var modules = [
      'States', 'Board', 'Options'
    ];

    for (var m in modules) {
      ChessAI.LoadedModules[modules[m]] = new ChessAI.Modules[modules[m]]();
    }
  }
};

(function($) {
  $(document).ready(ChessAI.initialize);
})(jQuery);
