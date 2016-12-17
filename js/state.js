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
     * @return {Array} moves
     */
    this.getMovesForSquare = function(state, row, col) {
      var moves = [];
      var piece = state[row][col];
      var move = new ChessAI.Move;
      move.piece = piece;
      move.startRow = row;
      move.startCol = col;

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
        case P.WhiteKnight:
          var offsets = [[-2,1], [-1,2], [1,2], [2,1], [2,-1], [1,-2], [-1,-2], [-2,-1]];
          for(var i = 0; i < offsets.length; i++) {
            if (validMove(piece, state, row + offsets[i][0], col + offsets[i][1])) {
              moves.push(new ChessAI.Move(piece, row, col, row + offsets[i][0], col + offsets[i][1]));
            }
          }
          break;

        case P.BlackKing:
        case P.WhiteKing:
          for(var i = -1; i < 2; i++) {
            for(var j = -1; j < 2; j++) {
              if (validMove(piece, state, row + i, col + j)) {
                moves.push(new ChessAI.Move(piece, row, col, row + i, col + j));
              }
            }
          }
          break;

        case P.BlackPawn:
        case P.WhitePawn:
          var dir = piece == P.BlackPawn ? 1 : -1;
          var initialRow = piece == P.BlackPawn ? 1 : 6;

          // initial move
          if (row == initialRow && state[row+(dir*2)][col] == P.Empty) {
            moves.push(new ChessAI.Move(piece, row, col, row+(dir*2), col));
          }
          // regular advance
          if (state[row+dir][col] == P.Empty) {
            moves.push(new ChessAI.Move(piece, row, col, row+dir, col));
          }

          // captures
          if (col > 0) {
            if (state[row+dir][col-1] != P.Empty &&
              canCapture(piece, state[row+dir][col-1])) {
              moves.push(new ChessAI.Move(piece, row, col, row+dir, col-1));
            }
          }
          if (col < 7) {
            if (state[row+dir][col+1] != P.Empty &&
              canCapture(piece, state[row+dir][col+1])) {
              moves.push(new ChessAI.Move(piece, row, col, row+dir, col+1));
            }
          }
          break;
      }

      // check list for check

      return moves;
    };

    /**
     * Determine if the attacker can capture the target piece.
     * @param  {ChessAI.Piece} attacker
     * @param  {ChessAI.Piece} target
     * @return {bool}
     */
    var canCapture = function(attacker, target) {
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

    /**
     * Checks if a potential move by a piece in a state is valid.
     * This function is not intended for pawns.
     * @todo check
     *
     * @param  {ChessAI.Piece} piece
     * @param  {ChessAI.State} state
     * @param  {int} row
     * @param  {int} col
     * @return {bool}
     */
    var validMove = function(piece, state, row, col) {
      // piece does not actually move
      if (row == 0 && col == 0)
        return false;
      // piece would move off board
      if (row < 0 || col < 0 || row > 7 || col > 7)
        return false;
      var target = state[row][col];
      return (target == P.Empty || canCapture(piece, target));
    }

    return this.init();
  };
})(jQuery);
