(function($) {
  ChessAI.Modules.Board = function() {
    var self = this;
    var $board = $('.board');
    var rotated = false;
    var P = ChessAI.Piece;

    this.init = function() {
      self.setupBoard();
      self.getState();
      self.setupPieceEvents();

      return this;
    };

    /**
     * Set initial piece positions.
     * @return {ChessAI.Modules.Board}
     */
    this.setupBoard = function() {
      var state = [
        [P.BlackRook, P.BlackKnight, P.BlackBishop, P.BlackQueen, P.BlackKing, P.BlackBishop, P.BlackKnight, P.BlackRook],
        [P.BlackPawn, P.BlackPawn, P.BlackPawn, P.BlackPawn, P.BlackPawn, P.BlackPawn, P.BlackPawn, P.BlackPawn],
        [P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty],
        [P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty],
        [P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty],
        [P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty],
        [P.WhitePawn, P.WhitePawn, P.WhitePawn, P.WhitePawn, P.WhitePawn, P.WhitePawn, P.WhitePawn, P.WhitePawn],
        [P.WhiteRook, P.WhiteKnight, P.WhiteBishop, P.WhiteQueen, P.WhiteKing, P.WhiteBishop, P.WhiteKnight, P.WhiteRook]
      ];
      this.setState(state);

      return this;
    };

    /**
     * Get current state of board in 8x8 array.
     * @return {Array}
     */
    this.getState = function() {
      var state = [
        [P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty],
        [P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty],
        [P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty],
        [P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty],
        [P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty],
        [P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty],
        [P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty],
        [P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty]
      ];
      var $squares = $board.find('.square');

      $squares.each(function(i, piece) {
        var $piece = $(piece);
        state[$piece.data('row')][$piece.data('col')] = $piece.data('piece');
      });

      return state;
    }

    /**
     * Write a state to the board
     * @param  {Array} state
     */
    this.setState = function(state) {
      for(var i = 0; i < 8; i++) {
        for(var j = 0; j < 8; j++) {
          var $square = $('.square_'+i+'x'+j);
          $square.attr('data-piece', state[i][j]);
        }
      }
    }

    /**
     * Rotate board
     * This is a visual effect only -- it does not change the state.
     */
    this.rotateBoard = function() {
      var $squares = $board.find('.square');
      var newSquares = [];
      $squares.each(function(i, piece) {
        newSquares.push(piece)
      });
      $squares.remove();
      for(var i = newSquares.length-1; i >= 0; i--) {
        $board.append(newSquares[i]);
      }
      self.setupPieceEvents();
      rotated = true;
    }

    /**
     * Add events to squares.
     */
    this.setupPieceEvents = function() {
      $board.find('.square').click(self.selectPiece);
    };

    /**
     * Select a piece and highlight potential moves.
     */
    this.selectPiece = function() {
      var square = $(this);
      var piece = $(this).data('piece');
      $board.find('.square').removeClass('highlight');
      if (piece != P.Empty) {
        var moves = ChessAI.LoadedModules.States.getMovesForSquare(self.getState(), square.data('row'), square.data('col'));
        for (var i = 0; i < moves.length; i++) {
          $board.find(self.squareClass(moves[i][0], moves[i][1])).addClass('highlight');
        }
      }
    };

    /**
     * Get class to selct a square based on row and col.
     * @param  {int} row
     * @param  {int} col
     * @return {String}
     */
    this.squareClass = function(row, col) {
      return '.square_'+row+'x'+col;
    };

    return this.init();
  };
})(jQuery);
