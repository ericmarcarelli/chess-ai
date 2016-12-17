var ChessAI = {

  Modules: {},

  State: {
    board : [],
    rating : 0,
  },

  Piece: {
    empty : 0, bRook : 1, bKnight : 2, bBishop : 3, bKing : 4, bQueen : 5,
    bPawn : 6, wRook : 7, wKnight : 8, wBishop : 9, wKing : 10, wQueen : 11,
    wPawn : 12
  },

  initialize: function() {
    var modules = [
      'Board', 'Options', 'States'
    ];

    for (var m in modules) {
      ChessAI.Modules[modules[m]] = new ChessAI.Modules[modules[m]]();
    }
  }
};

(function($) {
  $(document).ready(ChessAI.initialize);
})(jQuery);
