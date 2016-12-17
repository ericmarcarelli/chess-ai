(function($) {
  ChessAI.Modules.Board = function() {
    var self = this;
    var $board = $('.board');

    this.init = function() {
      self.setupBoard();
      self.getState();
      var moves = ChessAI.Modules.States.getMovesForSquare(self.getState(), 1, 1);
      console.log(moves);
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
    }

    return this.init();
  };
})(jQuery);
