var ChessAI = {

  Modules: {},
  LoadedModules: {},

  Lib: {},

  Piece: {
    Empty : 0, BlackRook : 1, BlackKnight : 2, BlackBishop : 3, BlackKing : 4,
    BlackQueen : 5, BlackPawn : 6, WhiteRook : 7, WhiteKnight : 8,
    WhiteBishop : 9, WhiteKing : 10, WhiteQueen : 11, WhitePawn : 12
  },

  Color: {
    Empty : 0,
    Black : 1,
    White : 2,
    getFromPiece : function(piece) {
      if (piece == 0)
        return 0;
      if (piece < 7)
        return 1;
      return 2;
    },
    flipColor : function(color) {
      if (color == 1) return 2;
      return 1;
    }
  },

  State: function(board, rating){
    this.board = board !== undefined ? board : [];
    this.rating = rating !== undefined ? rating : 0;
    this.moves = [];
    return this;
  },

  Move: function(piece, startRow, startCol, endRow, endCol) {
    this.piece = piece !== undefined ? piece : 0;
    this.startRow = startRow !== undefined ? startRow : 0;
    this.startCol = startCol !== undefined ? startCol : 0;
    this.endRow = endRow !== undefined ? endRow : 0;
    this.endCol = endCol !== undefined ? endCol : 0;
    return this;
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

ChessAI.Lib.copy = function(o) {
  var out, v, key;
  out = Array.isArray(o) ? [] : {};
  for (key in o) {
    v = o[key];
    out[key] = (typeof v === "object") ? ChessAI.Lib.copy(v) : v;
  }
  return out;
};

(function($) {
  $(document).ready(ChessAI.initialize);
})(jQuery);
