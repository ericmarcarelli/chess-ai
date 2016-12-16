(function($) {
  ChessAI.Modules.Board = function() {
    var self = this;
    var $board = $('.board');
    var pieceClasses = [
      '', 'black_rook', 'black_knight', 'black_bishop', 'black_king',
      'black_queen', 'black_pawn', 'white_rook', 'white_knight',
      'white_bishop', 'white_king', 'white_queen', 'white_pawn'
    ];
    var pieces = {
      empty : 0, bRook : 1, bKnight : 2, bBishop : 3, bKing : 4, bQueen : 5,
      bPawn : 6, wRook : 7, wKnight : 8, wBishop : 9, wKing : 10, wQueen : 11,
      wPawn : 12
    };

    this.init = function() {
      self.setupBoard();
      self.getState();
      self.rotateBoard();
      return this;
    };

    /**
     * Set initial piece positions.
     * @return {ChessAI.Modules.Board}
     */
    this.setupBoard = function() {
      var state = [
        [ 1, 2, 3, 5, 4, 3, 2, 1],
        [ 6, 6, 6, 6, 6, 6, 6, 6],
        [ 0, 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0],
        [12,12,12,12,12,12,12,12],
        [ 7, 8, 9,11,10, 9, 8, 7]
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
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]
      ];
      var $squares = $board.find('.square');
      $squares.each(function(i, piece) {
        var row = parseInt(i / 8);
        var col = parseInt(i % 8);
        state[row][col] = $(piece).data('piece');
      });
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
     * @return {[type]} [description]
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
    }

    return this.init();
  };
})(jQuery);
