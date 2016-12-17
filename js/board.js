(function($) {
  ChessAI.Modules.Board = function() {
    var self = this;
    var $board = $('.board');
    var rotated = false;
    var P = ChessAI.Piece;
    var blackCanCastle = true;
    var whiteCanCastle = true;

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

      blackCanCastle = true;
      whiteCanCastle = true;
      $board.find('.square').removeClass('selected highlight');

      this.setState(state);

      return this;
    };

    /**
     * Get current state of board in 8x8 array.
     * @return {Array}
     */
    this.getState = function() {
      $board = $('.board');
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
        state[$piece.data('row')][$piece.data('col')] = getPiece($piece);
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
          setPiece($square, state[i][j]);
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
      $board.find('.square').click(self.selectSquare);
    };

    /**
     * Select a piece and highlight potential moves.
     */
    this.selectSquare = function() {
      var $square = $(this);
      var $selectedSquare = $board.find('.selected.square');

      if ($square.is($selectedSquare)) {
        $board.find('.square').removeClass('selected highlight');
        return;
      }

      if ($selectedSquare.length) {
        self.movePiece($selectedSquare, $square);
      }
      else {
        self.selectPiece($square);
      }
    };

    /**
     * Select a piece and highlight potential moves.
     * @param  {Object} $square
     */
    this.selectPiece = function($square) {
      var piece = getPiece($square);
      if (piece != P.Empty) {
        $square.addClass('selected');
        $('.options .cancel-move').prop('disabled', false);
        var moves = ChessAI.LoadedModules.States.getMovesForSquare(self.getState(), $square.data('row'), $square.data('col'));
        for (var i = 0; i < moves.length; i++) {
          $board.find(squareClass(moves[i][0], moves[i][1])).addClass('highlight');
        }
      }
    };

    /**
     * Move a piece from the selected square to the new square.
     * @param  {Object} $selectedSquare
     * @param  {Object} $square
     */
    this.movePiece = function($selectedSquare, $square) {
      setPiece($square, getPiece($selectedSquare));
      setPiece($selectedSquare, P.Empty);
      $board.find('.square').removeClass('selected');
      $board.find('.square').removeClass('highlight');
      $('.options .cancel-move').prop('disabled', true);
    };

    /**
     * Get piece from a square
     * @param {Object} $square
     * @return {ChessAI.Piece}
     */
    var getPiece = function($square) {
      return parseInt($square.attr('data-piece'));
    }

    /**
     * Set piece data to a square
     * @param {Object} $square
     * @param {ChessAI.Piece} piece
     */
    var setPiece = function($square, piece) {
      return $square.attr('data-piece', piece);
    }

    /**
     * Get class to selct a square based on row and col.
     * @param  {int} row
     * @param  {int} col
     * @return {String}
     */
    var squareClass = function(row, col) {
      return '.square_'+row+'x'+col;
    };

    return this.init();
  };
})(jQuery);
