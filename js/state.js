(function($) {
  ChessAI.Modules.States = function() {
    var self = this;
    var P = ChessAI.Piece;

    this.init = function() {
      return this;
    };

    /**
     * Get array of legal moves for a square.
     * @todo currently missing moves such as castling and en passant capture
     * @todo does not account for moves that result in check
     *
     * @param  {Array} state  8x8 array of board
     * @param  {int} row
     * @param  {int} col
     * @return {Array} [row,col] of potential moves
     */
    this.getMovesForSquare = function(state, row, col) {
      var moves = [];
      var piece = state[row][col];
      switch(piece) {
        // the queen falls through to all the moves of the bishop and rook
        case P.BlackQueen:
        case P.WhiteQueen:

        case P.WhiteBishop:
        case P.BlackBishop:
        case P.WhiteRook:
        case P.BlackRook:
          break;

        case P.BlackKnight:
        case P.WhiteKing:
          break;

        case P.BlackKing:
        case P.WhiteKing:
          break;

        case P.BlackPawn:
        case P.WhitePawn:
          var dir = piece == P.BlackPawn ? 1 : -1;
          var initialRow = piece == P.BlackPawn ? 1 : 6;

          // initial move
          if (row == initialRow && state[row+(dir*2)][col] == P.Empty) {
            moves.push([row+(dir*2),col]);
          }
          // regular advance
          if (state[row+dir][col] == P.Empty) {
            moves.push([row+dir,col]);
          }
          // captures
          if (col > 0) {
            if (state[row+dir][col-1] != P.Empty &&
              this.canCapture(piece, state[row+dir][col-1])) {
              moves.push([row+dir,col-1]);
            }
          }
          if (col < 7) {
            if (state[row+dir][col+1] != P.Empty &&
              this.canCapture(piece, state[row+dir][col+1])) {
              moves.push([row+dir,col+1]);
            }
          }
          break;

      };

      /**
       * Determine if the attacker can capture the target piece.
       * @param  {ChessAI.Piece} attacker
       * @param  {ChessAI.Piece} target
       * @return {bool}
       */
      this.canCapture = function(attacker, target) {
        if (!attacker)
          return false;

        if (attacker < P.WhiteRook && target > P.BlackPawn && target != P.WhiteKing) {
          return true;
        }
        if (attacker > P.BlackPawn && target < P.WhiteRook && target != P.BlackKing) {
          return true;
        }

        return false;
      };

      return moves;
    };

    return this.init();
  };
})(jQuery);
